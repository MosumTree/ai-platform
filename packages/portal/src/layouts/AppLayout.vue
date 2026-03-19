<!-- Spec: specs/portal/home.spec.md -->
<template>
  <div class="min-h-screen flex flex-col app-bg">

    <!-- 顶部导航 -->
    <header class="nav-bar sticky top-0 z-50">
      <div class="max-w-7xl mx-auto h-full px-6 flex items-center justify-between gap-8">

        <!-- Logo -->
        <RouterLink to="/" class="logo-wrap shrink-0">
          <div class="logo-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
            </svg>
          </div>
          <span class="logo-text">AI 百工集合</span>
        </RouterLink>

        <!-- 主导航 -->
        <nav class="main-nav">
          <RouterLink to="/" class="nav-item" active-class="nav-item--active" exact>
            主页
          </RouterLink>
          <a href="#" class="nav-item">风向标</a>
          <a href="#" class="nav-item">实战实验室</a>
          <a href="#" class="nav-item">案例百科</a>
          <a href="#" class="nav-item">武器坊</a>
          <a href="#" class="nav-item">共创广场</a>
        </nav>

        <!-- 右侧操作区 -->
        <div class="nav-right">

          <!-- 用户信息 -->
          <div class="user-info">
            <!-- 已登录：显示姓名 + 头像 -->
            <template v-if="authStore.displayUser">
              <div class="user-text">
                <p class="user-name">{{ authStore.displayUser.name || '用户' }}</p>
                <p class="user-level">Lv.1 围观者</p>
              </div>
              <!-- 有头像 URL 时显示图片，否则显示首字母 -->
              <img
                v-if="authStore.displayUser.avatar"
                :src="authStore.displayUser.avatar"
                :alt="authStore.displayUser.name || '用户头像'"
                class="user-avatar user-avatar--img"
              />
              <div v-else class="user-avatar">
                {{ (authStore.displayUser.name || '?').charAt(0).toUpperCase() }}
              </div>
            </template>

            <!-- 未登录：占位头像 -->
            <template v-else>
              <div class="user-text">
                <p class="user-name user-name--placeholder">未登录</p>
                <p class="user-level">--</p>
              </div>
              <div class="user-avatar user-avatar--placeholder">?</div>
            </template>
          </div>
        </div>

      </div>
    </header>

    <!-- 主体内容 -->
    <main class="flex-1">
      <RouterView />
    </main>

    <!-- 页脚 -->
    <footer class="nav-footer">
      <div class="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between gap-8">
        <!-- 品牌 -->
        <div>
          <div class="footer-brand">
            <div class="logo-icon logo-icon--sm">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
              </svg>
            </div>
            <span class="footer-brand-name">AI 百工集合</span>
          </div>
          <p class="footer-slogan">专业的 AI 赋能平台，助力每一位创造者在 AI 时代实现技能进化。</p>
          <div class="footer-stats">
            <div class="footer-stat-item">
              <span class="footer-stat-label">总访问量(PV)</span>
              <span class="footer-stat-value">{{ analyticsSummary?.totals.pageViews ?? '--' }}</span>
            </div>
            <div class="footer-stat-item">
              <span class="footer-stat-label">总访客数(UV)</span>
              <span class="footer-stat-value">{{ analyticsSummary?.totals.visitors ?? '--' }}</span>
            </div>
          </div>
        </div>

        <!-- 链接组 -->
        <div class="footer-links">
          <div>
            <h6 class="footer-link-title">资源</h6>
            <ul class="footer-link-list">
              <li><a href="#">案例百科</a></li>
              <li><a href="#">工具指导</a></li>
              <li><a href="#">实战实验室</a></li>
            </ul>
          </div>
          <div>
            <h6 class="footer-link-title">关于</h6>
            <ul class="footer-link-list">
              <li><a href="#">平台介绍</a></li>
              <li><a href="#">共创规则</a></li>
              <li><a href="#">隐私协议</a></li>
            </ul>
          </div>
        </div>
      </div>

      <div class="footer-copy">
        © {{ new Date().getFullYear() }} AI 百工集合 · Empowering Creators with Intelligence.
      </div>
    </footer>

  </div>
