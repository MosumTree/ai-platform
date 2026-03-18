// Spec: specs/api/courses.spec.md
import http from './http'
import type { Course, CourseChapter, PaginatedResult } from '@/types'

interface AdminCourseQuery {
  page?: number
  pageSize?: number
  status?: string
  category?: string
  keyword?: string
}

interface CreateCourseDto {
  title: string
  description: string
  coverUrl: string
  category: string
  status?: string
}

interface CreateChapterDto {
  title: string
  sort: number
  resourceUrl: string
  resourceType: string
}

export function getAdminCourses(params?: AdminCourseQuery): Promise<PaginatedResult<Course>> {
  return http.get('/admin/courses', { params })
}

export function createCourse(data: CreateCourseDto): Promise<Course> {
  return http.post('/admin/courses', data)
}

export function updateCourse(id: number, data: Partial<CreateCourseDto>): Promise<Course> {
  return http.put(`/admin/courses/${id}`, data)
}

export function deleteCourse(id: number): Promise<void> {
  return http.delete(`/admin/courses/${id}`)
}

export function addChapter(courseId: number, data: CreateChapterDto): Promise<CourseChapter> {
  return http.post(`/admin/courses/${courseId}/chapters`, data)
}

export function updateChapter(courseId: number, chapterId: number, data: Partial<CreateChapterDto>): Promise<CourseChapter> {
  return http.put(`/admin/courses/${courseId}/chapters/${chapterId}`, data)
}

export function deleteChapter(courseId: number, chapterId: number): Promise<void> {
  return http.delete(`/admin/courses/${courseId}/chapters/${chapterId}`)
}

export function reorderChapters(courseId: number, data: { ids: number[] }): Promise<void> {
  return http.put(`/admin/courses/${courseId}/chapters/reorder`, data)
}
