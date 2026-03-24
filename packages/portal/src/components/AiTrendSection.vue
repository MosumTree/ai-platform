<!-- Spec: specs/api/ai-trends.spec.md -->
<template>
  <section v-if="trends.length > 0 || loading" class="ai-trend-section">
    <!-- 楼层标题 -->
    <div class="section-header">
      <h2 class="section-title">
        <span class="title-icon">📡</span>
        AI 风向标
        <span class="title-sub">Trends</span>
      </h2>
      <a href="/trends" class="more-link">查看全部 →</a>
    </div>

    <!-- 加载中骨架屏 -->
    <div v-if="loading" class="trend-list">
      <div v-for="n in 3" :key="n" class="trend-card skeleton-card">
        <div class="skeleton-icon"></div>
        <div class="skeleton-content">
          <div class="skeleton-title"></div>
          <div class="skeleton-summary"></div>
          <div class="skeleton-meta"></div>
        </div>
      </div>
    </div>

    <!-- 成功展示 -->
    <div v-else class="trend-list">
      <a
        v-for="trend in trends"
        :key="trend.id"
        :href="trend.sourceUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="trend-card"
      >
        <div class="trend-icon">
          <AppIcon class="local-icon" :name="trend.icon" fallback="bolt" mode="material" />
        </div>
        <div class="trend-content">
          <h3 class="trend-title">{{ trend.title }}</h3>
          <p class="trend-summary">{{ trend.summary }}</p>
          <div class="trend-meta">
            <span class="trend-time">{{ formatTime(trend.publishDate) }}</span>
            <span class="trend-detail">详情 <span class="arrow">↗</span></span>
          </div>
        </div>
      </a>
    </div>
  </section>
</template>

<script setup lang="ts">
// Spec: specs/api/ai-trends.spec.md
import { ref, onMounted } from 'vue'
import AppIcon from '@/components/AppIcon.vue'
import type { AiTrend } from '@/types'
import { getAiTrends } from '@/api/aiTrends'

const loading = ref(true)
const trends = ref<AiTrend[]>([])

onMounted(async () => {
  try {
    const result = await getAiTrends(5)
    trends.value = result
  } catch {
    // 静默失败
  } finally {
    loading.value = false
  }
})

function formatTime(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diff = now.getTime() - date.getTime()

  // 小于 1 小时
  if (diff < 3600000) {
    const minutes = Math.floor(diff / 60000)
    return minutes < 1 ? '刚刚' : `${minutes} 分钟前`
  }
  // 小于 24 小时
  if (diff < 86400000) {
    const hours = Math.floor(diff / 3600000)
    return `${hours} 小时前`
  }
  // 小于 7 天
  if (diff < 604800000) {
    const days = Math.floor(diff / 86400000)
    return `${days} 天前`
  }
  // 超过 7 天显示日期
  return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
}
</script>

<style scoped>
.ai-trend-section {
  margin-bottom: 3rem;
}

/* 楼层标题 */
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 1rem;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.title-icon {
  font-size: 1.25rem;
}

.title-sub {
  font-size: 0.8rem;
  font-weight: 500;
  color: #64748b;
  padding: 0.15rem 0.5rem;
  border-radius: 999px;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
}

.more-link {
  font-size: 0.875rem;
  font-weight: 600;
  color: #2563eb;
  text-decoration: none;
  transition: opacity 0.2s;
}

.more-link:hover {
  opacity: 0.75;
}

/* 列表容器 */
.trend-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* 趋势卡片 */
.trend-card {
  display: flex;
  gap: 1rem;
  padding: 1.25rem;
  border-radius: 0.75rem;
  border: 1px solid #e2e8f0;
  background: #fff;
  text-decoration: none;
  transition: all 0.2s;
}

.trend-card:hover {
  border-color: #2563eb;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.1);
}

.trend-icon {
  flex-shrink: 0;
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f1f5f9;
  border-radius: 0.5rem;
  color: #2563eb;
  font-size: 1.25rem;
}

.trend-card:hover .trend-icon {
  background: #2563eb;
  color: #fff;
}

.local-icon {
  line-height: 1;
  font-size: 1.25rem;
}

.trend-content {
  flex: 1;
  min-width: 0;
}

.trend-title {
  font-size: 1rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 0.5rem;
  line-height: 1.4;
}

.trend-summary {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0 0 0.75rem;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.trend-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.75rem;
  color: #94a3b8;
}

.trend-detail {
  color: #2563eb;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.arrow {
  font-size: 0.7rem;
}

/* 骨架屏 */
.skeleton-card {
  pointer-events: none;
}

.skeleton-icon {
  width: 3rem;
  height: 3rem;
  border-radius: 0.5rem;
  background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}

.skeleton-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.skeleton-title {
  width: 70%;
  height: 1.25rem;
  border-radius: 0.25rem;
  background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}

.skeleton-summary {
  width: 100%;
  height: 2.5rem;
  border-radius: 0.25rem;
  background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}

.skeleton-meta {
  width: 30%;
  height: 0.875rem;
  border-radius: 0.25rem;
  background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

@media (max-width: 640px) {
  .trend-card {
    padding: 1rem;
  }

  .trend-icon {
    width: 2.5rem;
    height: 2.5rem;
    font-size: 1rem;
  }

  .trend-title {
    font-size: 0.9rem;
  }

  .trend-summary {
    font-size: 0.8rem;
    -webkit-line-clamp: 2;
  }
}
</style>
