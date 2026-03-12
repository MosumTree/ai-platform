// Spec: specs/api/honors.spec.md
import http from './http'
import type { Honor, PaginatedResult } from 'shared'

interface AdminHonorQuery {
  page?: number
  pageSize?: number
}

interface CreateHonorDto {
  recipientName: string
  recipientAvatar?: string
  honorTitle: string
  description: string
  awardedAt: string
}

export function getAdminHonors(params?: AdminHonorQuery): Promise<PaginatedResult<Honor>> {
  return http.get('/admin/honors', { params })
}

export function createHonor(data: CreateHonorDto): Promise<Honor> {
  return http.post('/admin/honors', data)
}

export function updateHonor(id: number, data: Partial<CreateHonorDto>): Promise<Honor> {
  return http.put(`/admin/honors/${id}`, data)
}

export function deleteHonor(id: number): Promise<void> {
  return http.delete(`/admin/honors/${id}`)
}

export function toggleHonorVisibility(id: number): Promise<Honor> {
  return http.patch(`/admin/honors/${id}/toggle-visibility`)
}
