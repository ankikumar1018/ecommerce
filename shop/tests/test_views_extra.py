import pytest
from rest_framework.test import APIClient
from shop.models import Category, Product, ProductVariant


@pytest.mark.django_db
def test_cart_add_increment():
    client = APIClient()
    client.post('/api/auth/register/', {'username': 'u1', 'password': 'pw'})
    login = client.post('/api/auth/login/', {'username': 'u1', 'password': 'pw'}).data
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {login['access']}")
    cat = Category.objects.create(name='C1', slug='c1')
    p = Product.objects.create(name='X1', description='', category=cat)
    v = ProductVariant.objects.create(product=p, sku='X1-1', price='2.00', stock=5)

    r = client.post('/api/cart/add/', {'variant_id': v.id, 'quantity': 1}, format='json')
    assert r.status_code == 200
    r = client.post('/api/cart/add/', {'variant_id': v.id, 'quantity': 2}, format='json')
    assert r.status_code == 200
    data = client.get('/api/cart/').data
    assert data['items'][0]['quantity'] == 3


@pytest.mark.django_db
def test_webhook_invalid_signature():
    client = APIClient()
    payload = {'event': 'x'}
    from django.conf import settings
    settings.WEBHOOK_SECRET = 'supersecret'
    resp = client.post('/api/webhook/', payload, format='json', HTTP_X_SIGNATURE='bad')
    assert resp.status_code == 400
