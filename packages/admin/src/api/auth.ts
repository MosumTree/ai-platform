// Spec: specs/api/auth.spec.md
import http from './http'
import type { User } from '@/types'

interface TokenResponse {
  accessToken: string
  refreshToken: string
  user: User
}

interface RefreshResponse {
  accessToken: string
  refreshToken: string
}

export function ssoCallback(code: string): Promise<TokenResponse> {
  return http.get(`/auth/callback?code=${code}`)
}

export function refreshAccessToken(refreshToken: string): Promise<RefreshResponse> {
  return http.post('/auth/refresh', { refreshToken })
}

export function getMe(): Promise<User> {
  return http.get('/auth/me')
}

export function logout(): Promise<void> {
  return http.post('/auth/logout')
}
