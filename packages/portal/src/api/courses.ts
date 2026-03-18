// Spec: specs/api/courses.spec.md
import http from './http'
import type { Course, CourseChapter, PaginatedResult } from '@/types'

interface CourseQuery {
  page?: number
  pageSize?: number
  category?: string
  keyword?: string
}

interface CourseDetail extends Course {
  chapters: CourseChapter[]
}

export function getCourseCategories(): Promise<string[]> {
  return http.get('/courses/categories')
}

export function getCourses(params?: CourseQuery): Promise<PaginatedResult<Course>> {
  return http.get('/courses', { params })
}

export function getCourseById(id: number): Promise<CourseDetail> {
  return http.get(`/courses/${id}`)
}
