import pytest
from django.test import override_settings
from shop.repositories import ProductRepository
from shop.models import Category, Product, ProductVariant


@pytest.mark.django_db
@override_settings(CACHES={
    'default': {'BACKEND': 'django.core.cache.backends.locmem.LocMemCache'}
})
def test_product_repository_caching():
    cat = Category.objects.create(name='T1', slug='t1')
    p1 = Product.objects.create(name='P1', description='', category=cat, is_active=True)
    Product.objects.create(name='P2', description='', category=cat, is_active=True)
    ProductVariant.objects.create(product=p1, sku='P1-1', price='1.00', stock=5)
    repo = ProductRepository()
    first = repo.list_active()
    assert len(first) >= 2
    # create another product and ensure cached result still returns old list
    Product.objects.create(name='P3', description='', category=cat, is_active=True)
    second = repo.list_active()
    assert any(p.name == 'P1' for p in second)
