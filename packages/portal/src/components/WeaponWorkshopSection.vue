<!-- Spec: specs/api/weapon-workshop.spec.md -->
<template>
  <section v-if="showSection" class="weapon-workshop-section">
    <!-- 加载中骨架屏 -->
    <div v-if="loading" class="workshop-card skeleton-card">
      <div class="skeleton-header"></div>
      <div class="skeleton-items">
        <div v-for="n in 2" :key="n" class="skeleton-item"></div>
      </div>
      <div class="skeleton-btn"></div>
    </div>

    <!-- 成功展示 -->
    <div v-else-if="category" class="workshop-card">
      <!-- 分类标题栏 -->
      <div class="category-header">
        <div class="category-icon">
          <span class="material-icon">{{ category.icon || 'construction' }}</span>
        </div>
        <div class="category-info">
          <h3 class="category-name">{{ category.name }}</h3>
          <p class="category-desc">{{ category.description }}</p>
        </div>
      </div>

      <!-- 武器列表 -->
      <div class="weapon-list">
        <div
          v-for="item in displayItems"
          :key="item.id"
          class="weapon-item"
          @click="handleItemClick(item)"
        >
          <p class="weapon-name">{{ item.name }}</p>
          <p class="weapon-desc">{{ item.description }}</p>
        </div>
      </div>

      <!-- 进入按钮 -->
      <button class="enter-btn" @click="handleEnterClick">
        进入武器库
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
// Spec: specs/api/weapon-workshop.spec.md
import { ref, computed, onMounted } from 'vue'
import type { WeaponCategory, WeaponItem } from '@/types'
import { getWeaponWorkshop } from '@/api/weaponWorkshop'

const loading = ref(true)
const category = ref<WeaponCategory | null>(null)

const showSection = computed(() => {
  return loading.value || (category.value && category.value.items.length > 0)
})

const displayItems = computed(() => {
  if (!category.value) return []
  // 首页最多展示 3 个武器
  return category.value.items.slice(0, 3)
})

onMounted(async () => {
  try {
    const result = await getWeaponWorkshop(1, 3)
    if (result.categories && result.categories.length > 0) {
      category.value = result.categories[0]
    }
  } catch {
    // 静默失败
  } finally {
    loading.value = false
  }
})

function handleItemClick(item: WeaponItem) {
  // 预留：未来可跳转到武器详情页
  console.log('Weapon clicked:', item.name)
}

function handleEnterClick() {
  // 预留：未来可跳转到武器列表页
  console.log('Enter workshop')
}
</script>

<style scoped>
.weapon-workshop-section {
  margin-bottom: 3rem;
}

/* 卡片容器 */
.workshop-card {
  padding: 1.5rem;
  border-radius: 0.75rem;
  border: 1px solid #e2e8f0;
  background: #fff;
}

/* 分类标题栏 */
.category-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
}

.category-icon {
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(37, 99, 235, 0.1);
  border-radius: 0.5rem;
  color: #2563eb;
  font-size: 1.25rem;
}

.material-icon {
  font-family: 'Material Symbols Outlined', sans-serif;
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}

.category-info {
  flex: 1;
}

.category-name {
  font-size: 1rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 0.25rem;
}

.category-desc {
  font-size: 0.75rem;
  color: #64748b;
  margin: 0;
}

/* 武器列表 */
.weapon-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
}

.weapon-item {
  padding: 0.875rem;
  border-radius: 0.5rem;
  background: #f8fafc;
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.2s;
}

.weapon-item:hover {
  background: #fff;
  border-color: rgba(37, 99, 235, 0.2);
}

.weapon-name {
  font-size: 0.8rem;
  font-weight: 700;
  color: #2563eb;
  margin: 0 0 0.25rem;
}

.weapon-desc {
  font-size: 0.7rem;
  color: #64748b;
  margin: 0;
  line-height: 1.4;
}

.weapon-item:hover .weapon-desc {
  color: #1e293b;
}

/* 进入按钮 */
.enter-btn {
  width: 100%;
  padding: 0.625rem;
  border-radius: 0.5rem;
  border: 2px solid #2563eb;
  background: transparent;
  color: #2563eb;
  font-size: 0.875rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}

.enter-btn:hover {
  background: #2563eb;
  color: #fff;
}

/* 骨架屏 */
.skeleton-card {
  pointer-events: none;
}

.skeleton-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
}

.skeleton-header::before {
  content: '';
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.5rem;
  background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}

.skeleton-header::after {
  content: '';
  flex: 1;
  height: 2.5rem;
  border-radius: 0.5rem;
  background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}

.skeleton-items {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
}

.skeleton-item {
  height: 3.5rem;
  border-radius: 0.5rem;
  background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}

.skeleton-btn {
  width: 100%;
  height: 2.5rem;
  border-radius: 0.5rem;
  background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>
