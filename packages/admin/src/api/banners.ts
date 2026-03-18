// Spec: specs/api/banners.spec.md
import http from './http'
import type { Banner, PaginatedResult } from '@/types'

interface AdminBannerQuery {
  page?: number
  pageSize?: number
}

interface BannerPayload {
  title: string
  imageUrl: string
  description?: string
  buttonText?: string
  buttonLink?: string
  tags?: string[]
  order?: number
  isActive?: boolean
}

export function getAdminBanners(params?: AdminBannerQuery): Promise<PaginatedResult<Banner>> {
  return http.get('/admin/banners', { params })
}

export function createBanner(data: BannerPayload): Promise<Banner> {
  return http.post('/admin/banners', data)
}

export function updateBanner(id: number, data: Partial<BannerPayload>): Promise<Banner> {
  return http.put(`/admin/banners/${id}`, data)
}

export function deleteBanner(id: number): Promise<void> {
  return http.delete(`/admin/banners/${id}`)
}
