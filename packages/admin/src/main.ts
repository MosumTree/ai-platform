// Spec: specs/api/auth.spec.md + specs/admin/dashboard.spec.md
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'
import { vPermission } from './directives/permission'
import './assets/main.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(ElementPlus, { locale: zhCn })
app.directive('permission', vPermission)

app.mount('#app')

// wujie 微前端集成：监听主应用下发的用户信息
import('@/stores/auth').then(({ useAuthStore }) => {
  const authStore = useAuthStore()

  if (window.$wujie) {
    // 微前端（wujie）接入：从主应用监听 login 事件获取用户信息
    window.$wujie.bus.$on('login', (...args: unknown[]) => {
      const userinfo = args[0] as Record<string, unknown>
      console.log('[admin] 子应用获取到了用户信息', userinfo)
      authStore.setUserFromWujie(userinfo)
    })
  } else {
    // 独立运行 Mock：模拟主应用下发的用户信息
    authStore.setUserFromWujie({
      userInfo: {
        full_Name: '系统管理员',
        w3Account: 'admin001',
        avator: 'https://api.dicebear.com/9.x/avataaars/svg?seed=admin001',
        role: 'admin',
      },
    })
  }
})
