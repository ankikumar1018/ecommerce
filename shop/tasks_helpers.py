import requests


def deliver_event(url, payload, timeout=5):
    """Attempt to POST payload to url. Return True on 2xx, False otherwise.
    This helper is synchronous and easily testable (no Celery context required).
    """
    resp = requests.post(url, json=payload, timeout=timeout)
    try:
        resp.raise_for_status()
    except requests.RequestException:
        return False
    return True
