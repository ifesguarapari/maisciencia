"""Service health contracts, configuration, and isolation."""

import importlib
import os
import unittest
from unittest.mock import MagicMock, patch

from pymongo.errors import OperationFailure

from maisciencia_common import create_service


class RuntimeTests(unittest.TestCase):
    """Verify shared infrastructure without requiring a MongoDB server."""

    def setUp(self):
        self.environment = patch.dict(os.environ, {}, clear=True)
        self.environment.start()
        self.addCleanup(self.environment.stop)

    def create_app(self, name="test", collections=("records",), **config):
        """Close the client created by each test during cleanup."""
        app = create_service(name, collections=collections, test_config=config)
        self.addCleanup(app.extensions["mongo_client"].close)
        return app

    def test_health_does_not_query_database(self):
        """Database unavailability does not interrupt process health checks."""
        app = self.create_app()
        database = MagicMock()
        database.command.side_effect = AssertionError("Unexpected database access")
        app.extensions["mongo_db"] = database

        response = app.test_client().get("/health")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json, {"status": "ok", "service": "test"})
        database.command.assert_not_called()

    def test_factories_have_independent_configuration_and_clients(self):
        """Services share the central database with independent clients and settings."""
        first = self.create_app("first", collections=("schools",))
        second = self.create_app("second", collections=("events",))

        self.assertIsNot(
            first.extensions["mongo_client"], second.extensions["mongo_client"]
        )
        self.assertEqual(first.config["MONGO_DB"], second.config["MONGO_DB"])
        self.assertEqual(first.config["OWNED_COLLECTIONS"], ("schools",))
        self.assertEqual(second.config["OWNED_COLLECTIONS"], ("events",))
        first.config["SERVICE_NAME"] = "modified"
        self.assertEqual(second.test_client().get("/health").json["service"], "second")

    def test_database_health_pings_configured_database(self):
        """The endpoint reports availability only after the ping succeeds."""
        app = self.create_app()
        database = MagicMock()
        app.extensions["mongo_db"] = database

        response = app.test_client().get("/health/db")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json, {"status": "ok", "database": "connected"})
        database.command.assert_called_once_with("ping")

    def test_database_error_does_not_disclose_credentials(self):
        """Authentication and connection errors return a sanitized response."""
        app = self.create_app()
        database = MagicMock()
        database.command.side_effect = OperationFailure(
            "Secret credential: private-password"
        )
        app.extensions["mongo_db"] = database

        response = app.test_client().get("/health/db")

        self.assertEqual(response.status_code, 503)
        self.assertEqual(response.json, {"status": "error", "database": "unavailable"})
        self.assertNotIn("private-password", response.get_data(as_text=True))

    def test_direct_cors_is_disabled_by_default(self):
        """APIs do not implicitly allow origins when running behind Kong."""
        response = (
            self.create_app()
            .test_client()
            .get("/health", headers={"Origin": "http://localhost:5173"})
        )
        self.assertNotIn("Access-Control-Allow-Origin", response.headers)

    def test_direct_cors_allows_only_configured_origins(self):
        """Optional direct access preserves the configured origin allowlist."""
        client = self.create_app(CORS_ORIGINS=["http://localhost:5173"]).test_client()
        allowed = client.get("/health", headers={"Origin": "http://localhost:5173"})
        denied = client.get("/health", headers={"Origin": "https://untrusted.example"})

        self.assertEqual(
            allowed.headers["Access-Control-Allow-Origin"], "http://localhost:5173"
        )
        self.assertNotIn("Access-Control-Allow-Origin", denied.headers)

    @patch("maisciencia_common.MongoClient")
    def test_credentials_and_pool_are_passed_as_client_options(self, client_factory):
        """Credentials with special characters do not require URI interpolation."""
        with patch.dict(os.environ, {"MONGO_MAX_POOL_SIZE": "7"}):
            self.create_app(
                MONGO_USERNAME="administrations",
                MONGO_PASSWORD="password@:/?",
                MONGO_AUTH_SOURCE="maisciencia_auth",
            )

        options = client_factory.call_args.kwargs
        self.assertEqual(options["username"], "administrations")
        self.assertEqual(options["password"], "password@:/?")
        self.assertEqual(options["authSource"], "maisciencia_auth")
        self.assertEqual(options["maxPoolSize"], 7)
        self.assertFalse(options["connect"])

    @patch("maisciencia_common.MongoClient")
    def test_authentication_source_defaults_to_application_database(
        self, client_factory
    ):
        """Service users authenticate against the configured central database."""
        self.create_app(
            MONGO_DB="central", MONGO_USERNAME="service", MONGO_PASSWORD="secret"
        )
        self.assertEqual(client_factory.call_args.kwargs["authSource"], "central")

    def test_incomplete_credentials_fail_before_startup(self):
        """Incomplete authentication configuration must fail explicitly."""
        with self.assertRaisesRegex(ValueError, "together"):
            self.create_app(MONGO_USERNAME="service")


class ServiceFactoryTests(unittest.TestCase):
    """Verify the entry point contracts for each domain."""

    def test_all_service_factories_create_distinct_applications(self):
        """Each module provides its own factory, identifier, and collection list."""
        domains = {
            "administrations": "administrations",
            "activities": "activities",
            "events": "events",
            "content": "content",
            "authentication": "authentication",
            "messaging": "messaging",
            "integrations": "integrations",
        }
        clients = []
        for domain, service_name in domains.items():
            with self.subTest(domain=domain), patch.dict(os.environ, {}, clear=True):
                module = importlib.import_module(f"services.{domain}.app")
                app = module.create_app({"TESTING": True})
                client = app.extensions["mongo_client"]
                self.addCleanup(client.close)
                self.assertTrue(all(client is not previous for previous in clients))
                clients.append(client)
                self.assertTrue(app.config["OWNED_COLLECTIONS"])
                response = app.test_client().get("/health")
                self.assertEqual(response.status_code, 200)
                self.assertEqual(response.json["service"], service_name)


if __name__ == "__main__":
    unittest.main()
