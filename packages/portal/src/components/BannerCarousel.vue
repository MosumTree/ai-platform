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
import type { Banner } from '@/types'
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
/* ── 骨架屏 ─────────────────────────────────── */
.banner-skeleton {
  width: 100%;
  height: 360px;
  border-radius: 1rem;
  overflow: hidden;
}

.skeleton-inner {
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, #2c3e50 25%, #3a4f65 50%, #2c3e50 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0%   { background-position: -200% 0; }
  100% { background-position:  200% 0; }
}

/* ── 轮播容器 ────────────────────────────────── */
.banner-carousel {
  position: relative;
  width: 100%;
  height: 360px;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.25);
}

/* ── 幻灯片 ──────────────────────────────────── */
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
  transition: opacity 0.7s ease-in-out;
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

/* 深色底色 + 左侧径向蓝光 + 右侧图片混合 */
.slide-overlay {
  position: absolute;
  inset: 0;
  opacity: 0.6;
  mix-blend-mode: overlay;
  background-image:
    radial-gradient(circle at 20% 50%, #256af4 0%, transparent 55%),
    linear-gradient(to right, rgba(44,62,80,0.85) 0%, rgba(44,62,80,0.2) 60%, transparent 100%);
}

/* 内容：左对齐，垂直居中 */
.slide-content {
  position: relative;
  z-index: 2;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: 0 3rem;
  max-width: 680px;
  color: #ffffff;
}

/* 标签行 */
.slide-tags {
  display: flex;
  gap: 8px;
  margin-bottom: 14px;
  flex-wrap: wrap;
}

.slide-tag {
  background: rgba(37, 106, 244, 0.25);
  border: 1px solid rgba(37, 106, 244, 0.4);
  padding: 3px 12px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #ffffff;
  backdrop-filter: blur(4px);
}

/* 大标题 */
.slide-title {
  font-size: clamp(1.75rem, 3.5vw, 2.75rem);
  font-weight: 700;
  line-height: 1.15;
  margin-bottom: 12px;
  letter-spacing: -0.02em;
  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.4);
}

/* 副标题 */
.slide-desc {
  font-size: clamp(0.9rem, 1.4vw, 1.1rem);
  color: rgba(226, 232, 240, 0.9);
  margin-bottom: 28px;
  max-width: 520px;
  line-height: 1.6;
  font-weight: 300;
}

/* CTA 按钮 */
.slide-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #256af4;
  color: #ffffff;
  padding: 10px 28px;
  border-radius: 0.5rem;
  font-weight: 700;
  font-size: 0.95rem;
  text-decoration: none;
  box-shadow: 0 6px 20px rgba(37, 106, 244, 0.35);
  transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
}

.slide-btn:hover {
  background: #1a57d6;
  transform: translateY(-1px);
  box-shadow: 0 8px 24px rgba(37, 106, 244, 0.45);
}

/* ── 圆点指示器 ──────────────────────────────── */
.indicators {
  position: absolute;
  bottom: 20px;
  left: 3rem;
  display: flex;
  gap: 6px;
  z-index: 10;
}

.indicator {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.4);
  cursor: pointer;
  padding: 0;
  transition: background 0.3s, width 0.3s, border-radius 0.3s;
}

.indicator.active {
  background: #ffffff;
  width: 20px;
  border-radius: 3px;
}

/* ── 静态回退 ────────────────────────────────── */
.banner-fallback {
  width: 100%;
  height: 360px;
  border-radius: 1rem;
  background-color: #2c3e50;
  background-image: radial-gradient(circle at 20% 50%, #256af4 0%, transparent 55%);
  display: flex;
  align-items: center;
  padding: 0 3rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.fallback-content {
  max-width: 560px;
}

.fallback-title {
  font-size: clamp(1.75rem, 3.5vw, 2.75rem);
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 12px;
  letter-spacing: -0.02em;
}

.fallback-desc {
  font-size: 1.1rem;
  color: rgba(226, 232, 240, 0.85);
  margin-bottom: 28px;
  font-weight: 300;
}

.fallback-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #256af4;
  color: #ffffff;
  padding: 10px 28px;
  border-radius: 0.5rem;
  font-weight: 700;
  text-decoration: none;
  box-shadow: 0 6px 20px rgba(37, 106, 244, 0.35);
  transition: background 0.2s, transform 0.2s;
}

.fallback-btn:hover {
  background: #1a57d6;
  transform: translateY(-1px);
}
</style>
