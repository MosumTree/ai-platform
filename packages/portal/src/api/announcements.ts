// Spec: specs/api/announcements.spec.md
import http from './http'
import type { Announcement, PaginatedResult } from 'shared'

interface AnnouncementQuery {
  page?: number
  pageSize?: number
  type?: string
}

export function getAnnouncements(params?: AnnouncementQuery): Promise<PaginatedResult<Announcement>> {
  return http.get('/announcements', { params })
}

export function getAnnouncementById(id: number): Promise<Announcement> {
  return http.get(`/announcements/${id}`)
}
