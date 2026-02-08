import pytest
from shop import schema as simple_schema
from types import SimpleNamespace
from shop.models import Category, Product, ProductVariant


@pytest.mark.django_db
def test_simple_schema_products():
    cat = Category.objects.create(name='S', slug='s')
    p = Product.objects.create(name='SS', description='', category=cat, is_active=True)
    ProductVariant.objects.create(product=p, sku='S-1', price='1.00', stock=1)
    q = '{ products { id name } }'
    r = simple_schema.schema.execute(q, context_value=SimpleNamespace(user=None))
    assert not r.errors
    assert len(r.data['products']) >= 1
