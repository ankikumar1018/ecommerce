// Environment configuration
// This file determines API endpoints and other settings based on environment

const ENV = import.meta.env.MODE || 'development'

const config = {
  development: {
    apiBase: 'http://localhost:8000',
    apiTimeout: 30000,
    debug: true,
    logRequests: true,
  },
  staging: {
    apiBase: process.env.VITE_API_BASE || 'https://staging-api.shopsphere.com',
    apiTimeout: 15000,
    debug: true,
    logRequests: false,
  },
  production: {
    apiBase: process.env.VITE_API_BASE || 'https://api.shopsphere.com',
    apiTimeout: 15000,
    debug: false,
    logRequests: false,
  }
}

export default config[ENV] || config.development
