import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000'

const api = axios.create({
  baseURL: API_BASE + '/api/',
  headers: { 'Content-Type': 'application/json' }
})

// Add token from localStorage if it exists
const token = localStorage.getItem('access')
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    localStorage.setItem('access', token)
  } else {
    delete api.defaults.headers.common['Authorization']
    localStorage.removeItem('access')
  }
}

// Add response interceptor to handle 401 errors
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      setAuthToken(null)
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
