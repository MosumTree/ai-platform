// Spec: specs/api/announcements.spec.md
import http from './http'
import type { Announcement, PaginatedResult } from 'shared'

interface AdminAnnouncementQuery {
  page?: number
  pageSize?: number
  status?: string
  type?: string
}

interface CreateAnnouncementDto {
  title: string
  content: string
  type: string
  pinned?: boolean
  publishedAt?: string | null
}

export function getAdminAnnouncements(params?: AdminAnnouncementQuery): Promise<PaginatedResult<Announcement>> {
  return http.get('/admin/announcements', { params })
}

export function createAnnouncement(data: CreateAnnouncementDto): Promise<Announcement> {
  return http.post('/admin/announcements', data)
}

export function updateAnnouncement(id: number, data: Partial<CreateAnnouncementDto>): Promise<Announcement> {
  return http.put(`/admin/announcements/${id}`, data)
}

export function deleteAnnouncement(id: number): Promise<void> {
  return http.delete(`/admin/announcements/${id}`)
}
