"""Internal identity and persistent web session management."""

from datetime import datetime, timedelta, timezone
import hashlib
import hmac
import os
from pathlib import Path
import secrets

import click
from dotenv import load_dotenv
from flask import Blueprint, current_app, jsonify, request
from flask.cli import with_appcontext
from pymongo.errors import DuplicateKeyError, PyMongoError
from werkzeug.security import check_password_hash, generate_password_hash

from maisciencia_common import create_service

routes = Blueprint("authentication", __name__)
DUMMY_PASSWORD_HASH = generate_password_hash(secrets.token_urlsafe(32))


class AuthenticationError(Exception):
    """Represent a public, sanitized authentication error."""

    def __init__(self, code, status=401):
        super().__init__(code)
        self.code = code
        self.status = status


def _utc(value):
    """Normalize MongoDB timestamps, including naive UTC driver values."""
    if not isinstance(value, datetime):
        raise AuthenticationError("authentication_required")
    if value.tzinfo is None:
        return value.replace(tzinfo=timezone.utc)
    return value.astimezone(timezone.utc)


def _now():
    """Return the application clock in UTC."""
    return _utc(current_app.config["SESSION_CLOCK"]())


def _digest(token):
    """Derive the stored verifier from a random session token."""
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


def _database():
    """Access the database owned by this application instance."""
    return current_app.extensions["mongo_db"]


def _internal_guard():
    """Keep all internal endpoints restricted to trusted backend callers."""
    if not request.path.startswith("/internal/"):
        return
    expected = current_app.config["AUTH_INTERNAL_TOKEN"]
    if not expected:
        raise AuthenticationError("authentication_unavailable", 503)
    supplied = request.headers.get("X-Internal-Token", "")
    if len(supplied) > 512 or not hmac.compare_digest(
        supplied.encode("utf-8"), expected.encode("utf-8")
    ):
        raise AuthenticationError("internal_authentication_required")


def _no_store(response):
    """Prevent caches from retaining identity and session responses."""
    if request.path.startswith("/internal/"):
        response.headers["Cache-Control"] = "no-store"
    return response


def _authentication_error(error):
    """Serialize authentication failures without exposing internal details."""
    return jsonify(error=error.code), error.status


def _database_error(_error):
    """Keep database connection details outside API responses."""
    return jsonify(error="authentication_unavailable"), 503


def _session_token():
    """Read an opaque token exclusively from the authorization header."""
    parts = request.headers.get("Authorization", "").split()
    if len(parts) != 2 or parts[0].lower() != "bearer" or len(parts[1]) > 512:
        raise AuthenticationError("authentication_required")
    return parts[1]


def _user_payload(user):
    """Expose identity fields without password hashes or internal flags."""
    return {"id": str(user["_id"]), "email": user["email"], "name": user["name"]}


def _payload(session, user, token=None):
    """Serialize the session view for the trusted BFF."""
    result = {
        "user": _user_payload(user),
        "csrf_token": session["csrf_token"],
        "expires_at": _utc(session["expires_at"]).isoformat().replace("+00:00", "Z"),
    }
    if token is not None:
        result["session_token"] = token
    return result


def _session_context():
    """Validate expiration and account status before trusting any session."""
    token_hash = _digest(_session_token())
    database = _database()
    session = database.sessions.find_one({"token_hash": token_hash})
    if not session:
        raise AuthenticationError("authentication_required")
    now = _now()
    idle_limit = now - timedelta(
        seconds=current_app.config["SESSION_IDLE_TIMEOUT_SECONDS"]
    )
    if (
        _utc(session.get("expires_at")) <= now
        or _utc(session.get("last_seen_at")) <= idle_limit
    ):
        database.sessions.delete_one({"_id": session["_id"], "token_hash": token_hash})
        raise AuthenticationError("authentication_required")
    user = database.users.find_one({"_id": session.get("user_id"), "active": True})
    if not user:
        database.sessions.delete_one({"_id": session["_id"], "token_hash": token_hash})
        raise AuthenticationError("authentication_required")
    return session, user, now


def _csrf_guard(session):
    """Require the session-bound CSRF token for session mutations."""
    supplied = request.headers.get("X-CSRF-Token", "")
    expected = session["csrf_token"]
    if (
        not supplied
        or len(supplied) > 512
        or not hmac.compare_digest(supplied.encode("utf-8"), expected.encode("utf-8"))
    ):
        raise AuthenticationError("invalid_csrf_token", 403)


def _login_credentials():
    """Validate and normalize a small JSON login payload."""
    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        raise AuthenticationError("invalid_credentials")
    email, password = data.get("email"), data.get("password")
    if (
        not isinstance(email, str)
        or not isinstance(password, str)
        or not 1 <= len(email) <= 254
        or not 1 <= len(password) <= 1024
    ):
        raise AuthenticationError("invalid_credentials")
    return email.strip().casefold(), password


