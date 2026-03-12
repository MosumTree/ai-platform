<!-- Spec: specs/portal/home.spec.md -->
<template>
  <section v-if="labs.length > 0 || loading" class="lab-section">
    <!-- 楼层标题 -->
    <div class="section-header">
      <h2 class="section-title">
        <span class="title-icon">🎬</span>
        实战实验室
        <span class="title-sub">视频教学</span>
      </h2>
      <a href="/courses" class="more-link">进入实验室 →</a>
    </div>

    <!-- 骨架屏 -->
    <div v-if="loading" class="lab-grid">
      <div v-for="n in 3" :key="n" class="lab-card">
        <div class="skeleton skeleton-cover" />
        <div class="card-body">
          <div class="skeleton skeleton-title" />
          <div class="skeleton skeleton-sub" />
        </div>
      </div>
    </div>

    <!-- 3 列视频卡片 -->
    <div v-else class="lab-grid">
      <a
        v-for="lab in labs"
        :key="lab.id"
        :href="lab.videoUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="lab-card"
      >
        <!-- 封面区 -->
        <div class="cover-wrap">
          <img :src="lab.coverUrl" :alt="lab.title" class="cover-img" />
          <!-- Hover 播放遮罩 -->
          <div class="cover-overlay">
            <span class="play-icon">▶</span>
          </div>
          <!-- 时长标签 -->
          <span class="duration-badge">{{ lab.duration }}</span>
        </div>

        <!-- 内容区 -->
        <div class="card-body">
          <h3 class="card-title">{{ lab.title }}</h3>
          <p class="card-sub">{{ lab.subtitle }}</p>
        </div>
      </a>
    </div>
  </section>
</template>

<script setup lang="ts">
// Spec: specs/portal/home.spec.md
import { ref, onMounted } from 'vue'
import type { Lab } from 'shared'
import { getLabs } from '@/api/labs'

const loading = ref(true)
const labs = ref<Lab[]>([])

onMounted(async () => {
  try {
    const res = await getLabs(3)
    labs.value = res.list
  } catch {
    // 静默失败
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.lab-section {
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
.lab-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

@media (max-width: 768px) {
  .lab-grid { grid-template-columns: 1fr; }
}

/* 视频卡片 */
.lab-card {
  border-radius: 0.75rem;
  overflow: hidden;
  border: 1px solid #e2e8f0;
  background: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-direction: column;
  transition: box-shadow 0.2s, transform 0.2s;
}

.lab-card:hover {
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

/* 封面 16:9 */
.cover-wrap {
  position: relative;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background: #e2e8f0;
}

.cover-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.lab-card:hover .cover-img {
  transform: scale(1.04);
}

/* 播放遮罩 */
.cover-overlay {
  position: absolute;
  inset: 0;
  background: rgba(30, 41, 59, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s;
  backdrop-filter: blur(1px);
}

.lab-card:hover .cover-overlay {
  opacity: 1;
}

.play-icon {
  font-size: 3rem;
  color: #fff;
  filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.4));
  line-height: 1;
}

/* 时长标签 */
.duration-badge {
  position: absolute;
  bottom: 0.5rem;
  right: 0.5rem;
  background: rgba(30, 41, 59, 0.8);
  color: #fff;
  font-size: 0.7rem;
  font-weight: 600;
  padding: 0.1rem 0.4rem;
  border-radius: 0.25rem;
}

/* 内容区 */
.card-body {
  padding: 1rem;
  background: #f8fafc;
  flex: 1;
}

.card-title {
  font-size: 0.9rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 0.25rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-sub {
  font-size: 0.8rem;
  color: #64748b;
  margin: 0;
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
  aspect-ratio: 16 / 9;
  width: 100%;
  border-radius: 0;
}

.skeleton-title {
  width: 80%;
  height: 0.875rem;
  margin-bottom: 0.5rem;
}

.skeleton-sub {
  width: 60%;
  height: 0.75rem;
}
</style>
