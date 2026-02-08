import pytest
from shop.models import WebhookEvent
from unittest.mock import patch
from types import SimpleNamespace
from django.conf import settings


@pytest.mark.django_db
def test_deliver_webhook_success(monkeypatch):
    settings.WEBHOOK_DELIVERY_URL = 'http://example.local/hook'
    ev = WebhookEvent.objects.create(event='e', payload={'a': 1})

    with patch('shop.tasks_helpers.deliver_event') as m:
        m.return_value = True
        # call synchronous helper for test (avoids Celery context)
        ok = __import__('shop.tasks', fromlist=['']).deliver_webhook_sync(ev.id)
        assert ok is True
        ev.refresh_from_db()
        assert ev.delivered is True


@pytest.mark.django_db
def test_deliver_webhook_max_retries_exceeded(monkeypatch):
    settings.WEBHOOK_DELIVERY_URL = 'http://example.local/hook'
    ev = WebhookEvent.objects.create(event='e2', payload={'a': 2})

    class DummySelf:
        def __init__(self):
            self.request = SimpleNamespace(retries=0)
        class MaxRetriesExceededError(Exception):
            pass
        def retry(self, countdown=None):
            raise DummySelf.MaxRetriesExceededError()

    with patch('shop.tasks_helpers.deliver_event') as m:
        import requests as _r
        m.side_effect = _r.RequestException('boom')
        # call synchronous helper instead of Celery task
        result = __import__('shop.tasks', fromlist=['']).deliver_webhook_sync(ev.id)
        assert result is False
        ev.refresh_from_db()
        assert ev.delivered is False
