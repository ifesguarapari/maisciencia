"""Public health aggregation over a fixed allowlist of backend services."""

from concurrent.futures import ThreadPoolExecutor
import json
from urllib.error import HTTPError, URLError
from urllib.request import urlopen

SERVICE_NAMES = (
    "administrations",
    "activities",
    "events",
    "content",
    "authentication",
    "messaging",
    "integrations",
)


def fetch_health(slug, base_url):
    """Verify both the HTTP response and the expected service identity."""
    try:
        with urlopen(f"{base_url.rstrip('/')}/health", timeout=2) as response:
            body = response.read(4097)
            if len(body) > 4096:
                return False
            data = json.loads(body)
            return data.get("status") == "ok" and data.get("service") == slug
    except HTTPError as error:
        error.close()
        return False
    except (URLError, OSError, ValueError, AttributeError):
        return False


def service_statuses(config):
    """Report each dependency independently without accepting caller-provided URLs."""
    fetcher = config.get("HEALTH_FETCHER") or fetch_health
    urls = config["SERVICE_URLS"]

    def check(slug):
        try:
            available = fetcher(slug, urls[slug])
        except (OSError, ValueError, KeyError):
            available = False
        return {"slug": slug, "status": "ok" if available else "unavailable"}

    with ThreadPoolExecutor(max_workers=7) as executor:
        results = list(executor.map(check, SERVICE_NAMES))
    return [{"slug": "web", "status": "ok"}, *results]
