// Spec: specs/api/capability-market.spec.md
import http from './http'
import type { CapabilityItem, PaginatedResult } from 'shared'

interface CapabilityQuery {
  page?: number
  pageSize?: number
  type?: string
  tags?: string
  keyword?: string
}

export function getCapabilities(params?: CapabilityQuery): Promise<PaginatedResult<CapabilityItem>> {
  return http.get('/capabilities', { params })
}

export function getCapabilityById(id: number): Promise<CapabilityItem> {
  return http.get(`/capabilities/${id}`)
}

export function getCapabilityTags(): Promise<string[]> {
  return http.get('/capabilities/tags')
}
