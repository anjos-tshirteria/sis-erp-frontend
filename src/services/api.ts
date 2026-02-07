import axios from 'axios'
import type { AxiosError, InternalAxiosRequestConfig } from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error: AxiosError) => Promise.reject(error),
)

let isRefreshing = false
let failedQueue: Array<{
  resolve: (token: string) => void
  reject: (error: unknown) => void
}> = []

function processQueue(error: unknown, token: string | null) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (token) {
      resolve(token)
    } else {
      reject(error)
    }
  })
  failedQueue = []
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error)
    }

    const refreshToken = localStorage.getItem('refreshToken')
    if (!refreshToken) {
      const { useAuthStore } = await import('@/stores/auth')
      useAuthStore().logout()
      return Promise.reject(error)
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: (token: string) => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            resolve(api(originalRequest))
          },
          reject,
        })
      })
    }

    originalRequest._retry = true
    isRefreshing = true

    try {
      const { useAuthStore } = await import('@/stores/auth')
      const authStore = useAuthStore()
      const success = await authStore.refresh()

      if (success) {
        const newToken = authStore.accessToken!
        processQueue(null, newToken)
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return api(originalRequest)
      } else {
        processQueue(error, null)
        authStore.logout()
        return Promise.reject(error)
      }
    } catch (refreshError) {
      processQueue(refreshError, null)
      const { useAuthStore } = await import('@/stores/auth')
      useAuthStore().logout()
      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  },
)

export default api
