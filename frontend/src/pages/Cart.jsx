import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

export default function Cart() {
  const { token } = useAuth()
  const navigate = useNavigate()
  const { cart, loading, error, fetchCart, removeFromCart, updateCartItem, checkout } = useCart()
  const [checkingOut, setCheckingOut] = useState(false)
  const [checkoutError, setCheckoutError] = useState(null)
  const [paymentMethod, setPaymentMethod] = useState('credit_card')

  useEffect(() => {
    if (token) {
      fetchCart()
    } else {
      navigate('/login')
    }
  }, [token])

  const handleRemove = async itemId => {
    const success = await removeFromCart(itemId)
    if (success) {
      alert('Item removed from cart')
    }
  }

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return
    const success = await updateCartItem(itemId, newQuantity)
    if (!success) {
      alert('Failed to update quantity')
    }
  }

  const handleCheckout = async e => {
    e.preventDefault()
    setCheckoutError(null)
    setCheckingOut(true)

    const order = await checkout(paymentMethod)
    setCheckingOut(false)

    if (order) {
      alert(`Order placed successfully! Order ID: ${order.id}`)
      navigate('/')
    } else {
      setCheckoutError('Checkout failed. Please try again.')
    }
  }

  if (!token) {
    return (
      <div className="container">
        <p className="warning">Please login to view your cart</p>
      </div>
    )
  }

  if (loading) {
    return <div className="container"><p className="loading">Loading cart...</p></div>
  }

  if (error && !cart) {
    return (
      <div className="container">
        <p className="error">{error}</p>
        <button onClick={fetchCart} className="btn btn-primary">
          Retry
        </button>
      </div>
    )
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container cart-empty">
        <h1>Your Cart</h1>
        <p className="no-items">Your cart is empty</p>
        <button onClick={() => navigate('/')} className="btn btn-primary">
          Continue Shopping
        </button>
      </div>
    )
  }

  return (
    <div className="container">
      <h1>Your Cart</h1>

      <div className="cart-content">
        <div className="cart-items">
          <div className="cart-table-header">
            <div className="col-product">Product</div>
            <div className="col-price">Price</div>
            <div className="col-qty">Quantity</div>
            <div className="col-total">Total</div>
            <div className="col-actions">Action</div>
          </div>

          {cart.items.map(item => (
            <div key={item.id} className="cart-item">
              <div className="col-product">
                <div>
                  <p className="item-sku">
                    <strong>SKU: {item.variant.sku}</strong>
                  </p>
                  {item.variant.size && (
                    <p className="item-attr">Size: {item.variant.size}</p>
                  )}
                  {item.variant.color && (
                    <p className="item-attr">Color: {item.variant.color}</p>
                  )}
                </div>
              </div>
                <div className="col-price">
                <p>${(Number(item.variant.price) || 0).toFixed(2)}</p>
              </div>
              <div className="col-qty">
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={e =>
                    handleUpdateQuantity(item.id, parseInt(e.target.value))
                  }
                  className="qty-input"
                />
              </div>
              <div className="col-total">
                <p className="item-total">
                  ${(Number(item.variant.price) * item.quantity).toFixed(2)}
                </p>
              </div>
              <div className="col-actions">
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleRemove(item.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h2>Order Summary</h2>
            <div className="summary-row">
            <span>Subtotal:</span>
            <span>${(Number(cart.total_price) || 0).toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Items:</span>
            <span>{cart.total_items}</span>
          </div>
          <div className="summary-row total">
            <span>Total:</span>
            <span className="total-price">${(Number(cart.total_price) || 0).toFixed(2)}</span>
          </div>

          <form onSubmit={handleCheckout} className="checkout-form">
            <div className="form-group">
              <label htmlFor="payment">Payment Method:</label>
              <select
                id="payment"
                value={paymentMethod}
                onChange={e => setPaymentMethod(e.target.value)}
                className="form-input"
                disabled={checkingOut}
              >
                <option value="credit_card">Credit Card</option>
                <option value="debit_card">Debit Card</option>
                <option value="paypal">PayPal</option>
                <option value="wire_transfer">Wire Transfer</option>
              </select>
            </div>

            {checkoutError && <p className="error">{checkoutError}</p>}
            {error && <p className="error">{error}</p>}

            <button
              type="submit"
              className="btn btn-primary btn-checkout"
              disabled={checkingOut}
            >
              {checkingOut ? 'Processing...' : 'Proceed to Checkout'}
            </button>
          </form>

          <button
            onClick={() => navigate('/')}
            className="btn btn-secondary btn-continue"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  )
}
