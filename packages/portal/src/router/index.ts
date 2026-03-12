// Spec: specs/api/auth.spec.md + specs/portal/home.spec.md
import { createRouter, createWebHistory } from 'vue-router'
// import { useAuthStore } from '@/stores/auth'

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

export default router
