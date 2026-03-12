<!-- Spec: specs/api/auth.spec.md -->
<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="text-center">
      <div class="text-gray-500 mb-4">正在登录，请稍候...</div>
      <div v-if="error" class="text-red-500 mt-4">{{ error }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Spec: specs/api/auth.spec.md
import { onMounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { ssoCallback } from '@/api/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const error = ref<string | null>(null)

onMounted(async () => {
  const code = route.query.code as string
  const redirect = (route.query.redirect as string) || '/'

  if (!code) {
    error.value = 'SSO 回调缺少 code 参数'
    return
  }

  try {
    const data = await ssoCallback(code)
    authStore.setAuth(data)
    await router.replace(redirect)
  } catch {
    error.value = 'SSO 登录失败，请重试'
    setTimeout(() => authStore.redirectToSSO(), 2000)
  }
})
</script>
