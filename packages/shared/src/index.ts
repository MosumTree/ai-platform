// 用户角色枚举
export enum UserRole {
  Viewer = 'viewer',   // 普通员工，只读
  Editor = 'editor',   // 内容编辑，管理被分配模块
  Admin = 'admin',     // 超级管理员，全权限
}

// 通用分页请求参数
export interface PaginationQuery {
  page?: number
  pageSize?: number
}

// 通用分页响应结构
export interface PaginatedResult<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
}

// 通用 API 响应结构
export interface ApiResponse<T = unknown> {
  code: number
  message: string
  data: T
}

// 通知公告类型
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

// AI 课程类型
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

// 课程章节
export interface CourseChapter {
  id: number
  courseId: number
  title: string
  sort: number
  resourceUrl: string
  resourceType: 'video' | 'doc' | 'link'
}

// 能力市场条目
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

// 优秀案例
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

// 荣誉记录
export interface Honor {
  id: number
  recipientName: string
  recipientAvatar?: string
  honorTitle: string
  description: string
  awardedAt: string
  createdAt: string
}

// 用户信息
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

// Banner 轮播
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
