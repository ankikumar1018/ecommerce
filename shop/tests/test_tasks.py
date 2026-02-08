from shop.tasks_helpers import deliver_event
from unittest.mock import patch


def test_deliver_event_success(monkeypatch):
    class DummyResp:
        status_code = 200
        def raise_for_status(self):
            return None
    with patch('shop.tasks_helpers.requests.post') as m:
        m.return_value = DummyResp()
        ok = deliver_event('http://example.local/hook', {'a': 1})
        assert ok is True


def test_deliver_event_failure(monkeypatch):
    class DummyResp:
        status_code = 500
        def raise_for_status(self):
            import requests as _r
            raise _r.RequestException('err')
    with patch('shop.tasks_helpers.requests.post') as m:
        m.return_value = DummyResp()
        ok = deliver_event('http://example.local/hook', {'a': 1})
        assert ok is False
