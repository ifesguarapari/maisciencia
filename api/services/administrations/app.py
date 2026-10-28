"""Administrations API for schools, students, teams, and memberships."""

from pathlib import Path

from dotenv import load_dotenv
from maisciencia_common import create_service


def create_app(test_config=None):
    """Create the independent administrations application."""
    load_dotenv(Path(__file__).with_name(".env"))
    return create_service(
        "administrations",
        collections=(
            "schools",
            "students",
            "teams",
            "memberships",
        ),
        test_config=test_config,
    )
