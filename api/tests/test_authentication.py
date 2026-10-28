"""Session lifecycle and internal authentication security contracts."""

from copy import deepcopy
from datetime import datetime, timedelta, timezone
import hashlib
import os
from types import SimpleNamespace
import unittest
from unittest.mock import MagicMock, patch

from bson import ObjectId
from pymongo.errors import DuplicateKeyError, OperationFailure
from werkzeug.security import check_password_hash, generate_password_hash

from services.authentication.app import create_app


class MemoryCollection:
    """Exercise persistence semantics without requiring a MongoDB server."""

    def __init__(self):
        self.documents = []
        self.indexes = []

    def find_one(self, query):
        """Return a detached document as the MongoDB driver does."""
        return next(
            (
                deepcopy(document)
                for document in self.documents
                if all(document.get(key) == value for key, value in query.items())
            ),
            None,
        )

    def insert_one(self, document):
        """Assign an identifier and enforce indexed unique fields."""
        for field, options in self.indexes:
            if options.get("unique") and self.find_one({field: document.get(field)}):
                raise DuplicateKeyError("Duplicate value")
        document.setdefault("_id", ObjectId())
        self.documents.append(deepcopy(document))
        return SimpleNamespace(inserted_id=document["_id"])

    def update_one(self, query, updates):
        """Apply the atomic update operators used by session rotation and activity."""
        match = self.find_one(query)
        if match is None:
            return SimpleNamespace(matched_count=0)
        document = next(item for item in self.documents if item["_id"] == match["_id"])
        document.update(updates.get("$set", {}))
        for key, value in updates.get("$max", {}).items():
            previous = document[key]
            if previous.tzinfo is None:
                previous = previous.replace(tzinfo=timezone.utc)
            if previous < value:
                document[key] = value
        return SimpleNamespace(matched_count=1)

    def delete_one(self, query):
        """Remove only the matching persisted session."""
        match = self.find_one(query)
        if match is None:
            return SimpleNamespace(deleted_count=0)
        self.documents = [
            document for document in self.documents if document["_id"] != match["_id"]
        ]
        return SimpleNamespace(deleted_count=1)

    def create_index(self, field, **options):
        """Record requested schema constraints and expiry cleanup."""
        self.indexes.append((field, options))


class AuthenticationFixture(unittest.TestCase):
    """Provide an isolated service with a real password hash and an explicit clock."""

    INTERNAL_TOKEN = "private-backend-test-token"
    PASSWORD = "correct-password-for-tests"
    password_hash = ""

    @classmethod
    def setUpClass(cls):
        cls.password_hash = generate_password_hash(cls.PASSWORD)

    def setUp(self):
        environment = patch.dict(os.environ, {}, clear=True)
        environment.start()
        self.addCleanup(environment.stop)
        self.now = datetime(2026, 10, 27, 12, tzinfo=timezone.utc)
        self.app = create_app(
            {
                "TESTING": True,
                "AUTH_INTERNAL_TOKEN": self.INTERNAL_TOKEN,
                "SESSION_CLOCK": lambda: self.now,
                "MONGO_USERNAME": "",
                "MONGO_PASSWORD": "",
                "CORS_ORIGINS": [],
            }
        )
        self.addCleanup(self.app.extensions["mongo_client"].close)
        self.database = SimpleNamespace(
            users=MemoryCollection(), sessions=MemoryCollection()
        )
        self.app.extensions["mongo_db"] = self.database
        self.client = self.app.test_client()
        self.database.users.insert_one(
            {
                "email": "person@example.test",
                "name": "Test User",
                "password_hash": self.password_hash,
                "active": True,
            }
        )

    def send(self, path, *, token=None, csrf=None, payload=None):
        """Call a trusted internal route using explicit credential headers."""
        headers = {"X-Internal-Token": self.INTERNAL_TOKEN}
        if token is not None:
            headers["Authorization"] = f"Bearer {token}"
        if csrf is not None:
            headers["X-CSRF-Token"] = csrf
        return self.client.post(path, json=payload or {}, headers=headers)

    def login(self):
        """Create a real service session for subsequent lifecycle checks."""
        response = self.send(
            "/internal/login",
            payload={"email": "PERSON@example.test", "password": self.PASSWORD},
        )
        self.assertEqual(response.status_code, 200)
        return response.json