</template>

<script setup lang="ts">
// Spec: specs/portal/home.spec.md
import { onMounted, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { getAnalyticsSummary, type AnalyticsSummary } from '@/api/analytics'

const authStore = useAuthStore()
const analyticsSummary = ref<AnalyticsSummary | null>(null)

onMounted(async () => {
  try {
    analyticsSummary.value = await getAnalyticsSummary()
  } catch {
    // 失败静默，页脚显示占位
  }
})
</script>

<style scoped>
/* ── 页面背景 ─────────────────────────────────── */
.app-bg {
  background-color: #F7FBFD;
  color: #2C3E50;
}

/* ── 导航栏 ──────────────────────────────────── */
.nav-bar {
  height: 4.5rem;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid #D5DEE5;
}

/* Logo */
.logo-wrap {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  text-decoration: none;
}

.logo-icon {
  width: 2rem;
  height: 2rem;
  background: #256af4;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  flex-shrink: 0;
}

.logo-icon--sm {
  width: 1.6rem;
  height: 1.6rem;
  border-radius: 0.375rem;
}

.logo-text {
  font-size: 1.05rem;
  font-weight: 700;
  color: #2C3E50;
  white-space: nowrap;
}

/* 主导航 */
.main-nav {
  display: none;
  align-items: center;
  gap: 0.25rem;
}

@media (min-width: 1024px) {
  .main-nav { display: flex; }
}

.nav-item {
  padding: 0.4rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #5D6D7E;
  text-decoration: none;
  transition: color 0.15s, background-color 0.15s;
  white-space: nowrap;
}

.nav-item:hover {
  color: #256af4;
  background-color: rgba(37, 106, 244, 0.06);
}

.nav-item--active {
  color: #256af4;
}

/* 右侧 */
.nav-right {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-shrink: 0;
}

/* 用户信息 */
.user-info {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  cursor: pointer;
}

.user-text {
  display: none;
  text-align: right;
}

@media (min-width: 640px) {
  .user-text { display: block; }
}

.user-name {
  font-size: 0.75rem;
  font-weight: 700;
  color: #2C3E50;
  margin: 0;
  line-height: 1.3;
}

.user-level {
  font-size: 0.65rem;
  color: #5D6D7E;
  margin: 0;
  line-height: 1.3;
}

.user-avatar {
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 50%;
  background: #E8EDF0;
  border: 1px solid #D5DEE5;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 700;
  color: #2C3E50;
  flex-shrink: 0;
}

.user-avatar--img {
  object-fit: cover;
  background: transparent;
}

.user-avatar--placeholder {
  opacity: 0.45;
}

.user-name--placeholder {
  opacity: 0.5;
}

/* ── 页脚 ────────────────────────────────────── */
.nav-footer {
  background: #ffffff;
  border-top: 1px solid #D5DEE5;
  padding: 3rem 0 0;
  margin-top: 4rem;
}

.footer-brand {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 0.75rem;
}

.footer-brand-name {
  font-size: 0.95rem;
  font-weight: 700;
  color: #2C3E50;
}

.footer-slogan {
  font-size: 0.85rem;
  color: #5D6D7E;
  max-width: 280px;
  line-height: 1.6;
  margin: 0;
}

.footer-stats {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.footer-stat-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.footer-stat-label {
  font-size: 0.78rem;
  color: #5D6D7E;
}

.footer-stat-value {
  font-size: 0.9rem;
  font-weight: 700;
  color: #2C3E50;
}

.footer-links {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 3rem;
}

.footer-link-title {
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #2C3E50;
  margin-bottom: 1rem;
}

.footer-link-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.footer-link-list a {
  font-size: 0.875rem;
  color: #5D6D7E;
  text-decoration: none;
  transition: color 0.15s;
}

.footer-link-list a:hover {
  color: #256af4;
}

.footer-copy {
  margin-top: 3rem;
  padding: 1.5rem 1.5rem;
  border-top: 1px solid #F0F4F7;
  text-align: center;
  font-size: 0.75rem;
  color: #5D6D7E;
  font-weight: 500;
}
</style>
