// Spec: specs/admin/dashboard.spec.md (类型定义：原 packages/shared 迁入)

export enum UserRole {
  Viewer = 'viewer',
  Editor = 'editor',
  Admin = 'admin',
}

export interface PaginationQuery {
  page?: number
  pageSize?: number
}

export interface PaginatedResult<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
}

export interface ApiResponse<T = unknown> {
  code: number
  message: string
  data: T
}

export interface Announcement {
  id: number
  title: string
  content: string
  type: 'training' | 'capability' | 'general'
  pinned: boolean
  publishedAt: string | null
  createdAt: string
  updatedAt: string
}

export interface Course {
  id: number
  title: string
  description: string
  coverUrl: string
  category: string
  chaptersCount: number
  status: 'draft' | 'published'
  publishedAt: string | null
  createdAt: string
}

export interface CourseChapter {
  id: number
  courseId: number
  title: string
  sort: number
  resourceUrl: string
  resourceType: 'video' | 'doc' | 'link'
}

export interface CapabilityItem {
  id: number
  name: string
  description: string
  type: 'skill' | 'mcp' | 'other'
  tags: string[]
  documentUrl: string
  repoUrl?: string
  status: 'active' | 'deprecated'
  createdAt: string
}

export interface Case {
  id: number
  title: string
  summary: string
  content: string
  coverUrl: string
  tags: string[]
  author: string
  status: 'draft' | 'published'
  publishedAt: string | null
  createdAt: string
}

export interface Honor {
  id: number
  recipientName: string
  recipientAvatar?: string
  honorTitle: string
  description: string
  awardedAt: string
  createdAt: string
}

export interface User {
  id: number
  employeeId: string
  name: string
  avatar?: string
  email: string
  role: UserRole
  permissions: string[]
  createdAt: string
}

export interface Lab {
  id: number
  title: string
  subtitle: string
  coverUrl: string
  duration: string
  videoUrl: string
  order: number
  isPublished: boolean
  createdAt: string
  updatedAt: string
}

export interface WikiCase {
  id: number
  title: string
  summary: string
  coverUrl: string
  tags: string[]
  readUrl: string
  order: number
  isPublished: boolean
  createdAt: string
  updatedAt: string
}

export interface ToolGuide {
  id: number
  name: string
  desc: string
  icon: string
  iconColor: string
  installUrl: string
  guideUrl: string
  order: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Banner {
  id: number
  title: string
  description?: string
  buttonText?: string
  buttonLink?: string
  imageUrl: string
  tags: string[]
  order: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

// AI 风向标
export interface AiTrend {
  id: number
  title: string
  summary: string
  icon: string
  source: string
  sourceUrl: string
  publishDate: string
  isActive: boolean
  order: number
  createdAt: string
  updatedAt: string
}

// 百工武器坊
export interface WeaponCategory {
  id: number
  name: string
  icon: string
  description: string
  order: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface WeaponItem {
  id: number
  categoryId: number
  name: string
  description: string
  icon?: string
  order: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}
