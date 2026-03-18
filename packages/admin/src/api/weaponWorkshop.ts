// Spec: specs/api/weapon-workshop.spec.md
import http from './http'
import type { WeaponCategory, WeaponItem, PaginatedResult } from '@/types'

// 分类管理
export function getWeaponCategories(
  page?: number,
  pageSize?: number
): Promise<PaginatedResult<WeaponCategory>> {
  return http.get('/admin/weapon-categories', { params: { page, pageSize } })
}

export function createWeaponCategory(data: Partial<WeaponCategory>): Promise<WeaponCategory> {
  return http.post('/admin/weapon-categories', data)
}

export function updateWeaponCategory(id: number, data: Partial<WeaponCategory>): Promise<WeaponCategory> {
  return http.put(`/admin/weapon-categories/${id}`, data)
}

export function deleteWeaponCategory(id: number): Promise<void> {
  return http.delete(`/admin/weapon-categories/${id}`)
}

export function getCategoryItems(categoryId: number): Promise<WeaponItem[]> {
  return http.get(`/admin/weapon-categories/${categoryId}/items`)
}

// 武器项管理
export function createWeaponItem(data: Partial<WeaponItem>): Promise<WeaponItem> {
  return http.post('/admin/weapon-items', data)
}

export function updateWeaponItem(id: number, data: Partial<WeaponItem>): Promise<WeaponItem> {
  return http.put(`/admin/weapon-items/${id}`, data)
}

export function deleteWeaponItem(id: number): Promise<void> {
  return http.delete(`/admin/weapon-items/${id}`)
}
