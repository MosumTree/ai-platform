<!-- Spec: specs/portal/home.spec.md + specs/api/banners.spec.md + specs/api/ai-trends.spec.md + specs/api/weapon-workshop.spec.md -->
<template>
  <!-- Banner 轮播 -->
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
    <BannerCarousel />
  </div>

  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- 工具指导楼层 -->
    <ToolGuide />

    <!-- AI 风向标 + 百工武器坊（2 列布局） -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
      <!-- AI 风向标占 2/3 -->
      <div class="lg:col-span-2">
        <AiTrendSection />
      </div>
      <!-- 百工武器坊占 1/3 -->
      <div class="lg:col-span-1">
        <WeaponWorkshopSection />
      </div>
    </div>

    <!-- 实战实验室楼层 -->
    <LabSection />

    <!-- 案例百科楼层 -->
    <WikiCaseSection />

  </div>
</template>

<script setup lang="ts">
// Spec: specs/portal/home.spec.md + specs/api/banners.spec.md + specs/api/ai-trends.spec.md + specs/api/weapon-workshop.spec.md
import BannerCarousel from '@/components/BannerCarousel.vue'
import ToolGuide from '@/components/ToolGuide.vue'
import AiTrendSection from '@/components/AiTrendSection.vue'
import WeaponWorkshopSection from '@/components/WeaponWorkshopSection.vue'
import LabSection from '@/components/LabSection.vue'
import WikiCaseSection from '@/components/WikiCaseSection.vue'
</script>
