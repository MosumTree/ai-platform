// Spec: specs/api/weapon-workshop.spec.md
import http from './http'
import type { WeaponCategory } from '@/types'

interface WeaponWorkshopResponse {
  categories: WeaponCategory[]
}

export function getWeaponWorkshop(
  categoryLimit?: number,
  itemLimit?: number
): Promise<WeaponWorkshopResponse> {
  return http.get('/weapon-workshop', {
    params: { categoryLimit, itemLimit },
  })
}
