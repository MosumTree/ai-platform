// Spec: specs/api/honors.spec.md
import http from './http'
import type { Honor, PaginatedResult } from 'shared'

interface HonorQuery {
  page?: number
  pageSize?: number
}

export function getHonors(params?: HonorQuery): Promise<PaginatedResult<Honor>> {
  return http.get('/honors', { params })
}
