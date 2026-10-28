"""Bounded HTTP calls to the private authentication service."""

from datetime import datetime
import json
import re
from urllib.error import HTTPError, URLError
from urllib.parse import urlsplit
from urllib.request import HTTPRedirectHandler, ProxyHandler, Request, build_opener


class AuthenticationError(Exception):
    """An authentication failure safe to expose to the browser."""

    def __init__(self, status_code=503, error_code="authentication_unavailable"):
        super().__init__(error_code)
        self.status_code = status_code
        self.error_code = error_code


class _RejectRedirects(HTTPRedirectHandler):
    """Keep private credentials from being forwarded to a redirect target."""

    def redirect_request(self, *_args, **_kwargs):
        """Return no replacement request so redirects fail closed."""
        return None


def public_session(payload):
    """Extract the browser-safe identity and CSRF fields from a session response."""
    try:
        user = {key: payload["user"][key] for key in ("id", "email", "name")}
        csrf_token = payload["csrf_token"]
        expires_at = payload["expires_at"]
        expiration = datetime.fromisoformat(expires_at.replace("Z", "+00:00"))
        if not all(isinstance(value, str) and value for value in user.values()):
            raise ValueError("Invalid identity")
        if not isinstance(csrf_token, str) or not re.fullmatch(
            r"[A-Za-z0-9_-]{32,256}", csrf_token
        ):
            raise ValueError("Invalid CSRF token")
        if expiration.tzinfo is None:
            raise ValueError("Missing expiration timezone")
    except (KeyError, TypeError, ValueError, AttributeError) as error:
        raise AuthenticationError() from error
    return {"user": user, "csrf_token": csrf_token, "expires_at": expires_at}


class AuthenticationClient:
    """Keep service credentials and session bearer tokens on the backend."""

    def __init__(self, base_url, internal_token, timeout=3):
        parsed = urlsplit(base_url)
        if any(
            (
                parsed.scheme not in {"http", "https"},
                not parsed.netloc,
                parsed.username,
                parsed.password,
                parsed.query,
                parsed.fragment,
            )
        ):
            raise ValueError("AUTHENTICATION_URL must be an HTTP service URL.")
        self.base_url = base_url.rstrip("/")
        self.internal_token = internal_token
        self.timeout = timeout
        self.opener = build_opener(ProxyHandler({}), _RejectRedirects())

    def _request(self, path, *, payload=None, token=None, csrf_token=None):
        """Send a fixed-path request and reject invalid or oversized responses."""
        if not self.internal_token:
            raise AuthenticationError()
        headers = {
            "Content-Type": "application/json",
            "X-Internal-Token": self.internal_token,
        }
        if token:
            headers["Authorization"] = f"Bearer {token}"
        if csrf_token:
            headers["X-CSRF-Token"] = csrf_token
        try:
            request = Request(
                f"{self.base_url}/internal/{path}",
                data=json.dumps(payload or {}).encode("utf-8"),
                headers=headers,
                method="POST",
            )
            with self.opener.open(request, timeout=self.timeout) as response:
                body = response.read(32769)
                if len(body) > 32768:
                    raise ValueError("Oversized authentication response")
                result = json.loads(body)
                if not isinstance(result, dict):
                    raise ValueError("Invalid authentication response")
                return result
        except HTTPError as error:
            return self._raise_http_error(error)
        except (URLError, OSError, ValueError) as error:
            raise AuthenticationError() from error

    @staticmethod
    def _raise_http_error(error):
        """Allow only known public errors and hide internal service failures."""
        allowed = {
            (401, "invalid_credentials"),
            (401, "authentication_required"),
            (403, "invalid_csrf_token"),
        }
        try:
            body = error.read(32768)
            payload = json.loads(body)
            code = payload.get("error")
        except (OSError, ValueError, AttributeError):
            code = None
        finally:
            error.close()
        if isinstance(code, str) and (error.code, code) in allowed:
            raise AuthenticationError(error.code, code) from error
        raise AuthenticationError() from error

    def login(self, email, password):
        """Authenticate credentials and obtain a new opaque session."""
        return self._new_session(
            self._request("login", payload={"email": email, "password": password})
        )

    def session(self, token):
        """Validate the browser session and return its public state."""
        return public_session(self._request("session", token=token))

    def logout(self, token, csrf_token):
        """Revoke a session only after authentication confirms the CSRF token."""
        result = self._request("logout", token=token, csrf_token=csrf_token)
        if result.get("status") != "ok":
            raise AuthenticationError()
        return result

    def refresh(self, token, csrf_token):
        """Rotate a session while preserving the server-enforced lifetime."""
        return self._new_session(
            self._request("refresh", token=token, csrf_token=csrf_token)
        )

    @staticmethod
    def _new_session(payload):
        """Check cookie token syntax before a response reaches the browser."""
        session = public_session(payload)
        token = payload.get("session_token")
        if not isinstance(token, str) or not re.fullmatch(
            r"[A-Za-z0-9_-]{32,256}", token
        ):
            raise AuthenticationError()
        return {**session, "session_token": token}
