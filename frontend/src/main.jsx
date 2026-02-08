import React, { useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { CartProvider, useCart } from './context/CartContext'
import Products from './pages/Products'
import Cart from './pages/Cart'
import Login from './pages/Login'
import Register from './pages/Register'
import './styles.css'

function Header() {
  const { token, logout } = useAuth()
  const { cart } = useCart()
  const navigate = useNavigate()

  const cartCount = cart?.items?.length || 0

  return (
    <header className="header">
      <div className="header-brand">
        <Link to="/" className="logo">
          🛍️ ShopSphere
        </Link>
      </div>
      <nav className="nav">
        <Link to="/" className="nav-link">
          Products
        </Link>
        <Link to="/cart" className="nav-link">
          🛒 Cart
          {cartCount > 0 && <span className="badge">{cartCount}</span>}
        </Link>
        {token ? (
          <>
            <button
              className="nav-link btn-logout"
              onClick={() => {
                logout()
                navigate('/login')
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">
              Login
            </Link>
            <Link to="/register" className="nav-link btn-register">
              Register
            </Link>
          </>
        )}
      </nav>
    </header>
  )
}

function AppContent() {
  const { token, setToken } = useAuth()
  const { fetchCart } = useCart()

  useEffect(() => {
    if (token) {
      fetchCart()
    }
  }, [token])

  return (
    <div className="app-layout">
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Products />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
      <footer className="footer">
        <p>&copy; 2026 ShopSphere. All rights reserved.</p>
      </footer>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

createRoot(document.getElementById('root')).render(<App />)
