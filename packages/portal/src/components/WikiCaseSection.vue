<!-- Spec: specs/portal/home.spec.md -->
<template>
  <section v-if="cases.length > 0 || loading" class="wiki-section">
    <!-- 楼层标题 -->
    <div class="section-header">
      <h2 class="section-title">
        <span class="title-icon">📖</span>
        案例百科
        <span class="title-sub">Wiki</span>
      </h2>
      <a href="/cases" class="more-link">浏览全部百科 →</a>
    </div>

    <!-- 骨架屏 -->
    <div v-if="loading" class="wiki-grid">
      <div v-for="n in 3" :key="n" class="wiki-card">
        <div class="skeleton skeleton-cover" />
        <div class="card-body">
          <div class="skeleton skeleton-title" />
          <div class="skeleton skeleton-summary" />
          <div class="tag-row">
            <div class="skeleton skeleton-tag" />
            <div class="skeleton skeleton-tag" />
          </div>
        </div>
      </div>
    </div>

    <!-- 3 列图文卡片 -->
    <div v-else class="wiki-grid">
      <a
        v-for="item in cases"
        :key="item.id"
        :href="item.readUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="wiki-card"
      >
        <!-- 封面区 -->
        <div class="cover-wrap">
          <img :src="item.coverUrl" :alt="item.title" class="cover-img" />
          <!-- Hover 遮罩 -->
          <div class="cover-overlay">
            <span class="read-badge">阅读百科词条</span>
          </div>
        </div>

        <!-- 内容区 -->
        <div class="card-body">
          <h3 class="card-title">{{ item.title }}</h3>
          <p class="card-summary">{{ item.summary }}</p>
          <div v-if="item.tags && item.tags.length" class="tag-row">
            <span v-for="tag in item.tags" :key="tag" class="tag">{{ tag }}</span>
          </div>
        </div>
      </a>
    </div>
  </section>
</template>

<script setup lang="ts">
// Spec: specs/portal/home.spec.md
import { ref, onMounted } from 'vue'
import type { WikiCase } from 'shared'
import { getWikiCases } from '@/api/wikiCases'

const loading = ref(true)
const cases = ref<WikiCase[]>([])

onMounted(async () => {
  try {
    const res = await getWikiCases(3)
    cases.value = res.list
  } catch {
    // 静默失败
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.wiki-section {
  margin-bottom: 3rem;
}

/* 楼层标题行 */
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
.more-link:hover { opacity: 0.75; }

/* 3 列网格 */
.wiki-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

@media (max-width: 768px) {
  .wiki-grid { grid-template-columns: 1fr; }
}

/* 卡片 */
.wiki-card {
  border-radius: 0.75rem;
  overflow: hidden;
  border: 1px solid #e2e8f0;
  background: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-direction: column;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.wiki-card:hover {
  border-color: rgba(37, 99, 235, 0.4);
  box-shadow: 0 8px 24px -4px rgba(0, 0, 0, 0.1);
}

/* 封面固定高度 */
.cover-wrap {
  position: relative;
  height: 11rem;
  overflow: hidden;
  background: #e2e8f0;
}

.cover-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.wiki-card:hover .cover-img {
  transform: scale(1.04);
}

/* hover 遮罩 */
.cover-overlay {
  position: absolute;
  inset: 0;
  background: rgba(30, 41, 59, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s;
  backdrop-filter: blur(2px);
}

.wiki-card:hover .cover-overlay {
  opacity: 1;
}

.read-badge {
  background: #fff;
  color: #1e293b;
  font-size: 0.8rem;
  font-weight: 700;
  padding: 0.4rem 1rem;
  border-radius: 999px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

/* 内容区 */
.card-body {
  padding: 1.25rem;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.card-title {
  font-size: 0.95rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 0.5rem;
}

.card-summary {
  font-size: 0.85rem;
  color: #64748b;
  line-height: 1.55;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin: 0 0 1rem;
}

.tag-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
}

.tag {
  font-size: 0.7rem;
  font-weight: 500;
  color: #64748b;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  padding: 0.15rem 0.5rem;
  border-radius: 0.25rem;
}

/* 骨架屏 */
.skeleton {
  background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
  border-radius: 0.375rem;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.skeleton-cover {
  height: 11rem;
  width: 100%;
  border-radius: 0;
}

.skeleton-title {
  width: 75%;
  height: 0.9rem;
  margin-bottom: 0.5rem;
}

.skeleton-summary {
  width: 100%;
  height: 2rem;
  margin-bottom: 0.75rem;
}

.skeleton-tag {
  width: 3.5rem;
  height: 1.25rem;
}
</style>
