import graphene
from graphene_django import DjangoObjectType
from .models import Product


class ProductType(DjangoObjectType):
    class Meta:
        model = Product
        fields = ('id', 'name', 'description')


class Query(graphene.ObjectType):
    products = graphene.List(ProductType)

    def resolve_products(self, info):
        return Product.objects.filter(is_active=True)


schema = graphene.Schema(query=Query)

