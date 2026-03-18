// Spec: specs/api/auth.spec.md
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '@/types'
import { UserRole } from '@/types'

const SSO_LOGIN_URL = import.meta.env.VITE_SSO_LOGIN_URL as string ?? 'https://sso.example.com/oauth/authorize'
const SSO_CLIENT_ID = import.meta.env.VITE_SSO_CLIENT_ID as string ?? 'ai-platform-admin'

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref<string | null>(localStorage.getItem('admin_accessToken'))
  const refreshToken = ref<string | null>(localStorage.getItem('admin_refreshToken'))
  const user = ref<User | null>(
    localStorage.getItem('admin_user') ? JSON.parse(localStorage.getItem('admin_user')!) : null,
  )

  const isAuthenticated = computed(() => !!accessToken.value && !!user.value)

  const isAdmin = computed(() => user.value?.role === UserRole.Admin)

  const isEditorOrAbove = computed(
    () => user.value?.role === UserRole.Editor || user.value?.role === UserRole.Admin,
  )

  function hasModulePermission(module: string): boolean {
    if (!user.value) return false
    if (user.value.role === UserRole.Admin) return true
    return user.value.role === UserRole.Editor && user.value.permissions.includes(module)
  }

  function setAuth(data: { accessToken: string; refreshToken: string; user: User }) {
    accessToken.value = data.accessToken
    refreshToken.value = data.refreshToken
    user.value = data.user
    localStorage.setItem('admin_accessToken', data.accessToken)
    localStorage.setItem('admin_refreshToken', data.refreshToken)
    localStorage.setItem('admin_user', JSON.stringify(data.user))
  }

  function clearAuth() {
    accessToken.value = null
    refreshToken.value = null
    user.value = null
    localStorage.removeItem('admin_accessToken')
    localStorage.removeItem('admin_refreshToken')
    localStorage.removeItem('admin_user')
  }

  function redirectToSSO(redirectPath = '/') {
    const redirectUri = encodeURIComponent(
      `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirectPath)}`,
    )
    window.location.href = `${SSO_LOGIN_URL}?client_id=${SSO_CLIENT_ID}&redirect_uri=${redirectUri}&response_type=code`
  }

  async function refresh(): Promise<string> {
    const { refreshAccessToken } = await import('@/api/auth')
    const data = await refreshAccessToken(refreshToken.value!)
    accessToken.value = data.accessToken
    refreshToken.value = data.refreshToken
    localStorage.setItem('admin_accessToken', data.accessToken)
    localStorage.setItem('admin_refreshToken', data.refreshToken)
    return data.accessToken
  }

  return {
    accessToken,
    refreshToken,
    user,
    isAuthenticated,
    isAdmin,
    isEditorOrAbove,
    hasModulePermission,
    setAuth,
    clearAuth,
    redirectToSSO,
    refresh,
  }
})
