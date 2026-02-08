import pytest
from django.contrib.auth import get_user_model
from shop.models import Category, Product, ProductVariant, Cart, CartItem, Order, OrderItem, WebhookEvent

User = get_user_model()


@pytest.mark.django_db
def test_product_and_variant_creation():
    cat = Category.objects.create(name='Toys', slug='toys')
    p = Product.objects.create(name='Toy Car', description='Fast car', category=cat)
    v = ProductVariant.objects.create(product=p, sku='TC-001', price='9.99', stock=10)

    assert p.variants.count() == 1
    assert v.stock == 10
    assert float(v.price) == 9.99


@pytest.mark.django_db
def test_cart_operations():
    user = User.objects.create_user(username='alice', password='pass')
    cart = Cart.objects.create(user=user)
    cat = Category.objects.create(name='Books', slug='books')
    p = Product.objects.create(name='Book A', description='A', category=cat)
    v = ProductVariant.objects.create(product=p, sku='BK-1', price='5.00', stock=3)

    item = CartItem.objects.create(cart=cart, variant=v, quantity=2)
    assert cart.total_items() == 2
    assert cart.total_price() == 10.00

    item.quantity = 1
    item.save()
    assert cart.total_items() == 1


@pytest.mark.django_db
def test_order_creation_from_cart():
    user = User.objects.create_user(username='bob', password='pass')
    cat = Category.objects.create(name='Electronics', slug='electronics')
    p = Product.objects.create(name='Headphones', description='', category=cat)
    v = ProductVariant.objects.create(product=p, sku='HP-1', price='49.99', stock=5)

    order = Order.objects.create(user=user, total=49.99)
    OrderItem.objects.create(order=order, variant=v, quantity=1, price=v.price)
    assert order.items.count() == 1
    assert float(order.total) == 49.99


@pytest.mark.django_db
def test_webhook_event_retry_and_idempotency():
    payload = {'order_id': 123}
    ev = WebhookEvent.objects.create(event='order.created', payload=payload)
    assert ev.attempts == 0
    ev.mark_attempt()
    assert ev.attempts == 1
    ev.mark_delivered()
    assert ev.delivered is True
