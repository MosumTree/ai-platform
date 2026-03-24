// Spec: specs/api/auth.spec.md + specs/portal/home.spec.md
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

// 统一前缀：/rest/cbc/aiplatform（不走 /api）
// 本地不配置时走相对路径；现网仅配置域名（不带路径）即可
const API_PREFIX = '/rest/cbc/aiplatform'
const rawApiOrigin = (import.meta.env.VITE_API_ORIGIN || '').trim()
const baseURL = (() => {
  if (!rawApiOrigin) return API_PREFIX
  const normalized = rawApiOrigin.replace(/\/+$/, '')
  return `${normalized}${API_PREFIX}`
})()

const http = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

let isRefreshing = false
let refreshQueue: Array<(token: string) => void> = []

http.interceptors.request.use((config) => {
  // useAuthStore() 在函数内调用，确保 Pinia 已初始化
  const authStore = useAuthStore()
  if (authStore.accessToken) {
    config.headers.Authorization = `Bearer ${authStore.accessToken}`
  }
  return config
})

http.interceptors.response.use(
  (response) => {
    // 后端统一响应格式 { code, message, data }，直接返回 data 字段
    const body = response.data
    if (body && typeof body === 'object' && 'data' in body) {
      return body.data
    }
    return body
  },
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      const authStore = useAuthStore()

      if (!authStore.refreshToken) {
        authStore.clearAuth()
        authStore.redirectToSSO()
        return Promise.reject(error)
      }

      if (isRefreshing) {
        return new Promise((resolve) => {
          refreshQueue.push((token: string) => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            resolve(http(originalRequest))
          })
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const newToken = await authStore.refresh()
        refreshQueue.forEach((cb) => cb(newToken))
        refreshQueue = []
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return http(originalRequest)
      } catch {
        authStore.clearAuth()
        authStore.redirectToSSO()
        return Promise.reject(error)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  },
)

export default http
