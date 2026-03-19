// Spec: specs/api/auth.spec.md + specs/portal/home.spec.md
import { createRouter, createWebHashHistory } from 'vue-router'
// import { useAuthStore } from '@/stores/auth'
import { reportPageView } from '@/api/analytics'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/auth/callback',
      name: 'AuthCallback',
      component: () => import('@/views/AuthCallbackView.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/',
      component: () => import('@/layouts/AppLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'Home',
          component: () => import('@/views/HomeView.vue'),
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/views/NotFoundView.vue'),
      meta: { requiresAuth: false },
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

  return true
})

const VISITOR_ID_KEY = 'portal_visitor_id'

function getVisitorId(): string {
  const cached = localStorage.getItem(VISITOR_ID_KEY)
  if (cached) return cached
  const generated = `${Date.now()}_${Math.random().toString(36).slice(2, 10)}`
  localStorage.setItem(VISITOR_ID_KEY, generated)
  return generated
}

function shouldSkipAnalytics(): boolean {
  if (import.meta.env.DEV) return true
  const hostname = window.location.hostname
  return ['localhost', '127.0.0.1', '0.0.0.0', '::1'].includes(hostname)
}

router.afterEach((to) => {
  if (shouldSkipAnalytics()) return
  void reportPageView({
    path: to.fullPath || '/',
    visitorId: getVisitorId(),
    visitedAt: new Date().toISOString(),
  }).catch(() => {
    // 统计失败静默，不影响用户交互
  })
})

export default router
