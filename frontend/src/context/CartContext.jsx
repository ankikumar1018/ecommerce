import React, { createContext, useState, useEffect } from 'react'
import api from '../api'

export const CartContext = createContext()

export function CartProvider({ children }) {
  const [cart, setCart] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchCart = async () => {
    setLoading(true)
    setError(null)
    try {
      const resp = await api.get('cart/')
      setCart(resp.data)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load cart')
      setCart(null)
    } finally {
      setLoading(false)
    }
  }

  const addToCart = async (variantId, quantity) => {
    setError(null)
    try {
      await api.post('cart/add/', { variant_id: variantId, quantity })
      await fetchCart()
      return true
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to add to cart')
      return false
    }
  }

  const removeFromCart = async (itemId) => {
    setError(null)
    try {
      await api.delete(`cart/item/${itemId}/`)
      await fetchCart()
      return true
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to remove from cart')
      return false
    }
  }

  const updateCartItem = async (itemId, quantity) => {
    setError(null)
    try {
      await api.patch(`cart/item/${itemId}/`, { quantity })
      await fetchCart()
      return true
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update cart')
      return false
    }
  }

  const checkout = async (paymentMethod) => {
    setError(null)
    try {
      const resp = await api.post('checkout/', { payment_method: paymentMethod })
      setCart(null)
      return resp.data
    } catch (err) {
      setError(err.response?.data?.detail || 'Checkout failed')
      return null
    }
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        error,
        fetchCart,
        addToCart,
        removeFromCart,
        updateCartItem,
        checkout
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = React.useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }
  return context
}
