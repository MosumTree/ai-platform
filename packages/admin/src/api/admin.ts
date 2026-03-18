// Spec: specs/admin/dashboard.spec.md + specs/admin/user-manage.spec.md
import http from './http'
import type { User, PaginatedResult, UserRole } from '@/types'

interface DashboardOverview {
  announcements: { total: number; published: number }
  courses: { total: number; published: number }
  capabilities: { total: number; active: number }
  cases: { total: number; published: number; reviewing: number }
  honors: { total: number }
}

interface RecentActivity {
  module: string
  title: string
  action: string
  operatorName: string
  createdAt: string
}

interface AdminUserQuery {
  page?: number
  pageSize?: number
  keyword?: string
  role?: string
}

export function getDashboardOverview(): Promise<DashboardOverview> {
  return http.get('/admin/dashboard/overview')
}

export function getDashboardRecent(): Promise<RecentActivity[]> {
  return http.get('/admin/dashboard/recent')
}

export function getAdminUsers(params?: AdminUserQuery): Promise<PaginatedResult<User>> {
  return http.get('/admin/users', { params })
}

export function updateUserRole(id: number, data: { role: UserRole; permissions?: string[] }): Promise<User> {
  return http.patch(`/admin/users/${id}/role`, data)
}
