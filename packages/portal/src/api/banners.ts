// Spec: specs/api/banners.spec.md
import http from './http'
import type { Banner } from 'shared'

export function getBanners(): Promise<Banner[]> {
  return http.get('/banners')
}
