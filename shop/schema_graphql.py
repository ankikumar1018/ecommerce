import graphene
from graphene_django import DjangoObjectType
from .models import Product, ProductVariant, Order, OrderItem

class ProductVariantType(DjangoObjectType):
    class Meta:
        model = ProductVariant
        fields = ('id', 'sku', 'price', 'stock', 'attributes')

class ProductType(DjangoObjectType):
    class Meta:
        model = Product
        fields = ('id', 'name', 'description', 'variants')

class OrderItemType(DjangoObjectType):
    class Meta:
        model = OrderItem
        fields = ('id', 'variant', 'quantity', 'price')

class OrderType(DjangoObjectType):
    class Meta:
        model = Order
        fields = ('id', 'user', 'status', 'total', 'items')

    def resolve_total(self, info):
        try:
            return float(self.total)
        except Exception:
            return None

class CreateOrder(graphene.Mutation):
    class Arguments:
        items = graphene.List(graphene.Int, required=True)  # variant ids

    ok = graphene.Boolean()
    order = graphene.Field(lambda: OrderType)
    order_id = graphene.Int()

    def mutate(self, info, items):
        user = info.context.user
        if not user or not user.is_authenticated:
            raise Exception('Authentication required')
        order = Order.objects.create(user=user, total=0)
        total = 0
        for vid in items:
            variant = ProductVariant.objects.get(pk=vid)
            OrderItem.objects.create(order=order, variant=variant, quantity=1, price=variant.price)
            total += float(variant.price)
        order.total = total
        order.save()
        return CreateOrder(ok=True, order=order, order_id=order.id)

class Query(graphene.ObjectType):
    products = graphene.List(ProductType)
    orders = graphene.List(OrderType)

    def resolve_products(self, info):
        return Product.objects.filter(is_active=True)

    def resolve_orders(self, info):
        user = info.context.user
        if not user or not user.is_authenticated:
            return Order.objects.none()
        return Order.objects.filter(user=user)

class Mutation(graphene.ObjectType):
    create_order = CreateOrder.Field()

schema = graphene.Schema(query=Query, mutation=Mutation)
