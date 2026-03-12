<!-- Spec: specs/portal/home.spec.md + specs/api/banners.spec.md -->
<template>
  <!-- Banner 轮播 -->
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
    <BannerCarousel />
  </div>

  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

    <!-- 工具指导楼层 -->
    <ToolGuide />

    <!-- 实战实验室楼层 -->
    <LabSection />

    <!-- 案例百科楼层 -->
    <WikiCaseSection />

  </div>
</template>

<script setup lang="ts">
// Spec: specs/portal/home.spec.md + specs/api/banners.spec.md
import BannerCarousel from '@/components/BannerCarousel.vue'
import ToolGuide from '@/components/ToolGuide.vue'
import LabSection from '@/components/LabSection.vue'
import WikiCaseSection from '@/components/WikiCaseSection.vue'
</script>
