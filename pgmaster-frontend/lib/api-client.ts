import axios, { AxiosInstance, AxiosError } from 'axios'
import { useAuthStore } from '@/hooks/useAuth'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

const client: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  const isAuthRoute = config.url?.includes('/auth/login') || config.url?.includes('/auth/register') || config.url?.includes('/auth/google-login')
  
  if (token && !isAuthRoute) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor
client.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token expired, try to refresh
      try {
        const refreshToken = localStorage.getItem('refresh_token')
        if (refreshToken) {
          const response = await axios.post(`${API_URL}/auth/token/refresh/`, {
            refresh: refreshToken,
          })
          const newAccessToken = response.data.access
          localStorage.setItem('access_token', newAccessToken)
          
          // Retry original request
          return client.request(error.config!)
        }
      } catch (err) {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        window.location.href = '/auth/login'
      }
    }
    return Promise.reject(error)
  }
)

export default client