class SessionLifecycleTests(AuthenticationFixture):
    """Verify token, timeout, revocation, and CSRF guarantees."""

    def test_login_stores_only_the_session_verifier(self):
        """The persistent record never contains the reusable session token."""
        data = self.login()
        record = self.database.sessions.documents[0]
        self.assertEqual(
            record["token_hash"],
            hashlib.sha256(data["session_token"].encode()).hexdigest(),
        )
        self.assertNotIn(data["session_token"], repr(record))
        self.assertEqual(data["user"]["email"], "person@example.test")
        self.assertNotIn("password_hash", data["user"])
        self.assertGreaterEqual(len(data["session_token"]), 43)
        self.assertEqual(record["csrf_token"], data["csrf_token"])

    def test_unknown_and_incorrect_credentials_have_the_same_response(self):
        """Login does not reveal whether an account exists."""
        responses = [
            self.send("/internal/login", payload={"email": email, "password": "wrong"})
            for email in ("person@example.test", "unknown@example.test")
        ]
        for response in responses:
            self.assertEqual(response.status_code, 401)
            self.assertEqual(response.json, {"error": "invalid_credentials"})
        self.assertFalse(self.database.sessions.documents)

    def test_all_internal_routes_require_a_backend_secret(self):
        """The browser cannot call session endpoints as a trusted backend."""
        for endpoint in ("login", "session", "logout", "refresh", "unknown"):
            with self.subTest(endpoint=endpoint):
                response = self.client.post(f"/internal/{endpoint}", json={})
                self.assertEqual(response.status_code, 401)
        self.assertEqual(self.client.get("/health").status_code, 200)

    def test_missing_internal_configuration_fails_closed(self):
        """An absent service secret never enables anonymous internal access."""
        self.app.config["AUTH_INTERNAL_TOKEN"] = ""
        self.assertEqual(self.send("/internal/login").status_code, 503)

    def test_current_session_updates_activity_without_extending_lifetime(self):
        """Idle activity is renewed while the absolute expiry stays fixed."""
        data = self.login()
        self.now += timedelta(minutes=5)
        response = self.send("/internal/session", token=data["session_token"])
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json["expires_at"], data["expires_at"])
        self.assertNotIn("session_token", response.json)
        self.assertEqual(self.database.sessions.documents[0]["last_seen_at"], self.now)
        self.assertEqual(response.headers["Cache-Control"], "no-store")

    def test_an_unknown_token_is_rejected(self):
        """Arbitrary opaque values never create sessions automatically."""
        response = self.send("/internal/session", token="unknown-token")
        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.json, {"error": "authentication_required"})

    def test_absolute_expiration_is_enforced_before_ttl_cleanup(self):
        """Persisted expired records do not extend the authenticated lifetime."""
        data = self.login()
        self.database.sessions.documents[0]["expires_at"] = self.now
        response = self.send("/internal/session", token=data["session_token"])
        self.assertEqual(response.status_code, 401)
        self.assertFalse(self.database.sessions.documents)

    def test_idle_expiration_is_enforced_before_ttl_cleanup(self):
        """An otherwise unexpired session still expires after inactivity."""
        data = self.login()
        self.now += timedelta(seconds=1800)
        response = self.send("/internal/session", token=data["session_token"])
        self.assertEqual(response.status_code, 401)
        self.assertFalse(self.database.sessions.documents)

    def test_disabled_accounts_cannot_login_or_reuse_sessions(self):
        """Disabling an identity immediately invalidates its current sessions."""
        data = self.login()
        self.database.users.documents[0]["active"] = False
        self.assertEqual(
            self.send("/internal/session", token=data["session_token"]).status_code,
            401,
        )
        response = self.send(
            "/internal/login",
            payload={"email": "person@example.test", "password": self.PASSWORD},
        )
        self.assertEqual(response.status_code, 401)

    def test_session_mutations_require_matching_csrf(self):
        """Missing, incorrect, and Unicode CSRF values cannot revoke sessions."""
        data = self.login()
        for route in ("logout", "refresh"):
            for csrf in (None, "wrong", "\u2603"):
                with self.subTest(route=route, csrf=csrf):
                    response = self.send(
                        f"/internal/{route}", token=data["session_token"], csrf=csrf
                    )
                    self.assertEqual(response.status_code, 403)
        self.assertEqual(len(self.database.sessions.documents), 1)

    def test_logout_revokes_the_server_side_session(self):
        """A token that was accepted before logout cannot authenticate afterward."""
        data = self.login()
        response = self.send(
            "/internal/logout", token=data["session_token"], csrf=data["csrf_token"]
        )
        self.assertEqual(response.status_code, 200)
        self.assertFalse(self.database.sessions.documents)
        self.assertEqual(
            self.send("/internal/session", token=data["session_token"]).status_code,
            401,
        )

    def test_refresh_rotates_the_token_and_keeps_absolute_expiry(self):
        """The old token is revoked atomically when the new token is installed."""
        data = self.login()
        self.now += timedelta(minutes=1)
        response = self.send(
            "/internal/refresh", token=data["session_token"], csrf=data["csrf_token"]
        )
        self.assertEqual(response.status_code, 200)
        self.assertNotEqual(response.json["session_token"], data["session_token"])
        self.assertEqual(response.json["csrf_token"], data["csrf_token"])
        self.assertEqual(response.json["expires_at"], data["expires_at"])
        self.assertEqual(
            self.send("/internal/session", token=data["session_token"]).status_code,
            401,
        )
        self.assertEqual(
            self.send(
                "/internal/session", token=response.json["session_token"]
            ).status_code,
            200,
        )

    def test_logout_revokes_a_concurrently_rotated_session(self):
        """Rotation between lookup and revocation must not preserve a session."""
        data = self.login()
        original_delete = self.database.sessions.delete_one

        def delete_after_rotation(query):
            self.database.sessions.documents[0]["token_hash"] = "rotated-verifier"
            return original_delete(query)

        with patch.object(
            self.database.sessions, "delete_one", side_effect=delete_after_rotation
        ):
            response = self.send(
                "/internal/logout",
                token=data["session_token"],
                csrf=data["csrf_token"],
            )
        self.assertEqual(response.status_code, 200)
        self.assertFalse(self.database.sessions.documents)

    def test_database_failures_are_sanitized(self):
        """Responses do not expose credentials embedded in driver exceptions."""
        self.database.users = MagicMock()
        self.database.users.find_one.side_effect = OperationFailure("private-password")
        response = self.send(
            "/internal/login",
            payload={"email": "person@example.test", "password": self.PASSWORD},
        )
        self.assertEqual(response.status_code, 503)
        self.assertEqual(response.json, {"error": "authentication_unavailable"})
        self.assertNotIn("private-password", response.get_data(as_text=True))

    def test_naive_mongodb_timestamps_are_treated_as_utc(self):
        """The driver default timestamp representation remains supported."""
        data = self.login()
        record = self.database.sessions.documents[0]
        for key in ("expires_at", "last_seen_at"):
            record[key] = record[key].replace(tzinfo=None)
        self.assertEqual(
            self.send("/internal/session", token=data["session_token"]).status_code,
            200,
        )

    def test_revocation_during_lookup_does_not_restore_a_session(self):
        """A failed activity update cannot authenticate a revoked token."""
        data = self.login()
        self.database.sessions.update_one = MagicMock(
            return_value=SimpleNamespace(matched_count=0)
        )
        self.assertEqual(
            self.send("/internal/session", token=data["session_token"]).status_code,
            401,
        )

    def test_malformed_credentials_are_rejected(self):
        """Lists and oversized fields do not reach password verification."""
        for payload in (["email"], {"email": "x", "password": "x" * 1025}):
            self.assertEqual(
                self.send("/internal/login", payload=payload).status_code, 401
            )


