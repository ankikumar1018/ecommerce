import time
import logging
from django.utils.deprecation import MiddlewareMixin

logger = logging.getLogger(__name__)


class RequestLoggingMiddleware(MiddlewareMixin):
    def process_request(self, request):
        request._start_time = time.time()

    def process_response(self, request, response):
        try:
            duration = time.time() - getattr(request, '_start_time', time.time())
            logger.info('%s %s %s %.3fs', request.method, request.path, response.status_code, duration)
        except Exception:
            logger.exception('Failed to log request')
        return response
