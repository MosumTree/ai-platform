// Spec: specs/api/auth.spec.md
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '@/types'
import { UserRole } from '@/types'

const SSO_LOGIN_URL = import.meta.env.VITE_SSO_LOGIN_URL as string ?? 'https://sso.example.com/oauth/authorize'
const SSO_CLIENT_ID = import.meta.env.VITE_SSO_CLIENT_ID as string ?? 'ai-platform-admin'

// 主应用下发的用户信息内层结构
export interface WujieInnerUser {
  full_Name?: string
  w3Account?: string
  avator?: string       // 注意：主应用字段名拼写为 avator（非 avatar）
  role?: string         // 主应用下发的角色
  permissions?: string[] // 主应用下发的权限列表
  [key: string]: unknown
}

// wujie 主应用注入的顶层结构：{ userInfo: WujieInnerUser }
export interface WujieUserInfo {
  userInfo?: WujieInnerUser
  [key: string]: unknown
}

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref<string | null>(localStorage.getItem('admin_accessToken'))
  const refreshToken = ref<string | null>(localStorage.getItem('admin_refreshToken'))
  const user = ref<User | null>(
    localStorage.getItem('admin_user') ? JSON.parse(localStorage.getItem('admin_user')!) : null,
  )

  // wujie 微前端注入的原始用户信息（主应用下发的 SSO 用户信息）
  const wujieUser = ref<WujieUserInfo | null>(null)

  const isAuthenticated = computed(() => !!accessToken.value && !!user.value)

  const isAdmin = computed(() => {
    // 优先使用 wujie 用户角色
    if (wujieUser.value?.userInfo?.role) {
      return wujieUser.value.userInfo.role === 'admin'
    }
    return user.value?.role === UserRole.Admin
  })

  const isEditorOrAbove = computed(() => {
    if (wujieUser.value?.userInfo?.role) {
      const role = wujieUser.value.userInfo.role
      return role === 'admin' || role === 'editor'
    }
    return user.value?.role === UserRole.Editor || user.value?.role === UserRole.Admin
  })

  // 规范化后的展示用户信息，统一字段名供组件使用
  const displayUser = computed<{ name: string; avatar?: string; account?: string } | null>(() => {
    if (wujieUser.value?.userInfo) {
      const u = wujieUser.value.userInfo
      return {
        name: u.full_Name || u.w3Account || '管理员',
        avatar: u.avator,
        account: u.w3Account,
      }
    }
    if (user.value) {
      return { name: user.value.name, avatar: user.value.avatar }
    }
    return null
  })

  function hasModulePermission(module: string): boolean {
    if (!user.value) return false
    if (user.value.role === UserRole.Admin) return true
    return user.value.role === UserRole.Editor && user.value.permissions.includes(module)
  }

  /** 由 wujie bus "login" 事件触发，存储主应用下发的用户信息 */
  function setUserFromWujie(userinfo: WujieUserInfo) {
    wujieUser.value = userinfo
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
    wujieUser.value = null
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
    wujieUser,
    displayUser,
    isAuthenticated,
    isAdmin,
    isEditorOrAbove,
    hasModulePermission,
    setUserFromWujie,
    setAuth,
    clearAuth,
    redirectToSSO,
    refresh,
  }
})
