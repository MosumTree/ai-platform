// Spec: specs/api/cases.spec.md
import http from './http'
import type { Case, PaginatedResult } from '@/types'

interface AdminCaseQuery {
  page?: number
  pageSize?: number
  status?: string
  keyword?: string
}

interface CreateCaseDto {
  title: string
  summary: string
  content: string
  coverUrl: string
  tags: string[]
  author: string
}

export function getAdminCases(params?: AdminCaseQuery): Promise<PaginatedResult<Case>> {
  return http.get('/admin/cases', { params })
}

export function createCase(data: CreateCaseDto): Promise<Case> {
  return http.post('/admin/cases', data)
}

export function updateCase(id: number, data: Partial<CreateCaseDto>): Promise<Case> {
  return http.put(`/admin/cases/${id}`, data)
}

export function deleteCase(id: number): Promise<void> {
  return http.delete(`/admin/cases/${id}`)
}

export function submitCase(id: number): Promise<Case> {
  return http.patch(`/admin/cases/${id}/submit`)
}

export function approveCase(id: number): Promise<Case> {
  return http.patch(`/admin/cases/${id}/approve`)
}

export function rejectCase(id: number, data: { reason: string }): Promise<Case> {
  return http.patch(`/admin/cases/${id}/reject`, data)
}
