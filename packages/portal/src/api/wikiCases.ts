// Spec: specs/api/wiki-cases.spec.md
import http from './http'
import type { WikiCase, PaginatedResult } from '@/types'

export function getWikiCases(pageSize = 3): Promise<PaginatedResult<WikiCase>> {
  return http.get('/wiki-cases', { params: { page: 1, pageSize } })
}
