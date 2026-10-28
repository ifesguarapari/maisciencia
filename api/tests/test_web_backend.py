"""Browser session boundaries and private authentication transport."""

from io import BytesIO
import json
import os
import unittest
from unittest.mock import MagicMock, patch
from urllib.error import HTTPError, URLError
from urllib.request import HTTPHandler, HTTPSHandler, ProxyHandler, build_opener
from urllib.response import addinfourl

from services.web.app import create_app
from services.web.client import (
    AuthenticationClient,
    AuthenticationError,
    _RejectRedirects,
)
from services.web.status import SERVICE_NAMES

SESSION_TOKEN = "s" * 43
CSRF_TOKEN = "c" * 43
ORIGIN = "http://localhost:5173"


def session_payload():
    """Return private fields representative of an authentication response."""
    return {
        "user": {
            "id": "user-id",
            "email": "person@example.com",
            "name": "Person",
            "password_hash": "private-password-hash",
        },
        "session_token": SESSION_TOKEN,
        "csrf_token": CSRF_TOKEN,
        "expires_at": "2030-01-01T00:00:00+00:00",
    }


class BrowserBackendTests(unittest.TestCase):
    """Test browser-facing routes independently of a live authentication server."""

    def setUp(self):
        self.environment = patch.dict(os.environ, {}, clear=True)
        self.environment.start()
        self.addCleanup(self.environment.stop)
        self.dotenv = patch("services.web.app.load_dotenv")
        self.dotenv.start()
        self.addCleanup(self.dotenv.stop)
        self.auth = MagicMock(spec=AuthenticationClient)
        self.auth.login.return_value = session_payload()
        self.auth.session.return_value = session_payload()
        self.auth.logout.return_value = {"status": "ok"}
        self.auth.refresh.return_value = {
            **session_payload(),
            "session_token": "r" * 43,
        }
        self.app = create_app(
            {
                "TESTING": True,
                "AUTH_CLIENT": self.auth,
                "SESSION_COOKIE_SECURE": True,
                "WEB_ALLOWED_ORIGINS": [ORIGIN],
                "HEALTH_FETCHER": lambda _slug, _url: True,
            }
        )
        self.client = self.app.test_client(use_cookies=False)

    def headers(self, *, csrf=True):
        """Represent the cookie forwarded after Kong strips the public path."""
        headers = {
            "Origin": ORIGIN,
            "Cookie": f"maisciencia_session={SESSION_TOKEN}",
        }
        if csrf:
            headers["X-CSRF-Token"] = CSRF_TOKEN
        return headers

    def test_health_has_no_database_or_authentication_dependency(self):
        """The BFF keeps running when authentication or MongoDB is unavailable."""
        response = self.client.get("/health")
        self.assertEqual(response.json, {"status": "ok", "service": "web"})
        self.assertNotIn("mongo_client", self.app.extensions)
        self.auth.session.assert_not_called()

    def test_login_hides_private_fields_and_sets_a_scoped_secure_cookie(self):
        """Only the cookie contains the private session identifier."""
        response = self.client.post(
            "/login",
            json={"email": "person@example.com", "password": "private-password"},
            headers={"Origin": ORIGIN},
        )
        self.assertEqual(response.status_code, 200)
        cookie = response.headers["Set-Cookie"]
        for flag in ("HttpOnly", "Secure", "SameSite=Lax", "Path=/api/web"):
            self.assertIn(flag, cookie)
        self.assertNotIn("Domain=", cookie)
        self.assertIn(SESSION_TOKEN, cookie)
        self.assertNotIn(SESSION_TOKEN, response.get_data(as_text=True))
        self.assertNotIn("password_hash", response.json["user"])
        self.assertEqual(response.headers["Cache-Control"], "no-store")

    def test_login_rejects_missing_or_untrusted_origins(self):
        """Login requires an explicit trusted browser origin."""
        for origin in (None, "https://untrusted.example", "null"):
            with self.subTest(origin=origin):
                response = self.client.post(
                    "/login",
                    json={"email": "person@example.com", "password": "password"},
                    headers={"Origin": origin} if origin else {},
                )
                self.assertEqual(response.status_code, 403)
                self.assertEqual(response.json, {"error": "invalid_origin"})
        self.auth.login.assert_not_called()

    def test_state_changes_reject_form_content_and_malformed_login_payloads(self):
        """Simple form submissions cannot bypass the JSON-only browser boundary."""
        response = self.client.post(
            "/login", data={"email": "person@example.com"}, headers={"Origin": ORIGIN}
        )
        self.assertEqual(response.status_code, 415)
        for payload in (None, [], {"email": [], "password": "password"}):
            response = self.client.post(
                "/login",
                data=json.dumps(payload),
                content_type="application/json",
                headers={"Origin": ORIGIN},
            )
            self.assertEqual(response.status_code, 400)
        self.auth.login.assert_not_called()

    def test_current_session_requires_a_well_formed_cookie(self):
        """Missing or malformed session identifiers never reach authentication."""
        for cookie in (None, "maisciencia_session=invalid"):
            response = self.client.get(
                "/session", headers={"Cookie": cookie} if cookie else {}
            )
            self.assertEqual(response.status_code, 401)
            self.assertIn("Max-Age=0", response.headers["Set-Cookie"])
        self.auth.session.assert_not_called()

    def test_current_session_returns_identity_and_csrf_without_private_fields(self):
        """Page reloads recover CSRF tokens without exposing the session cookie."""
        response = self.client.get("/session", headers=self.headers())
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json["csrf_token"], CSRF_TOKEN)
        self.assertEqual(set(response.json), {"user", "csrf_token", "expires_at"})
        self.assertNotIn("password_hash", response.json["user"])
        self.auth.session.assert_called_once_with(SESSION_TOKEN)

    def test_rejected_session_clears_cookie_and_errors_are_not_cached(self):
        """The browser stops reusing a session rejected by its authoritative service."""
        self.auth.session.side_effect = AuthenticationError(
            401, "authentication_required"
        )
        response = self.client.get("/session", headers=self.headers())
        self.assertEqual(response.status_code, 401)
        self.assertIn("Max-Age=0", response.headers["Set-Cookie"])
        self.assertEqual(response.headers["Cache-Control"], "no-store")

    def test_logout_requires_csrf_before_contacting_authentication(self):
        """Cookie possession alone cannot authorize a state-changing request."""
        response = self.client.post(
            "/logout", json={}, headers=self.headers(csrf=False)
        )
        self.assertEqual(response.status_code, 403)
        self.auth.logout.assert_not_called()

    def test_logout_forwards_csrf_and_clears_cookie_after_revocation(self):
        """Successful server-side revocation is followed by browser cookie removal."""
        response = self.client.post("/logout", json={}, headers=self.headers())
        self.assertEqual(response.status_code, 200)
        self.auth.logout.assert_called_once_with(SESSION_TOKEN, CSRF_TOKEN)
        self.assertIn("Max-Age=0", response.headers["Set-Cookie"])

    def test_failed_revocation_does_not_claim_logout_succeeded(self):
        """Unavailable authentication keeps logout explicit and retryable."""
        self.auth.logout.side_effect = AuthenticationError()
        response = self.client.post("/logout", json={}, headers=self.headers())
        self.assertEqual(response.status_code, 503)
        self.assertEqual(response.json, {"error": "authentication_unavailable"})
        self.assertNotIn("Set-Cookie", response.headers)

    def test_refresh_rotates_the_cookie_without_exposing_its_value(self):
        """Session rotation uses the existing CSRF proof and a new HttpOnly cookie."""
        response = self.client.post("/session/refresh", json={}, headers=self.headers())
        self.assertEqual(response.status_code, 200)
        self.auth.refresh.assert_called_once_with(SESSION_TOKEN, CSRF_TOKEN)
        self.assertIn("r" * 43, response.headers["Set-Cookie"])
        self.assertNotIn("session_token", response.json)

    def test_health_aggregation_preserves_partial_availability(self):
        """The fixed allowlist includes the BFF and reports failures separately."""
        self.app.config["HEALTH_FETCHER"] = lambda slug, _url: slug != "events"
        response = self.client.get("/status?url=http://untrusted.example")
        statuses = {item["slug"]: item["status"] for item in response.json["services"]}
        self.assertEqual(set(statuses), {"web", *SERVICE_NAMES})
        self.assertEqual(statuses["events"], "unavailable")
        self.assertEqual(statuses["web"], "ok")
        self.assertEqual(statuses["activities"], "ok")


