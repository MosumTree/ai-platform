// Spec: specs/api/auth.spec.md
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '@/types'

const SSO_LOGIN_URL = import.meta.env.VITE_SSO_LOGIN_URL as string ?? 'https://sso.example.com/oauth/authorize'
const SSO_CLIENT_ID = import.meta.env.VITE_SSO_CLIENT_ID as string ?? 'ai-platform-portal'

// 主应用下发的用户信息内层结构
export interface WujieInnerUser {
  full_Name?: string
  w3Account?: string
  avator?: string       // 注意：主应用字段名拼写为 avator（非 avatar）
  [key: string]: unknown
}

// wujie 主应用注入的顶层结构：{ userInfo: WujieInnerUser }
export interface WujieUserInfo {
  userInfo?: WujieInnerUser
  [key: string]: unknown
}

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref<string | null>(localStorage.getItem('accessToken'))
  const refreshToken = ref<string | null>(localStorage.getItem('refreshToken'))
  const user = ref<User | null>(
    localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null,
  )

  // wujie 微前端注入的原始用户信息（主应用下发的 SSO 用户信息）
  const wujieUser = ref<WujieUserInfo | null>(null)

  const isAuthenticated = computed(
    () => !!accessToken.value && !!user.value,
  )

  // 规范化后的展示用户信息，统一字段名供组件使用
  const displayUser = computed<{ name: string; avatar?: string; account?: string } | null>(() => {
    if (wujieUser.value?.userInfo) {
      const u = wujieUser.value.userInfo
      return {
        name: u.full_Name || u.w3Account || '用户',
        avatar: u.avator,
        account: u.w3Account,
      }
    }
    if (user.value) {
      return { name: user.value.name, avatar: user.value.avatar }
    }
    return null
  })

  /** 由 wujie bus "login" 事件触发，存储主应用下发的用户信息 */
  function setUserFromWujie(userinfo: WujieUserInfo) {
    wujieUser.value = userinfo
  }

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
    wujieUser.value = null
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
    wujieUser,
    displayUser,
    isAuthenticated,
    setUserFromWujie,
    setAuth,
    clearAuth,
    redirectToSSO,
    refresh,
  }
})
