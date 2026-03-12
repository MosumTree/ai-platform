// Spec: specs/api/cases.spec.md
import http from './http'
import type { Case, PaginatedResult } from 'shared'

interface CaseQuery {
  page?: number
  pageSize?: number
  tags?: string
  keyword?: string
}

export function getCases(params?: CaseQuery): Promise<PaginatedResult<Case>> {
  return http.get('/cases', { params })
}

export function getCaseById(id: number): Promise<Case> {
  return http.get(`/cases/${id}`)
}
