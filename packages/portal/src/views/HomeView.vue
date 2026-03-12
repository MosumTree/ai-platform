<!-- Spec: specs/portal/home.spec.md + specs/api/banners.spec.md -->
<template>
  <!-- Banner 轮播（全宽，在导航栏下方顶部展示） -->
  <BannerCarousel />

  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

    <!-- TODO: 实现「最新公告」区块 - GET /api/announcements?page=1&pageSize=3 -->
    <section class="mb-12">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold text-gray-900">最新公告</h2>
        <a href="#" class="text-primary-600 text-sm hover:underline">查看全部</a>
      </div>
      <div class="text-gray-400 text-center py-12 bg-white rounded-xl">公告区块占位</div>
    </section>

    <!-- TODO: 实现「精选课程」区块 - GET /api/courses?page=1&pageSize=6 -->
    <section class="mb-12">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold text-gray-900">精选课程</h2>
        <a href="#" class="text-primary-600 text-sm hover:underline">查看全部</a>
      </div>
      <div class="text-gray-400 text-center py-12 bg-white rounded-xl">课程区块占位</div>
    </section>

    <!-- TODO: 实现「能力市场亮点」区块 - GET /api/capabilities?page=1&pageSize=4 -->
    <section class="mb-12">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold text-gray-900">能力市场</h2>
        <a href="#" class="text-primary-600 text-sm hover:underline">查看全部</a>
      </div>
      <div class="text-gray-400 text-center py-12 bg-white rounded-xl">能力市场区块占位</div>
    </section>

    <!-- TODO: 实现「优秀案例集锦」区块 - GET /api/cases?page=1&pageSize=3 -->
    <section class="mb-12">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold text-gray-900">优秀案例</h2>
        <a href="#" class="text-primary-600 text-sm hover:underline">查看全部</a>
      </div>
      <div class="text-gray-400 text-center py-12 bg-white rounded-xl">案例区块占位</div>
    </section>

    <!-- TODO: 实现「荣誉墙入口」区块 - GET /api/honors?page=1&pageSize=3 -->
    <section class="mb-12">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold text-gray-900">荣誉墙</h2>
        <a href="#" class="text-primary-600 text-sm hover:underline">查看全部</a>
      </div>
      <div class="text-gray-400 text-center py-12 bg-white rounded-xl">荣誉墙区块占位</div>
    </section>

  </div>
</template>

<script setup lang="ts">
// Spec: specs/portal/home.spec.md + specs/api/banners.spec.md
import BannerCarousel from '@/components/BannerCarousel.vue'
</script>
