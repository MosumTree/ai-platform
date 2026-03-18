// Spec: specs/api/labs.spec.md
import http from './http'
import type { Lab, PaginatedResult } from '@/types'

interface LabQuery { page?: number; pageSize?: number }

interface LabPayload {
  title: string
  subtitle: string
  coverUrl: string
  duration: string
  videoUrl: string
  order?: number
  isPublished?: boolean
}

export function getAdminLabs(params?: LabQuery): Promise<PaginatedResult<Lab>> {
  return http.get('/admin/labs', { params })
}

export function createLab(data: LabPayload): Promise<Lab> {
  return http.post('/admin/labs', data)
}

export function updateLab(id: number, data: Partial<LabPayload>): Promise<Lab> {
  return http.put(`/admin/labs/${id}`, data)
}

export function deleteLab(id: number): Promise<void> {
  return http.delete(`/admin/labs/${id}`)
}
