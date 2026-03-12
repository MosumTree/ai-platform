<!-- Spec: specs/api/banners.spec.md -->
<template>
  <!-- 加载中骨架 -->
  <div v-if="loading" class="banner-skeleton" aria-hidden="true">
    <div class="skeleton-inner animate-pulse" />
  </div>

  <!-- 有数据时：轮播 -->
  <div
    v-else-if="banners.length > 0"
    class="banner-carousel"
    @mouseenter="pauseAutoPlay"
    @mouseleave="resumeAutoPlay"
  >
    <!-- 幻灯片区域 -->
    <div class="slides-wrapper">
      <div
        v-for="(banner, index) in banners"
        :key="banner.id"
        class="slide"
        :class="{ active: index === current, prev: index === prevIndex }"
        :style="{ backgroundImage: `url(${banner.imageUrl})` }"
        role="img"
        :aria-label="banner.title"
      >
        <div class="slide-overlay" />
        <div class="slide-content">
          <div v-if="banner.tags && banner.tags.length" class="slide-tags">
            <span v-for="tag in banner.tags" :key="tag" class="slide-tag">{{ tag }}</span>
          </div>
          <h1 class="slide-title">{{ banner.title }}</h1>
          <p v-if="banner.description" class="slide-desc">{{ banner.description }}</p>
          <a
            v-if="banner.buttonText && banner.buttonLink"
            :href="banner.buttonLink"
            class="slide-btn"
          >
            {{ banner.buttonText }}
          </a>
        </div>
      </div>
    </div>

    <!-- 圆点指示器（多于 1 条时显示） -->
    <div v-if="banners.length > 1" class="indicators" role="tablist">
      <button
        v-for="(_, index) in banners"
        :key="index"
        class="indicator"
        :class="{ active: index === current }"
        :aria-label="`切换到第 ${index + 1} 张`"
        role="tab"
        :aria-selected="index === current"
        @click="goTo(index)"
      />
    </div>
  </div>

  <!-- 空状态/加载失败：静态 Hero 回退 -->
  <div v-else class="banner-fallback">
    <div class="fallback-content">
      <h1 class="fallback-title">AI 辅助研发学习平台</h1>
      <p class="fallback-desc">探索 AI 赋能研发的无限可能</p>
      <RouterLink to="/" class="fallback-btn">开始探索</RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
// Spec: specs/api/banners.spec.md
import { ref, onMounted, onUnmounted } from 'vue'
import type { Banner } from 'shared'
import { getBanners } from '@/api/banners'

const INTERVAL_MS = 5000

const loading = ref(true)
const banners = ref<Banner[]>([])
const current = ref(0)
const prevIndex = ref(-1)
let timer: ReturnType<typeof setInterval> | null = null

async function fetchBanners() {
  try {
    const result = await getBanners()
    console.log('[BannerCarousel] API result:', result)
    banners.value = result
  } catch (err) {
    console.error('[BannerCarousel] API error:', err)
    banners.value = []
  } finally {
    loading.value = false
    if (banners.value.length > 1) startAutoPlay()
  }
}

function goTo(index: number) {
  prevIndex.value = current.value
  current.value = index
}

function next() {
  goTo((current.value + 1) % banners.value.length)
}

function startAutoPlay() {
  if (timer) return
  timer = setInterval(next, INTERVAL_MS)
}

function pauseAutoPlay() {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

function resumeAutoPlay() {
  if (banners.value.length > 1) startAutoPlay()
}

onMounted(fetchBanners)
onUnmounted(pauseAutoPlay)
</script>

<style scoped>
/* 骨架屏 */
.banner-skeleton {
  width: 100%;
  height: 480px;
}

.skeleton-inner {
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

/* 轮播容器 */
.banner-carousel {
  position: relative;
  width: 100%;
  height: 480px;
  overflow: hidden;
}

/* 幻灯片 */
.slides-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}

.slide {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  opacity: 0;
  transition: opacity 0.6s ease-in-out;
  pointer-events: none;
}

.slide.active {
  opacity: 1;
  pointer-events: auto;
  z-index: 1;
}

.slide.prev {
  opacity: 0;
  z-index: 0;
}

.slide-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.55) 100%);
}

.slide-content {
  position: relative;
  z-index: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 0 24px;
  color: #ffffff;
}

.slide-tags {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  flex-wrap: wrap;
  justify-content: center;
}

.slide-tag {
  background: rgba(255,255,255,0.2);
  border: 1px solid rgba(255,255,255,0.4);
  padding: 2px 12px;
  border-radius: 999px;
  font-size: 12px;
  backdrop-filter: blur(4px);
}

.slide-title {
  font-size: clamp(1.75rem, 4vw, 3rem);
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 12px;
  text-shadow: 0 2px 8px rgba(0,0,0,0.3);
}

.slide-desc {
  font-size: clamp(0.95rem, 1.5vw, 1.2rem);
  opacity: 0.9;
  margin-bottom: 28px;
  max-width: 640px;
  text-shadow: 0 1px 4px rgba(0,0,0,0.3);
}

.slide-btn {
  display: inline-block;
  background: #ffffff;
  color: #1d4ed8;
  padding: 12px 32px;
  border-radius: 9999px;
  font-weight: 600;
  font-size: 1rem;
  text-decoration: none;
  transition: background 0.2s, transform 0.2s;
}

.slide-btn:hover {
  background: #eff6ff;
  transform: translateY(-1px);
}

/* 指示器 */
.indicators {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  z-index: 10;
}

.indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: none;
  background: rgba(255,255,255,0.5);
  cursor: pointer;
  transition: background 0.3s, transform 0.3s;
  padding: 0;
}

.indicator.active {
  background: #ffffff;
  transform: scale(1.3);
}

/* 静态回退 */
.banner-fallback {
  width: 100%;
  height: 480px;
  background: linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #ffffff;
}

.fallback-content {
  padding: 24px;
}

.fallback-title {
  font-size: clamp(1.75rem, 4vw, 3rem);
  font-weight: 700;
  margin-bottom: 12px;
}

.fallback-desc {
  font-size: 1.2rem;
  opacity: 0.9;
  margin-bottom: 28px;
}

.fallback-btn {
  display: inline-block;
  background: #ffffff;
  color: #1d4ed8;
  padding: 12px 32px;
  border-radius: 9999px;
  font-weight: 600;
  text-decoration: none;
  transition: background 0.2s;
}

.fallback-btn:hover {
  background: #eff6ff;
}
</style>
