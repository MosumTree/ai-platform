// Spec: specs/api/capability-market.spec.md
import http from './http'
import type { CapabilityItem, PaginatedResult } from '@/types'

interface AdminCapabilityQuery {
  page?: number
  pageSize?: number
  type?: string
  status?: string
  keyword?: string
}

interface CreateCapabilityDto {
  name: string
  description: string
  type: string
  tags: string[]
  documentUrl: string
  repoUrl?: string
}

export function getAdminCapabilities(params?: AdminCapabilityQuery): Promise<PaginatedResult<CapabilityItem>> {
  return http.get('/admin/capabilities', { params })
}

export function createCapability(data: CreateCapabilityDto): Promise<CapabilityItem> {
  return http.post('/admin/capabilities', data)
}

export function updateCapability(id: number, data: Partial<CreateCapabilityDto>): Promise<CapabilityItem> {
  return http.put(`/admin/capabilities/${id}`, data)
}

export function deleteCapability(id: number): Promise<void> {
  return http.delete(`/admin/capabilities/${id}`)
}

export function deprecateCapability(id: number): Promise<CapabilityItem> {
  return http.patch(`/admin/capabilities/${id}/deprecate`)
}

export function restoreCapability(id: number): Promise<CapabilityItem> {
  return http.patch(`/admin/capabilities/${id}/restore`)
}
