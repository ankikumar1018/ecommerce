import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api, { setAuthToken } from '../api'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const navigate = useNavigate()
  const { token, setToken } = useAuth()

  useEffect(() => {
    if (token) {
      navigate('/')
    }
  }, [token])

  const validateForm = () => {
    if (!username.trim()) {
      setError('Username is required')
      return false
    }
    if (!password) {
      setError('Password is required')
      return false
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return false
    }
    return true
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')

    if (!validateForm()) {
      return
    }

    setLoading(true)
    try {
      const resp = await api.post('auth/login/', { username, password })
      const { access } = resp.data
      
      setAuthToken(access)
      setToken(access)
      
      navigate('/')
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 
                       err.response?.data?.non_field_errors?.[0] ||
                       'Login failed. Please check your credentials.'
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <div className="auth-form">
        <h1>Login to ShopSphere</h1>
        <p className="auth-subtitle">Welcome back! Sign in to your account</p>

        <form onSubmit={handleSubmit} className="form">
          {error && <p className="error alert">{error}</p>}

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={e => {
                setUsername(e.target.value)
                setError('')
              }}
              disabled={loading}
              className="form-input"
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-wrapper">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={e => {
                  setPassword(e.target.value)
                  setError('')
                }}
                disabled={loading}
                className="form-input"
                autoComplete="current-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '👁️‍🗨️' : '👁️'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-block"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account?{' '}
          <Link to="/register" className="auth-link">
            Create one now
          </Link>
        </p>

        <div className="demo-credentials">
          <p className="demo-title">Demo Credentials:</p>
          <p>Username: <code>demo</code></p>
          <p>Password: <code>demo123</code></p>
        </div>
      </div>
    </div>
  )
}
