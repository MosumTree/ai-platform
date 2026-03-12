// Spec: specs/api/auth.spec.md + specs/admin/dashboard.spec.md
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { UserRole } from 'shared'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/auth/callback',
      name: 'AuthCallback',
      component: () => import('@/views/AuthCallbackView.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/',
      redirect: '/dashboard',
    },
    {
      path: '/',
      component: () => import('@/layouts/AdminLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: 'dashboard',
          name: 'Dashboard',
          component: () => import('@/views/dashboard/DashboardView.vue'),
          meta: { requiresAuth: true, minRole: UserRole.Editor },
        },
        {
          path: 'announcements',
          name: 'Announcements',
          component: () => import('@/views/announcements/AnnouncementsView.vue'),
          meta: { requiresAuth: true, module: 'announcements' },
        },
        {
          path: 'courses',
          name: 'Courses',
          component: () => import('@/views/courses/CoursesView.vue'),
          meta: { requiresAuth: true, module: 'courses' },
        },
        {
          path: 'capabilities',
          name: 'Capabilities',
          component: () => import('@/views/capabilities/CapabilitiesView.vue'),
          meta: { requiresAuth: true, module: 'capabilities' },
        },
        {
          path: 'cases',
          name: 'Cases',
          component: () => import('@/views/cases/CasesView.vue'),
          meta: { requiresAuth: true, module: 'cases' },
        },
        {
          path: 'honors',
          name: 'Honors',
          component: () => import('@/views/honors/HonorsView.vue'),
          meta: { requiresAuth: true, module: 'honors' },
        },
        {
          path: 'users',
          name: 'Users',
          component: () => import('@/views/users/UsersView.vue'),
          meta: { requiresAuth: true, requiresAdmin: true },
        },
        {
          path: 'banners',
          name: 'Banners',
          component: () => import('@/views/banners/BannersView.vue'),
          meta: { requiresAuth: true, module: 'banners' },
        },
      ],
    },
  ],
})

router.beforeEach((to) => {
  const authStore = useAuthStore()
  const requiresAuth = to.meta.requiresAuth !== false

  if (requiresAuth && !authStore.isAuthenticated) {
    authStore.redirectToSSO(to.fullPath)
    return false
  }

  if (authStore.isAuthenticated) {
    // Viewer 无法进入管理后台
    if (authStore.user?.role === UserRole.Viewer) {
      return { name: 'Dashboard' }
    }

    // 需要 Admin 权限的页面
    if (to.meta.requiresAdmin && !authStore.isAdmin) {
      return { name: 'Dashboard' }
    }

    // 需要模块权限的页面
    if (to.meta.module) {
      const module = to.meta.module as string
      if (!authStore.hasModulePermission(module)) {
        return { name: 'Dashboard' }
      }
    }
  }

  return true
})

export default router
