"""Browser backend coordinating sessions through the authentication service."""

import os
from pathlib import Path

from dotenv import load_dotenv
from flask import Flask, jsonify, request

try:
    from .client import AuthenticationClient, AuthenticationError
    from .routes import browser, clear_session_cookie
    from .status import SERVICE_NAMES
except ImportError:
    from client import AuthenticationClient, AuthenticationError
    from routes import browser, clear_session_cookie
    from status import SERVICE_NAMES


def _secure_cookie(value):
    if value.lower() not in {"true", "false", "1", "0"}:
        raise ValueError("SESSION_COOKIE_SECURE must be true or false.")
    return value.lower() in {"true", "1"}


def create_app(test_config=None):
    """Create a BFF without a database client or process-local session state."""
    load_dotenv(Path(__file__).with_name(".env"))
    app = Flask(__name__)
    app.config.from_mapping(
        AUTHENTICATION_URL=os.getenv(
            "AUTHENTICATION_URL", "http://authentication:5000"
        ),
        AUTH_INTERNAL_TOKEN=os.getenv("AUTH_INTERNAL_TOKEN", ""),
        SESSION_COOKIE_NAME=os.getenv("SESSION_COOKIE_NAME", "maisciencia_session"),
        SESSION_COOKIE_PATH=os.getenv("SESSION_COOKIE_PATH", "/api/web"),
        SESSION_COOKIE_SECURE=_secure_cookie(
            os.getenv("SESSION_COOKIE_SECURE", "true")
        ),
        SESSION_COOKIE_SAMESITE=os.getenv("SESSION_COOKIE_SAMESITE", "Lax"),
        WEB_ALLOWED_ORIGINS=os.getenv(
            "WEB_ALLOWED_ORIGINS",
            "http://localhost:5173,http://127.0.0.1:5173,"
            "http://localhost:4173,http://127.0.0.1:4173",
        ).split(","),
        SERVICE_URLS={
            slug: os.getenv(
                f"{slug.upper().replace('-', '_')}_URL", f"http://{slug}:5000"
            )
            for slug in SERVICE_NAMES
        },
        MAX_CONTENT_LENGTH=16384,
    )
    if test_config:
        app.config.update(test_config)
    if app.config["SESSION_COOKIE_SAMESITE"] not in {"Lax", "Strict", "None"}:
        raise ValueError("SESSION_COOKIE_SAMESITE must be Lax, Strict, or None.")
    if (
        app.config["SESSION_COOKIE_SAMESITE"] == "None"
        and not app.config["SESSION_COOKIE_SECURE"]
    ):
        raise ValueError("SameSite=None requires a secure session cookie.")
    if not app.config.get("AUTH_CLIENT"):
        app.config["AUTH_CLIENT"] = AuthenticationClient(
            app.config["AUTHENTICATION_URL"], app.config["AUTH_INTERNAL_TOKEN"]
        )
    app.register_blueprint(browser)

    @app.before_request
    def validate_browser_origin():
        """Require an explicit trusted origin and JSON for state-changing requests."""
        if request.method in {"POST", "PUT", "PATCH", "DELETE"}:
            origins = {
                origin.strip()
                for origin in app.config["WEB_ALLOWED_ORIGINS"]
                if origin.strip()
            }
            if request.headers.get("Origin") not in origins:
                return jsonify(error="invalid_origin"), 403
            if request.mimetype != "application/json":
                return jsonify(error="invalid_content_type"), 415
        return None

    @app.after_request
    def disable_response_caching(response):
        """Keep session identities and CSRF responses out of browser caches."""
        response.headers["Cache-Control"] = "no-store"
        return response

    @app.errorhandler(AuthenticationError)
    def authentication_failure(error):
        """Return only sanitized errors and clear cookies for rejected sessions."""
        response = jsonify(error=error.error_code)
        response.status_code = error.status_code
        if error.status_code == 401:
            clear_session_cookie(response)
        return response

    @app.get("/health")
    def health():
        """Report process health independently of authentication availability."""
        return jsonify(status="ok", service="web")

    return app
