"""Events API for events, registrations, and attendances."""

from pathlib import Path

from dotenv import load_dotenv
from maisciencia_common import create_service


def create_app(test_config=None):
    """Create the independent events application."""
    load_dotenv(Path(__file__).with_name(".env"))
    return create_service(
        "events",
        collections=(
            "events",
            "registrations",
            "attendances",
        ),
        test_config=test_config,
    )
