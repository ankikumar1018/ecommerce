from django.core.cache import cache

from .models import Product

CACHE_TTL = 60  # seconds for demo


class ProductRepository:
    def list_active(self):
        key = 'products:active'
        data = cache.get(key)
        if data is not None:
            return data
        qs = Product.objects.filter(is_active=True).prefetch_related('variants', 'category')
        
        data = list(qs)
        cache.set(key, data, CACHE_TTL)
        return data


class OrderRepository:
    def get_user_orders(self, user):
        return (
            user.orders.select_related().prefetch_related('items__variant')
        )
