import React from 'react'

// Common utilities for the frontend

/**
 * Format price to USD currency
 */
export function formatPrice(price) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price)
}

/**
 * Validate email format
 */
export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

/**
 * Validate username
 */
export function isValidUsername(username) {
  return username.length >= 3 && username.length <= 30
}

/**
 * Validate password strength
 */
export function isValidPassword(password) {
  return password.length >= 6
}

/**
 * Get error message from API response
 */
export function getErrorMessage(error) {
  if (error.response?.data?.detail) {
    return error.response.data.detail
  }
  if (error.response?.data?.non_field_errors?.[0]) {
    return error.response.data.non_field_errors[0]
  }
  if (typeof error.response?.data === 'string') {
    return error.response.data
  }
  const firstError = Object.values(error.response?.data || {}).flat()[0]
  if (typeof firstError === 'string') {
    return firstError
  }
  return error.message || 'An error occurred'
}

/**
 * Truncate text to specified length
 */
export function truncate(text, length = 50) {
  if (!text) return ''
  return text.length > length ? text.substring(0, length) + '...' : text
}

/**
 * Format date to readable format
 */
export function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

/**
 * Debounce function for search, etc.
 */
export function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

/**
 * Local storage utility
 */
export const storage = {
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch {
      return defaultValue
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (e) {
      console.error('Failed to save to localStorage:', e)
    }
  },
  remove(key) {
    localStorage.removeItem(key)
  },
  clear() {
    localStorage.clear()
  }
}
