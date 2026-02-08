import pytest
from types import SimpleNamespace
from shop.schema_graphql import schema
from django.contrib.auth import get_user_model

User = get_user_model()


@pytest.mark.django_db
def test_resolve_orders_unauthenticated():
    q = '{ orders { id } }'
    r = schema.execute(q, context_value=SimpleNamespace(user=None))
    assert not r.errors
    assert r.data['orders'] == []


@pytest.mark.django_db
def test_create_order_unauthenticated_raises():
    m = 'mutation { createOrder(items: [1]) { ok } }'
    r = schema.execute(m, context_value=SimpleNamespace(user=None))
    assert r.errors
