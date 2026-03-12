<!-- Spec: specs/portal/home.spec.md -->
<template>
  <AppLayout>
    <div class="min-h-96 flex flex-col items-center justify-center text-center">
      <div class="text-8xl font-bold text-gray-200 mb-4">404</div>
      <h1 class="text-2xl font-semibold text-gray-700 mb-2">页面不存在</h1>
      <p class="text-gray-500 mb-8">您访问的页面不存在或已被删除</p>
      <RouterLink to="/" class="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors">
        返回首页
      </RouterLink>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue'
</script>
