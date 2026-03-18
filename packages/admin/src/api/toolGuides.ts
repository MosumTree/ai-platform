// Spec: specs/api/tool-guides.spec.md
import http from './http'
import type { ToolGuide, PaginatedResult } from '@/types'

interface ToolGuideQuery {
  page?: number
  pageSize?: number
}

interface ToolGuidePayload {
  name: string
  desc: string
  icon: string
  iconColor: string
  installUrl: string
  guideUrl: string
  order?: number
  isActive?: boolean
}

export function getAdminToolGuides(params?: ToolGuideQuery): Promise<PaginatedResult<ToolGuide>> {
  return http.get('/admin/tool-guides', { params })
}

export function createToolGuide(data: ToolGuidePayload): Promise<ToolGuide> {
  return http.post('/admin/tool-guides', data)
}

export function updateToolGuide(id: number, data: Partial<ToolGuidePayload>): Promise<ToolGuide> {
  return http.put(`/admin/tool-guides/${id}`, data)
}

export function deleteToolGuide(id: number): Promise<void> {
  return http.delete(`/admin/tool-guides/${id}`)
}
