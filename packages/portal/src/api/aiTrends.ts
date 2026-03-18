// Spec: specs/api/ai-trends.spec.md
import http from './http'
import type { AiTrend, PaginatedResult } from '@/types'

export function getAiTrends(limit?: number): Promise<AiTrend[]> {
  return http.get('/ai-trends', { params: { limit } })
}
