"""Shared infrastructure initialization for Flask services."""

import os

from flask import Flask, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from pymongo.errors import PyMongoError


def _mongo_options(config):
    """Build connection options without interpolating credentials into the URI."""
    options = {
        "connect": False,
        "timeoutMS": 3000,
        "serverSelectionTimeoutMS": 3000,
        "connectTimeoutMS": 3000,
        "maxPoolSize": config["MONGO_MAX_POOL_SIZE"],
    }
    username = config["MONGO_USERNAME"]
    password = config["MONGO_PASSWORD"]
    if bool(username) != bool(password):
        raise ValueError("Configure MONGO_USERNAME and MONGO_PASSWORD together.")
    if username:
        options.update(
            username=username,
            password=password,
            authSource=config["MONGO_AUTH_SOURCE"] or config["MONGO_DB"],
        )
    return options


def create_service(service_name, *, collections, test_config=None):
    """Create a service with its own configuration and MongoDB pool per process."""
    app = Flask(service_name)
    app.config.from_mapping(
        SERVICE_NAME=service_name,
        OWNED_COLLECTIONS=tuple(collections),
        MONGO_URI=os.getenv("MONGO_URI", "mongodb://localhost:27017/"),
        MONGO_DB=os.getenv("MONGO_DB", "maisciencia"),
        MONGO_USERNAME=os.getenv("MONGO_USERNAME", ""),
        MONGO_PASSWORD=os.getenv("MONGO_PASSWORD", ""),
        MONGO_AUTH_SOURCE=os.getenv("MONGO_AUTH_SOURCE", ""),
        MONGO_MAX_POOL_SIZE=int(os.getenv("MONGO_MAX_POOL_SIZE", "10")),
        CORS_ORIGINS=[
            origin.strip()
            for origin in os.getenv("CORS_ORIGINS", "").split(",")
            if origin.strip()
        ],
    )
    if test_config is not None:
        app.config.update(test_config)

    if app.config["CORS_ORIGINS"]:
        CORS(app, resources={r"/.*": {"origins": app.config["CORS_ORIGINS"]}})

    client = MongoClient(app.config["MONGO_URI"], **_mongo_options(app.config))
    app.extensions["mongo_client"] = client
    app.extensions["mongo_db"] = client[app.config["MONGO_DB"]]

    @app.get("/health")
    def health():
        """Report process availability independently of the database."""
        return jsonify(status="ok", service=app.config["SERVICE_NAME"])

    @app.get("/health/db")
    def database_health():
        """Check the database connection without exposing credentials in errors."""
        try:
            app.extensions["mongo_db"].command("ping")
        except PyMongoError:
            return jsonify(status="error", database="unavailable"), 503
        return jsonify(status="ok", database="connected")

    return app
