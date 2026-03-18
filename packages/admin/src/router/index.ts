// Spec: specs/api/auth.spec.md + specs/admin/dashboard.spec.md
import { createRouter, createWebHistory } from 'vue-router'
// import { useAuthStore } from '@/stores/auth'
import { UserRole } from '@/types'

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
          path: 'home-content',
          name: 'HomeContent',
          component: () => import('@/views/home-content/HomeContentView.vue'),
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
        {
          path: 'tool-guides',
          name: 'ToolGuides',
          component: () => import('@/views/tool-guides/ToolGuidesView.vue'),
          meta: { requiresAuth: true, module: 'tool-guides' },
        },
        {
          path: 'labs',
          name: 'Labs',
          component: () => import('@/views/labs/LabsView.vue'),
          meta: { requiresAuth: true, module: 'labs' },
        },
        {
          path: 'wiki-cases',
          name: 'WikiCases',
          component: () => import('@/views/wiki-cases/WikiCasesView.vue'),
          meta: { requiresAuth: true, module: 'wiki-cases' },
        },
        {
          path: 'ai-trends',
          name: 'AiTrends',
          component: () => import('@/views/ai-trends/AiTrendsView.vue'),
          meta: { requiresAuth: true, module: 'ai-trends' },
        },
        {
          path: 'weapon-workshop',
          name: 'WeaponWorkshop',
          component: () => import('@/views/weapon-workshop/WeaponWorkshopView.vue'),
          meta: { requiresAuth: true, module: 'weapon-workshop' },
        },
      ],
    },
  ],
})

router.beforeEach((_to) => {
  // TODO: SSO 认证逻辑暂时注释，登录模块设计完成后恢复
  // const authStore = useAuthStore()
  // const requiresAuth = _to.meta.requiresAuth !== false

  // if (requiresAuth && !authStore.isAuthenticated) {
  //   authStore.redirectToSSO(_to.fullPath)
  //   return false
  // }

  // if (authStore.isAuthenticated) {
  //   // Viewer 无法进入管理后台
  //   if (authStore.user?.role === UserRole.Viewer) {
  //     return { name: 'Dashboard' }
  //   }

  //   // 需要 Admin 权限的页面
  //   if (_to.meta.requiresAdmin && !authStore.isAdmin) {
  //     return { name: 'Dashboard' }
  //   }

  //   // 需要模块权限的页面
  //   if (_to.meta.module) {
  //     const module = _to.meta.module as string
  //     if (!authStore.hasModulePermission(module)) {
  //       return { name: 'Dashboard' }
  //     }
  //   }
  // }

  return true
})

export default router
