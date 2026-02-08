from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('products/', views.ProductList.as_view(), name='product-list'),
    path('auth/register/', views.RegisterView.as_view(), name='register'),
    path('auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('cart/add/', views.CartAddView.as_view(), name='cart-add'),
    path('cart/', views.CartView.as_view(), name='cart'),
    path('cart/item/<int:pk>/', views.CartItemDetail.as_view(), name='cart-item-detail'),
    path('checkout/', views.CheckoutView.as_view(), name='checkout'),
    path('webhook/', views.WebhookReceiver.as_view(), name='webhook-receiver'),
]