@routes.post("/internal/login")
def login():
    """Authenticate a user and create an independently revocable session."""
    email, password = _login_credentials()
    database = _database()
    user = database.users.find_one({"email": email})
    password_hash = (
        user.get("password_hash", DUMMY_PASSWORD_HASH)
        if user
        else (DUMMY_PASSWORD_HASH)
    )
    try:
        valid = check_password_hash(password_hash, password)
    except (ValueError, TypeError):
        valid = False
    if not valid or not user or user.get("active") is not True:
        raise AuthenticationError("invalid_credentials")
    token = secrets.token_urlsafe(32)
    now = _now()
    session = {
        "token_hash": _digest(token),
        "csrf_token": secrets.token_urlsafe(32),
        "user_id": user["_id"],
        "created_at": now,
        "last_seen_at": now,
        "expires_at": now
        + timedelta(seconds=current_app.config["SESSION_ABSOLUTE_TIMEOUT_SECONDS"]),
    }
    database.sessions.insert_one(session)
    return jsonify(_payload(session, user, token))


@routes.post("/internal/session")
def current_session():
    """Resolve identity and extend idle activity without extending absolute expiry."""
    session, user, now = _session_context()
    result = _database().sessions.update_one(
        {"_id": session["_id"], "token_hash": session["token_hash"]},
        {"$max": {"last_seen_at": now}},
    )
    if result.matched_count != 1:
        raise AuthenticationError("authentication_required")
    return jsonify(_payload(session, user))


@routes.post("/internal/logout")
def logout():
    """Revoke the exact session represented by the supplied token."""
    session, _user, _timestamp = _session_context()
    _csrf_guard(session)
    _database().sessions.delete_one({"_id": session["_id"]})
    return jsonify(status="ok")


@routes.post("/internal/refresh")
def refresh():
    """Rotate the bearer token while retaining the original absolute lifetime."""
    session, user, now = _session_context()
    _csrf_guard(session)
    token = secrets.token_urlsafe(32)
    result = _database().sessions.update_one(
        {"_id": session["_id"], "token_hash": session["token_hash"]},
        {"$set": {"token_hash": _digest(token)}, "$max": {"last_seen_at": now}},
    )
    if result.matched_count != 1:
        raise AuthenticationError("authentication_required")
    return jsonify(_payload(session, user, token))


def ensure_indexes():
    """Create identity uniqueness and session cleanup indexes idempotently."""
    database = _database()
    database.users.create_index("email", unique=True)
    database.sessions.create_index("token_hash", unique=True)
    database.sessions.create_index("expires_at", expireAfterSeconds=0)


@click.command("init-db")
@with_appcontext
def init_db_command():
    """Create authentication indexes without creating user accounts."""
    try:
        ensure_indexes()
    except PyMongoError as error:
        raise click.ClickException(
            "The authentication database is unavailable."
        ) from error
    click.echo("Authentication indexes are ready.")


@click.command("create-user")
@click.option("--email", required=True)
@click.option("--name", required=True)
@with_appcontext
def create_user_command(email, name):
    """Create an initial account using a hidden password prompt."""
    email = email.strip().casefold()
    if not 3 <= len(email) <= 254 or "@" not in email or not name.strip():
        raise click.ClickException("Provide a valid email address and name.")
    password = click.prompt("Password", hide_input=True, confirmation_prompt=True)
    if not 12 <= len(password) <= 1024:
        raise click.ClickException("Use a password containing 12 to 1024 characters.")
    try:
        ensure_indexes()
        _database().users.insert_one(
            {
                "email": email,
                "name": name.strip(),
                "password_hash": generate_password_hash(password),
                "active": True,
                "created_at": _now(),
            }
        )
    except DuplicateKeyError as error:
        raise click.ClickException(
            "An account with this email already exists."
        ) from error
    except PyMongoError as error:
        raise click.ClickException(
            "The authentication database is unavailable."
        ) from error
    click.echo("User account created.")


def create_app(test_config=None):
    """Create the independent authentication application and session endpoints."""
    load_dotenv(Path(__file__).with_name(".env"))
    settings = {
        "AUTH_INTERNAL_TOKEN": os.getenv("AUTH_INTERNAL_TOKEN", ""),
        "SESSION_IDLE_TIMEOUT_SECONDS": int(
            os.getenv("SESSION_IDLE_TIMEOUT_SECONDS", "1800")
        ),
        "SESSION_ABSOLUTE_TIMEOUT_SECONDS": int(
            os.getenv("SESSION_ABSOLUTE_TIMEOUT_SECONDS", "28800")
        ),
        "SESSION_CLOCK": lambda: datetime.now(timezone.utc),
        "MAX_CONTENT_LENGTH": 16384,
    }
    settings.update(test_config or {})
    if any(
        settings[key] <= 0
        for key in ("SESSION_IDLE_TIMEOUT_SECONDS", "SESSION_ABSOLUTE_TIMEOUT_SECONDS")
    ):
        raise ValueError("Session timeouts must be positive.")
    app = create_service(
        "authentication",
        collections=("users", "sessions", "recoveries"),
        test_config=settings,
    )
    app.register_blueprint(routes)
    app.before_request(_internal_guard)
    app.after_request(_no_store)
    app.register_error_handler(AuthenticationError, _authentication_error)
    app.register_error_handler(PyMongoError, _database_error)
    app.cli.add_command(init_db_command)
    app.cli.add_command(create_user_command)
    return app
