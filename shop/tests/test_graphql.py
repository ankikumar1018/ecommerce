import pytest
from types import SimpleNamespace
from shop.schema_graphql import schema
from django.contrib.auth import get_user_model
from shop.models import Category, Product, ProductVariant

User = get_user_model()


@pytest.mark.django_db
def test_products_query():
    cat = Category.objects.create(name='G', slug='g')
    p = Product.objects.create(name='GG', description='d', category=cat, is_active=True)
    ProductVariant.objects.create(product=p, sku='GG-1', price='2.00', stock=3)
    q = '{ products { id name description } }'
    r = schema.execute(q, context_value=SimpleNamespace(user=None))
    assert not r.errors
    assert len(r.data['products']) >= 1


@pytest.mark.django_db
def test_create_order_mutation():
    user = User.objects.create_user(username='m1', password='p')
    cat = Category.objects.create(name='G2', slug='g2')
    p = Product.objects.create(name='P', description='', category=cat, is_active=True)
    v = ProductVariant.objects.create(product=p, sku='P-1', price='3.00', stock=2)
    m = f'mutation {{ createOrder(items: [{v.id}]) {{ ok orderId }} }}'
    r = schema.execute(m, context_value=SimpleNamespace(user=user))
    assert not r.errors
    assert r.data['createOrder']['ok'] is True
    assert r.data['createOrder']['orderId'] is not None