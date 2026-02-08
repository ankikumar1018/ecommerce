import pytest
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from shop.models import Category, Product, ProductVariant

User = get_user_model()


@pytest.mark.django_db
def test_register_and_login():
    client = APIClient()
    resp = client.post('/api/auth/register/', {'username': 't1', 'password': 'p1'})
    assert resp.status_code == 201
    resp = client.post('/api/auth/login/', {'username': 't1', 'password': 'p1'})
    assert resp.status_code == 200
    assert 'access' in resp.data


@pytest.mark.django_db
def test_cart_and_checkout_flow():
    client = APIClient()
    # create user
    client.post('/api/auth/register/', {'username': 'cuser', 'password': 'pw'})
    login = client.post('/api/auth/login/', {'username': 'cuser', 'password': 'pw'}).data
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {login['access']}")

    cat = Category.objects.create(name='Cat', slug='cat')
    p = Product.objects.create(name='X', description='', category=cat)
    v = ProductVariant.objects.create(product=p, sku='X-1', price='10.00', stock=5)

    resp = client.post('/api/cart/add/', {'variant_id': v.id, 'quantity': 2}, format='json')
    assert resp.status_code == 200
    resp = client.get('/api/cart/')
    assert resp.status_code == 200
    resp = client.post('/api/checkout/', {'address': 'Addr'}, format='json')
    assert resp.status_code == 200


@pytest.mark.django_db
def test_webhook_signature():
    client = APIClient()
    payload = {'event': 'test', 'data': {}}
    import json
    import hmac
    import hashlib
    import os
    secret = os.environ.get('WEBHOOK_SECRET', 'supersecret')
    raw = json.dumps(payload).encode()
    sig = hmac.new(secret.encode(), raw, hashlib.sha256).hexdigest()
    resp = client.post('/api/webhook/', payload, format='json', HTTP_X_SIGNATURE=sig)
    assert resp.status_code == 200
