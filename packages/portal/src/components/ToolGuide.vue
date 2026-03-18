<!-- Spec: specs/portal/home.spec.md -->
<template>
  <section v-if="tools.length > 0 || loading" class="tool-guide-section">
    <!-- 楼层标题 -->
    <div class="section-header">
      <h2 class="section-title">
        <span class="title-icon">🚀</span>
        工具指导
      </h2>
      <a href="/capabilities" class="more-link">更多工具 →</a>
    </div>

    <!-- 骨架屏 -->
    <div v-if="loading" class="tools-grid">
      <div v-for="n in 4" :key="n" class="tool-card skeleton-card">
        <div class="skeleton skeleton-icon" />
        <div class="skeleton skeleton-title" />
        <div class="skeleton skeleton-desc" />
        <div class="skeleton skeleton-btn" />
        <div class="skeleton skeleton-btn" />
      </div>
    </div>

    <!-- 4 列工具卡片 -->
    <div v-else class="tools-grid">
      <div
        v-for="tool in tools"
        :key="tool.id"
        class="tool-card"
      >
        <!-- 图标 -->
        <div class="tool-icon-wrap">
          <span class="tool-icon" :style="{ color: tool.iconColor }">{{ tool.icon }}</span>
        </div>

        <!-- 名称 + 描述 -->
        <h3 class="tool-name">{{ tool.name }}</h3>
        <p class="tool-desc">{{ tool.desc }}</p>

        <!-- 操作按钮 -->
        <div class="tool-actions">
          <a
            :href="tool.installUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="btn-install"
          >
            安装入口
            <span class="btn-icon">⬇</span>
          </a>
          <a
            :href="tool.guideUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="btn-guide"
          >
            用户指南
            <span class="btn-icon">?</span>
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// Spec: specs/portal/home.spec.md
import { ref, onMounted } from 'vue'
import type { ToolGuide } from '@/types'
import { getToolGuides } from '@/api/toolGuides'

const loading = ref(true)
const tools = ref<ToolGuide[]>([])

onMounted(async () => {
  try {
    tools.value = await getToolGuides()
  } catch {
    // 静默失败，楼层不渲染
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.tool-guide-section {
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
}

.title-icon {
  font-size: 1.25rem;
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

/* 四列网格 */
.tools-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}

@media (max-width: 1024px) {
  .tools-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .tools-grid {
    grid-template-columns: 1fr;
  }
}

/* 卡片 */
.tool-card {
  padding: 1.5rem;
  border-radius: 0.75rem;
  border: 1px solid #e2e8f0;
  background-color: #edf2f7;
  transition: background-color 0.2s, box-shadow 0.2s;
  display: flex;
  flex-direction: column;
}

.tool-card:hover {
  background-color: #ffffff;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 10px -5px rgba(0, 0, 0, 0.05);
}

/* 图标容器 */
.tool-icon-wrap {
  width: 3rem;
  height: 3rem;
  background: #ffffff;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  transition: background-color 0.2s;
}

.tool-card:hover .tool-icon-wrap {
  background-color: #eff6ff;
}

.tool-icon {
  font-size: 1.5rem;
  line-height: 1;
}

/* 文字 */
.tool-name {
  font-size: 1.05rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.tool-desc {
  font-size: 0.875rem;
  color: #64748b;
  line-height: 1.5;
  margin-bottom: 1.5rem;
  flex: 1;
  /* 限制 2 行 */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 按钮组 */
.tool-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.btn-install,
.btn-guide {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  text-decoration: none;
  transition: background-color 0.2s, color 0.2s;
}

.btn-install {
  background-color: rgba(37, 99, 235, 0.1);
  color: #2563eb;
}

.btn-install:hover {
  background-color: #2563eb;
  color: #ffffff;
}

.btn-guide {
  background-color: #ffffff;
  color: #64748b;
  border: 1px solid #e2e8f0;
}

.btn-guide:hover {
  background-color: #f8fafc;
}

.btn-icon {
  font-size: 0.75rem;
  opacity: 0.7;
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

.skeleton-card {
  gap: 0.75rem;
}

.skeleton-icon {
  width: 3rem;
  height: 3rem;
  border-radius: 0.75rem;
  flex-shrink: 0;
}

.skeleton-title {
  width: 60%;
  height: 1.125rem;
}

.skeleton-desc {
  width: 100%;
  height: 2.5rem;
  flex: 1;
}

.skeleton-btn {
  width: 100%;
  height: 2.25rem;
}
</style>
