// Spec: specs/api/auth.spec.md
import type { Directive, DirectiveBinding } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { UserRole } from '@/types'

/**
 * 权限指令：v-permission="'admin'" 或 v-permission="'editor:courses'"
 * 无权限时移除元素（而非仅隐藏）
 */
export const vPermission: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding<string>) {
    const permission = binding.value
    if (!hasPermission(permission)) {
      el.parentNode?.removeChild(el)
    }
  },
}

function hasPermission(permission: string): boolean {
  const authStore = useAuthStore()
  const user = authStore.user

  if (!user) return false

  if (user.role === UserRole.Admin) return true

  if (permission === 'admin') {
    return false
  }

  if (permission.startsWith('editor:')) {
    const module = permission.split(':')[1]
    return (
      user.role === UserRole.Editor &&
      user.permissions.includes(module)
    )
  }

  return false
}
