from celery import shared_task
import requests
from django.conf import settings
from .models import WebhookEvent

@shared_task(bind=True, max_retries=5)
def deliver_webhook(self, event_id):
    try:
        ev = WebhookEvent.objects.get(pk=event_id)
    except WebhookEvent.DoesNotExist:
        return False
    ev.mark_attempt()
    # delegate actual HTTP delivery to helper so it can be tested synchronously
    from .tasks_helpers import deliver_event
    # In a real setup you'd look up subscriber URLs; here we send to a configured endpoint
    url = getattr(settings, 'WEBHOOK_DELIVERY_URL', None)
    if not url:
        ev.mark_delivered()
        return True
    try:
        success = deliver_event(url, ev.payload)
        if success:
            ev.mark_delivered()
            return True
        else:
            raise requests.RequestException('delivery failed')
    except requests.RequestException:
        try:
            countdown = min(60 * (2 ** self.request.retries), 3600)
            raise self.retry(countdown=countdown)
        except self.MaxRetriesExceededError:
            return False


def deliver_webhook_sync(event_id):
    """Synchronous delivery helper for tests/environments without Celery.
    Mirrors the success/no-URL paths of the Celery task without retry behavior.
    """
    try:
        ev = WebhookEvent.objects.get(pk=event_id)
    except WebhookEvent.DoesNotExist:
        return False
    ev.mark_attempt()
    url = getattr(settings, 'WEBHOOK_DELIVERY_URL', None)
    if not url:
        ev.mark_delivered()
        return True
    from .tasks_helpers import deliver_event
    try:
        success = deliver_event(url, ev.payload)
        if success:
            ev.mark_delivered()
            return True
    except requests.RequestException:
        return False
    return False
