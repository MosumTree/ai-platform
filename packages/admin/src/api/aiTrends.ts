// Spec: specs/api/ai-trends.spec.md
import http from './http'
import type { AiTrend, PaginatedResult } from '@/types'

export function getAdminAiTrends(
  page?: number,
  pageSize?: number,
  keyword?: string
): Promise<PaginatedResult<AiTrend>> {
  return http.get('/admin/ai-trends', { params: { page, pageSize, keyword } })
}

export function createAiTrend(data: Partial<AiTrend>): Promise<AiTrend> {
  return http.post('/admin/ai-trends', data)
}

export function updateAiTrend(id: number, data: Partial<AiTrend>): Promise<AiTrend> {
  return http.put(`/admin/ai-trends/${id}`, data)
}

export function deleteAiTrend(id: number): Promise<void> {
  return http.delete(`/admin/ai-trends/${id}`)
}
