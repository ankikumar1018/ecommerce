import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import api from '../api'

export default function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [expandedProduct, setExpandedProduct] = useState(null)
  const [selectedVariants, setSelectedVariants] = useState({})
  const [quantities, setQuantities] = useState({})
  const [addingToCart, setAddingToCart] = useState({})

  const { token } = useAuth()
  const { addToCart } = useCart()

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    setLoading(true)
    setError(null)
    try {
      const resp = await api.get('products/')
      setProducts(resp.data)
    } catch (err) {
      setError('Failed to load products')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = async (productId, variantId) => {
    if (!token) {
      alert('Please login first')
      window.location.href = '/login'
      return
    }

    const quantity = parseInt(quantities[`${productId}-${variantId}`]) || 1
    setAddingToCart(prev => ({ ...prev, [`${productId}-${variantId}`]: true }))

    const success = await addToCart(variantId, quantity)
    setAddingToCart(prev => ({ ...prev, [`${productId}-${variantId}`]: false }))

    if (success) {
      setQuantities(prev => ({
        ...prev,
        [`${productId}-${variantId}`]: 1
      }))
      setSelectedVariants(prev => {
        const copy = { ...prev }
        delete copy[productId]
        return copy
      })
      alert('Added to cart!')
    }
  }

  if (loading) {
    return <div className="container"><p className="loading">Loading products...</p></div>
  }

  if (error) {
    return (
      <div className="container">
        <p className="error">{error}</p>
        <button onClick={fetchProducts} className="btn btn-primary">
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="products-header">
        <h1>Products</h1>
        <p className="products-count">
          Showing {products.length} product{products.length !== 1 ? 's' : ''}
        </p>
      </div>

      {products.length === 0 ? (
        <p className="no-products">No products available</p>
      ) : (
        <div className="grid">
          {products.map(product => (
            <div key={product.id} className="product-card">
              <div className="product-header">
                <h3 className="product-name">{product.name}</h3>
                {product.category && (
                  <span className="product-category">{product.category}</span>
                )}
              </div>
              <p className="product-description">{product.description}</p>

              {product.variants && product.variants.length > 0 && (
                <div className="product-variants">
                  <p className="variants-label">
                    Available variants: {product.variants.length}
                  </p>

                  {/* If product has only one variant allow quick add on card */}
                  {product.variants.length === 1 && (
                    <div className="variant-item single-variant">
                      {product.variants.map(variant => (
                        <div key={variant.id} className="variant-quick">
                          <span className="variant-price">
                            <strong>${(Number(variant.price) || 0).toFixed(2)}</strong>
                          </span>
                          <select
                            value={quantities[`${product.id}-${variant.id}`] || 1}
                            onChange={e =>
                              setQuantities(prev => ({
                                ...prev,
                                [`${product.id}-${variant.id}`]: e.target.value
                              }))
                            }
                            className="qty-select"
                          >
                            {[1, 2, 3, 4, 5].map(q => (
                              <option key={q} value={q}>
                                Qty: {q}
                              </option>
                            ))}
                          </select>
                          <button
                            className="btn btn-primary"
                            onClick={() => handleAddToCart(product.id, variant.id)}
                            disabled={addingToCart[`${product.id}-${variant.id}`]}
                          >
                            {addingToCart[`${product.id}-${variant.id}`]
                              ? 'Adding...'
                              : 'Add to Cart'}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {expandedProduct === product.id && (
                    <div className="variants-expanded">
                      {product.variants.map(variant => (
                        <div key={variant.id} className="variant-item">
                          <div className="variant-info">
                            <span className="variant-sku">
                              <strong>SKU:</strong> {variant.sku}
                            </span>
                            {variant.size && (
                              <span className="variant-size">
                                <strong>Size:</strong> {variant.size}
                              </span>
                            )}
                            {variant.color && (
                              <span className="variant-color">
                                <strong>Color:</strong> {variant.color}
                              </span>
                            )}
                            <span className="variant-price">
                              <strong>${(Number(variant.price) || 0).toFixed(2)}</strong>
                            </span>
                            <span className={`variant-stock ${variant.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                              {variant.stock > 0 ? `${variant.stock} in stock` : 'Out of stock'}
                            </span>
                          </div>

                          {variant.stock > 0 && (
                            <div className="variant-actions">
                              <select
                                value={quantities[`${product.id}-${variant.id}`] || 1}
                                onChange={e =>
                                  setQuantities(prev => ({
                                    ...prev,
                                    [`${product.id}-${variant.id}`]: e.target.value
                                  }))
                                }
                                className="qty-select"
                              >
                                {[1, 2, 3, 4, 5].map(q => (
                                  <option key={q} value={q}>
                                    Qty: {q}
                                  </option>
                                ))}
                              </select>
                              <button
                                className="btn btn-primary"
                                onClick={() => handleAddToCart(product.id, variant.id)}
                                disabled={addingToCart[`${product.id}-${variant.id}`]}
                              >
                                {addingToCart[`${product.id}-${variant.id}`]
                                  ? 'Adding...'
                                  : 'Add to Cart'}
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  <button
                    className="btn btn-secondary btn-toggle"
                    onClick={() =>
                      setExpandedProduct(expandedProduct === product.id ? null : product.id)
                    }
                  >
                    {expandedProduct === product.id ? 'Hide Variants' : 'View Variants'}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
