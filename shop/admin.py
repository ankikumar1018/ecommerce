from django.contrib import admin
from .models import Category, Product, ProductVariant, Cart, CartItem, Order, OrderItem, Payment, WebhookEvent

admin.site.register(Category)
admin.site.register(Product)
admin.site.register(ProductVariant)
admin.site.register(Cart)
admin.site.register(CartItem)
admin.site.register(Order)
admin.site.register(OrderItem)
admin.site.register(Payment)
admin.site.register(WebhookEvent)
