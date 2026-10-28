"""Content API for publications, news, and informations."""

from pathlib import Path

from dotenv import load_dotenv
from maisciencia_common import create_service


def create_app(test_config=None):
    """Create the independent content application."""
    load_dotenv(Path(__file__).with_name(".env"))
    return create_service(
        "content",
        collections=(
            "publications",
            "news",
            "informations",
        ),
        test_config=test_config,
    )
