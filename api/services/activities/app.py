"""Activities API for workshops, practices, and records."""

from pathlib import Path

from dotenv import load_dotenv
from maisciencia_common import create_service


def create_app(test_config=None):
    """Create the independent activities application."""
    load_dotenv(Path(__file__).with_name(".env"))
    return create_service(
        "activities",
        collections=(
            "workshops",
            "practices",
            "records",
        ),
        test_config=test_config,
    )
