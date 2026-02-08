import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api'

export default function Register() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const navigate = useNavigate()
  const { token } = useAuth()

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
    if (username.length < 3) {
      setError('Username must be at least 3 characters')
      return false
    }
    if (!email.trim()) {
      setError('Email is required')
      return false
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address')
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
    if (password !== passwordConfirm) {
      setError('Passwords do not match')
      return false
    }
    return true
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    if (!validateForm()) {
      return
    }

    setLoading(true)
    try {
      // Prefer the canonical accounts/register route if available (tests expect this),
      // fall back to auth/register for compatibility with older setups.
      try {
        await api.post('accounts/register/', {
          username,
          email,
          password
        })
      } catch (err) {
        // if 404 or other error, try the auth/register endpoint
        if (!err.response || err.response.status === 404) {
          await api.post('auth/register/', {
            username,
            email,
            password
          })
        } else {
          throw err
        }
      }
      setSuccess(true)
      setUsername('')
      setEmail('')
      setPassword('')
      setPasswordConfirm('')
      
      setTimeout(() => {
        navigate('/login')
      }, 2000)
    } catch (err) {
      const errors = err.response?.data
      if (typeof errors === 'object') {
        const firstError = Object.values(errors).flat()[0]
        setError(firstError || 'Registration failed')
      } else {
        setError('Registration failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="container">
        <div className="auth-form">
          <div className="success-message">
            <h2>✓ Registration Successful!</h2>
            <p>Your account has been created successfully.</p>
            <p>Redirecting to login page...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="auth-form">
        <h1>Create Your Account</h1>
        <p className="auth-subtitle">Join ShopSphere today and start shopping</p>

        <form onSubmit={handleSubmit} className="form">
          {error && <p className="error alert">{error}</p>}

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              placeholder="Choose a username"
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
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={e => {
                setEmail(e.target.value)
                setError('')
              }}
              disabled={loading}
              className="form-input"
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-wrapper">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a password"
                value={password}
                onChange={e => {
                  setPassword(e.target.value)
                  setError('')
                }}
                disabled={loading}
                className="form-input"
                autoComplete="new-password"
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

          <div className="form-group">
            <label htmlFor="passwordConfirm">Confirm Password</label>
            <div className="password-input-wrapper">
              <input
                id="passwordConfirm"
                type={showPassword ? 'text' : 'password'}
                placeholder="Confirm your password"
                value={passwordConfirm}
                onChange={e => {
                  setPasswordConfirm(e.target.value)
                  setError('')
                }}
                disabled={loading}
                className="form-input"
                autoComplete="new-password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-block"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account?{' '}
          <Link to="/login" className="auth-link">
            Login here
          </Link>
        </p>
      </div>
    </div>
  )
}
