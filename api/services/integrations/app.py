"""Integrations API for external providers, pipelines, and agents."""

from pathlib import Path

from dotenv import load_dotenv
from maisciencia_common import create_service


def create_app(test_config=None):
    """Create the independent integrations application."""
    load_dotenv(Path(__file__).with_name(".env"))
    return create_service(
        "integrations",
        collections=(
            "pipelines",
            "agents",
        ),
        test_config=test_config,
    )
