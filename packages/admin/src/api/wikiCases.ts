// Spec: specs/api/wiki-cases.spec.md
import http from './http'
import type { WikiCase, PaginatedResult } from 'shared'

interface WikiCaseQuery { page?: number; pageSize?: number }

interface WikiCasePayload {
  title: string
  summary: string
  coverUrl: string
  readUrl: string
  tags?: string[]
  order?: number
  isPublished?: boolean
}

export function getAdminWikiCases(params?: WikiCaseQuery): Promise<PaginatedResult<WikiCase>> {
  return http.get('/admin/wiki-cases', { params })
}

export function createWikiCase(data: WikiCasePayload): Promise<WikiCase> {
  return http.post('/admin/wiki-cases', data)
}

export function updateWikiCase(id: number, data: Partial<WikiCasePayload>): Promise<WikiCase> {
  return http.put(`/admin/wiki-cases/${id}`, data)
}

export function deleteWikiCase(id: number): Promise<void> {
  return http.delete(`/admin/wiki-cases/${id}`)
}
