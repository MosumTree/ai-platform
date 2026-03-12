// Spec: specs/api/auth.spec.md
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from 'shared'

const SSO_LOGIN_URL = import.meta.env.VITE_SSO_LOGIN_URL as string ?? 'https://sso.example.com/oauth/authorize'
const SSO_CLIENT_ID = import.meta.env.VITE_SSO_CLIENT_ID as string ?? 'ai-platform-portal'

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref<string | null>(localStorage.getItem('accessToken'))
  const refreshToken = ref<string | null>(localStorage.getItem('refreshToken'))
  const user = ref<User | null>(
    localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null,
  )

  const isAuthenticated = computed(
    () => !!accessToken.value && !!user.value,
  )

  function setAuth(data: { accessToken: string; refreshToken: string; user: User }) {
    accessToken.value = data.accessToken
    refreshToken.value = data.refreshToken
    user.value = data.user
    localStorage.setItem('accessToken', data.accessToken)
    localStorage.setItem('refreshToken', data.refreshToken)
    localStorage.setItem('user', JSON.stringify(data.user))
  }

  function clearAuth() {
    accessToken.value = null
    refreshToken.value = null
    user.value = null
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
  }

  function redirectToSSO(redirectPath = '/') {
    const redirectUri = encodeURIComponent(
      `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirectPath)}`,
    )
    window.location.href = `${SSO_LOGIN_URL}?client_id=${SSO_CLIENT_ID}&redirect_uri=${redirectUri}&response_type=code`
  }

  async function refresh(): Promise<string> {
    // 由 http.ts 的响应拦截器调用，实际请求在 api/auth.ts 中发起
    const { refreshAccessToken } = await import('@/api/auth')
    const data = await refreshAccessToken(refreshToken.value!)
    accessToken.value = data.accessToken
    refreshToken.value = data.refreshToken
    localStorage.setItem('accessToken', data.accessToken)
    localStorage.setItem('refreshToken', data.refreshToken)
    return data.accessToken
  }

  return {
    accessToken,
    refreshToken,
    user,
    isAuthenticated,
    setAuth,
    clearAuth,
    redirectToSSO,
    refresh,
  }
})
