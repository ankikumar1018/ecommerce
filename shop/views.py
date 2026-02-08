from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.shortcuts import get_object_or_404
from .models import Cart, CartItem, ProductVariant, Order, OrderItem, Payment, WebhookEvent
from .serializers import ProductSerializer, RegisterSerializer, CartAddSerializer, CheckoutSerializer
import hmac
import hashlib
from django.conf import settings
from .tasks import deliver_webhook


class ProductList(generics.ListAPIView):
    serializer_class = ProductSerializer

    def get_queryset(self):
        from .repositories import ProductRepository
        repo = ProductRepository()
        return repo.list_active()


class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        ser = RegisterSerializer(data=request.data)
        ser.is_valid(raise_exception=True)
        user = ser.save()
        return Response({'id': user.id, 'username': user.username}, status=status.HTTP_201_CREATED)


class CartAddView(APIView):
    def post(self, request):
        ser = CartAddSerializer(data=request.data)
        ser.is_valid(raise_exception=True)
        variant = get_object_or_404(ProductVariant, pk=ser.validated_data['variant_id'])
        cart, _ = Cart.objects.get_or_create(user=request.user)
        item, created = CartItem.objects.get_or_create(cart=cart, variant=variant, defaults={'quantity': ser.validated_data['quantity']})
        if not created:
            item.quantity += ser.validated_data['quantity']
            item.save()
        return Response({'cart_id': cart.id, 'item_count': cart.total_items()})


class CartView(APIView):
    def get(self, request):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        from .serializers import CartSerializer
        return Response(CartSerializer(cart).data)


class CheckoutView(APIView):
    def post(self, request):
        ser = CheckoutSerializer(data=request.data)
        ser.is_valid(raise_exception=True)
        cart, _ = Cart.objects.get_or_create(user=request.user)
        if cart.items.count() == 0:
            return Response({'detail': 'Cart empty'}, status=status.HTTP_400_BAD_REQUEST)
        order = Order.objects.create(user=request.user, total=cart.total_price())
        for item in cart.items.all():
            OrderItem.objects.create(order=order, variant=item.variant, quantity=item.quantity, price=item.variant.price)
        Payment.objects.create(order=order, provider='stub', amount=order.total, success=True)
        cart.items.all().delete()
        return Response({'order_id': order.id, 'status': order.status})


class WebhookReceiver(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        signature = request.headers.get('X-Signature')
        payload = request.body
        secret = getattr(settings, 'WEBHOOK_SECRET', None)
        if secret:
            expected = hmac.new(secret.encode(), payload, hashlib.sha256).hexdigest()
            if not hmac.compare_digest(expected, signature or ''):
                return Response({'detail': 'Invalid signature'}, status=status.HTTP_400_BAD_REQUEST)
        ev = WebhookEvent.objects.create(event=request.data.get('event', 'unknown'), payload=request.data)
        ev.mark_attempt()
        # enqueue delivery task
        try:
            deliver_webhook.delay(ev.id)
        except Exception:
            # fallback: mark delivered locally
            ev.mark_delivered()
        return Response({'status': 'received'})


class CartItemDetail(APIView):
    """Handle update (PATCH) and delete (DELETE) for cart items."""

    def get_object(self, pk, user):
        cart, _ = Cart.objects.get_or_create(user=user)
        return get_object_or_404(CartItem, pk=pk, cart=cart)

    def patch(self, request, pk):
        item = self.get_object(pk, request.user)
        quantity = request.data.get('quantity')
        try:
            quantity = int(quantity)
        except Exception:
            return Response({'detail': 'Invalid quantity'}, status=status.HTTP_400_BAD_REQUEST)
        if quantity < 1:
            return Response({'detail': 'Quantity must be >= 1'}, status=status.HTTP_400_BAD_REQUEST)
        item.quantity = quantity
        item.save()
        from .serializers import CartSerializer
        cart, _ = Cart.objects.get_or_create(user=request.user)
        return Response(CartSerializer(cart).data)

    def delete(self, request, pk):
        item = self.get_object(pk, request.user)
        item.delete()
        from .serializers import CartSerializer
        cart, _ = Cart.objects.get_or_create(user=request.user)
        return Response(CartSerializer(cart).data)