class AuthenticationCommandTests(AuthenticationFixture):
    """Verify administrative setup without creating default accounts."""

    def test_create_user_hashes_the_hidden_password(self):
        """Account provisioning stores a password hash and no plaintext password."""
        result = self.app.test_cli_runner().invoke(
            args=["create-user", "--email", "new@example.test", "--name", "New User"],
            input=f"{self.PASSWORD}\n{self.PASSWORD}\n",
        )
        self.assertEqual(result.exit_code, 0, result.output)
        user = self.database.users.find_one({"email": "new@example.test"})
        self.assertTrue(check_password_hash(user["password_hash"], self.PASSWORD))
        self.assertNotIn("password", user)
        self.assertNotIn(self.PASSWORD, result.output)
        self.assertTrue(user["active"])

    def test_create_user_rejects_duplicate_email(self):
        """The unique email index reports a usable error without driver details."""
        result = self.app.test_cli_runner().invoke(
            args=[
                "create-user",
                "--email",
                "PERSON@example.test",
                "--name",
                "Duplicate",
            ],
            input=f"{self.PASSWORD}\n{self.PASSWORD}\n",
        )
        self.assertNotEqual(result.exit_code, 0)
        self.assertIn("already exists", result.output)
        self.assertEqual(len(self.database.users.documents), 1)

    def test_create_user_rejects_short_passwords(self):
        """Administrative account provisioning enforces the minimum length."""
        result = self.app.test_cli_runner().invoke(
            args=["create-user", "--email", "new@example.test", "--name", "New User"],
            input="short\nshort\n",
        )
        self.assertNotEqual(result.exit_code, 0)
        self.assertEqual(len(self.database.users.documents), 1)

    def test_init_db_creates_unique_and_expiry_indexes(self):
        """TTL supports cleanup while application checks enforce expiration."""
        result = self.app.test_cli_runner().invoke(args=["init-db"])
        self.assertEqual(result.exit_code, 0, result.output)
        self.assertIn(("email", {"unique": True}), self.database.users.indexes)
        self.assertIn(("token_hash", {"unique": True}), self.database.sessions.indexes)
        self.assertIn(
            ("expires_at", {"expireAfterSeconds": 0}),
            self.database.sessions.indexes,
        )


if __name__ == "__main__":
    unittest.main()
