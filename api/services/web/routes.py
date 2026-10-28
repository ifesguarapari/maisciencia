"""Browser session endpoints with origin and CSRF validation."""

from datetime import datetime
import re

from flask import Blueprint, current_app, jsonify, request

try:
    from .client import AuthenticationError, public_session
    from .status import service_statuses
except ImportError:
    from client import AuthenticationError, public_session
    from status import service_statuses


browser = Blueprint("browser", __name__)


def _client():
    return current_app.config["AUTH_CLIENT"]


def _token():
    token = request.cookies.get(current_app.config["SESSION_COOKIE_NAME"])
    if not token or not re.fullmatch(r"[A-Za-z0-9_-]{32,256}", token):
        raise AuthenticationError(401, "authentication_required")
    return token


def _csrf_token():
    token = request.headers.get("X-CSRF-Token", "")
    if not re.fullmatch(r"[A-Za-z0-9_-]{32,256}", token):
        raise AuthenticationError(403, "invalid_csrf_token")
    return token


def clear_session_cookie(response):
    """Remove the host-only cookie using the same scope as its creation."""
    response.delete_cookie(
        current_app.config["SESSION_COOKIE_NAME"],
        path=current_app.config["SESSION_COOKIE_PATH"],
        secure=current_app.config["SESSION_COOKIE_SECURE"],
        httponly=True,
        samesite=current_app.config["SESSION_COOKIE_SAMESITE"],
    )
    return response


def _session_response(payload):
    session = public_session(payload)
    token = payload.get("session_token")
    if not isinstance(token, str) or not re.fullmatch(r"[A-Za-z0-9_-]{32,256}", token):
        raise AuthenticationError()
    response = jsonify(session)
    response.set_cookie(
        current_app.config["SESSION_COOKIE_NAME"],
        token,
        expires=datetime.fromisoformat(session["expires_at"].replace("Z", "+00:00")),
        path=current_app.config["SESSION_COOKIE_PATH"],
        secure=current_app.config["SESSION_COOKIE_SECURE"],
        httponly=True,
        samesite=current_app.config["SESSION_COOKIE_SAMESITE"],
    )
    return response


@browser.post("/login")
def login():
    """Exchange browser credentials for a backend-owned session cookie."""
    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        return jsonify(error="invalid_request"), 400
    email = data.get("email")
    password = data.get("password")
    valid_email = isinstance(email, str) and bool(email.strip()) and len(email) <= 254
    valid_password = isinstance(password, str) and 0 < len(password) <= 1024
    if not valid_email or not valid_password:
        return jsonify(error="invalid_request"), 400
    return _session_response(_client().login(email, password))


@browser.get("/session")
def current_session():
    """Expose the authenticated identity and CSRF token without the bearer token."""
    return jsonify(public_session(_client().session(_token())))


@browser.post("/logout")
def logout():
    """Revoke the session before clearing its browser cookie."""
    _client().logout(_token(), _csrf_token())
    return clear_session_cookie(jsonify(status="ok"))


@browser.post("/session/refresh")
def refresh():
    """Replace the browser cookie with a rotated opaque session identifier."""
    return _session_response(_client().refresh(_token(), _csrf_token()))


@browser.get("/status")
def status():
    """Aggregate public process health for the frontend status display."""
    return jsonify(services=service_statuses(current_app.config))
