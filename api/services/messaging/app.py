"""Messaging API for conversations, messages, and notifications."""

from pathlib import Path

from dotenv import load_dotenv
from maisciencia_common import create_service


def create_app(test_config=None):
    """Create the independent messaging application."""
    load_dotenv(Path(__file__).with_name(".env"))
    return create_service(
        "messaging",
        collections=(
            "conversations",
            "messages",
            "notifications",
        ),
        test_config=test_config,
    )
