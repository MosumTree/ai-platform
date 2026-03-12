// Spec: specs/api/labs.spec.md
import http from './http'
import type { Lab, PaginatedResult } from 'shared'

export function getLabs(pageSize = 3): Promise<PaginatedResult<Lab>> {
  return http.get('/labs', { params: { page: 1, pageSize } })
}
