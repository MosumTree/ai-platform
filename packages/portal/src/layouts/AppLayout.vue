<!-- Spec: specs/portal/home.spec.md -->
<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <!-- 顶部导航 -->
    <header class="bg-white shadow-sm sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <span class="text-xl font-bold text-primary-600">AI 辅助研发平台</span>
        </div>
        <nav class="hidden md:flex items-center gap-6 text-sm text-gray-600">
          <RouterLink to="/" class="hover:text-primary-600 transition-colors">首页</RouterLink>
          <!-- TODO: 其他导航链接 -->
        </nav>
        <div class="flex items-center gap-3">
          <span v-if="authStore.user" class="text-sm text-gray-700">
            {{ authStore.user.name }}
          </span>
        </div>
      </div>
    </header>

    <!-- 主体内容 -->
    <main class="flex-1">
      <RouterView />
    </main>

    <!-- 页脚 -->
    <footer class="bg-white border-t border-gray-200 py-8 mt-16">
      <div class="max-w-7xl mx-auto px-4 text-center text-sm text-gray-400">
        © {{ new Date().getFullYear() }} AI 辅助研发平台. All rights reserved.
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
// Spec: specs/portal/home.spec.md
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
</script>