class RedirectResponseHandler(HTTPHandler, HTTPSHandler):
    """Simulate redirects inside urllib without opening any network sockets."""

    def __init__(self):
        super().__init__()
        self.requests = []

    def http_open(self, req):
        """Return a redirect, then a success if a client follows it."""
        self.requests.append(req)
        code = 302 if len(self.requests) == 1 else 200
        body = b"" if code == 302 else json.dumps(session_payload()).encode()
        response = addinfourl(
            BytesIO(body),
            {"Location": "https://untrusted.example/session"},
            req.full_url,
            code,
        )
        response.msg = "Found" if code == 302 else "OK"
        return response

    https_open = http_open


class AuthenticationTransportTests(unittest.TestCase):
    """Verify that service credentials remain within a bounded private HTTP call."""

    def setUp(self):
        self.client = AuthenticationClient("http://authentication:5000", "private-key")

    def response(self, body):
        """Provide a context-managed HTTP response with a chosen body."""
        response = MagicMock()
        response.__enter__.return_value = response
        response.read.return_value = body
        return response

    def test_private_transport_sets_server_credentials_and_sanitizes_identity(self):
        """Credentials come from configuration rather than browser headers."""
        with patch.object(self.client.opener, "open") as open_request:
            open_request.return_value = self.response(json.dumps(session_payload()))
            result = self.client.session(SESSION_TOKEN)
        request = open_request.call_args.args[0]
        self.assertEqual(request.get_header("X-internal-token"), "private-key")
        self.assertEqual(request.get_header("Authorization"), f"Bearer {SESSION_TOKEN}")
        self.assertEqual(
            request.full_url, "http://authentication:5000/internal/session"
        )
        self.assertNotIn("session_token", result)
        self.assertNotIn("password_hash", result["user"])

    def test_transport_failures_and_malformed_payloads_fail_closed(self):
        """Network failures and malformed responses become sanitized errors."""
        with patch.object(self.client.opener, "open", side_effect=URLError("private")):
            with self.assertRaises(AuthenticationError) as failure:
                self.client.session(SESSION_TOKEN)
        self.assertEqual(failure.exception.status_code, 503)
        for body in ("not-json", "[]", "{}", "x" * 32769):
            with patch.object(
                self.client.opener, "open", return_value=self.response(body)
            ):
                with self.assertRaises(AuthenticationError):
                    self.client.session(SESSION_TOKEN)

    def test_only_known_public_errors_are_forwarded(self):
        """Internal credential failures and arbitrary upstream fields stay private."""
        cases = (
            (401, "invalid_credentials", 401),
            (403, "invalid_csrf_token", 403),
            (401, "internal_authentication_required", 503),
            (401, {"private": "invalid-error-shape"}, 503),
            (500, "private-stack-trace", 503),
        )
        for status, code, expected in cases:
            error = HTTPError(
                self.client.base_url,
                status,
                "failure",
                {},
                BytesIO(json.dumps({"error": code}).encode()),
            )
            with patch.object(self.client.opener, "open", side_effect=error):
                with self.assertRaises(AuthenticationError) as failure:
                    self.client.login("person@example.com", "password")
            self.assertEqual(failure.exception.status_code, expected)

    def test_redirects_never_forward_credentials_to_another_host(self):
        """A private endpoint redirect fails before the redirected request is made."""
        handler = RedirectResponseHandler()
        self.client.opener = build_opener(ProxyHandler({}), handler, _RejectRedirects())
        with self.assertRaises(AuthenticationError) as failure:
            self.client.session(SESSION_TOKEN)
        self.assertEqual(failure.exception.status_code, 503)
        self.assertEqual(len(handler.requests), 1)
        self.assertEqual(handler.requests[0].host, "authentication:5000")


if __name__ == "__main__":
    unittest.main()
