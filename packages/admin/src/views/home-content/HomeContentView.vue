<!-- Spec: specs/admin/home-content.spec.md -->
<template>
  <div class="home-content-view">
    <div class="page-header">
      <h2 class="page-title">首页内容管理</h2>
    </div>

    <!-- 统计 -->
    <el-row :gutter="20" class="stats-row">
      <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="4" v-for="stat in moduleStats" :key="stat.name">
        <el-card class="stat-card" shadow="hover" @click="navigateTo(stat.route)">
          <div class="stat-content">
            <div class="stat-icon" :style="{ backgroundColor: stat.color + '20', color: stat.color }">
              <el-icon :size="24">
                <component :is="stat.icon" />
              </el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stat.count }}</div>
              <div class="stat-label">{{ stat.label }}</div>
            </div>
          </div>
          <div class="stat-actions">
            <el-button type="primary" link size="small" @click.stop="navigateTo(stat.route)"> 管理 <el-icon><ArrowRight /></el-icon>
            </el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 模块 -->
    <el-row :gutter="20" class="modules-row">
      <el-col :xs="24" :lg="12">
        <el-card class="module-card" v-loading="loading.banners">
          <template #header>
            <div class="module-header">
              <div class="module-title">
                <el-icon><Picture /></el-icon>
                <span>Banner</span>
                <el-tag size="small">{{ counts.banners }} 个</el-tag>
              </div>
              <el-button type="primary" link @click="navigateTo('/banners')">管理</el-button>
            </div>
          </template>
          <div v-for="item in previewData.banners" :key="item.id" class="preview-item">
            <el-image :src="item.imageUrl" class="preview-img" />
            <div class="preview-info">
              <div class="preview-title">{{ item.title }}</div>
              <el-tag :type="item.isActive ? 'success' : 'info'" size="small">
                {{ item.isActive ? '启用' : '禁用' }}
              </el-tag>
            </div>
          </div>
          <el-empty v-if="previewData.banners.length === 0" description="暂无数据" />
        </el-card>
      </el-col>

      <el-col :xs="24" :lg="12">
        <el-card class="module-card" v-loading="loading.toolGuides">
          <template #header>
            <div class="module-header">
              <div class="module-title">
                <el-icon><Tools /></el-icon>
                <span>工具指南</span>
                <el-tag size="small">{{ counts.toolGuides }} 个</el-tag>
              </div>
              <el-button type="primary" link @click="navigateTo('/tool-guides')">管理</el-button>
            </div>
          </template>
          <div v-for="item in previewData.toolGuides" :key="item.id" class="preview-item">
            <el-avatar :size="40" :style="{ backgroundColor: item.iconColor }">
              <el-icon><component :is="item.icon" /></el-icon>
            </el-avatar>
            <div class="preview-info">
              <div class="preview-title">{{ item.name }}</div>
              <div class="preview-desc">{{ item.desc }}</div>
            </div>
          </div>
          <el-empty v-if="previewData.toolGuides.length === 0" description="暂无数据" />
        </el-card>
      </el-col>

      <el-col :xs="24" :lg="12">
        <el-card class="module-card" v-loading="loading.aiTrends">
          <template #header>
            <div class="module-header">
              <div class="module-title">
                <el-icon><TrendCharts /></el-icon>
                <span>AI风向标</span>
                <el-tag size="small">{{ counts.aiTrends }} 条</el-tag>
              </div>
              <el-button type="primary" link @click="navigateTo('/ai-trends')">查看</el-button>
            </div>
          </template>
          <div v-for="item in previewData.aiTrends" :key="item.id" class="preview-item">
            <el-icon size="20"><Lightning /></el-icon>
            <div class="preview-info">
              <div class="preview-title">{{ item.title }}</div>
              <el-tag size="small" type="warning">{{ item.source }}</el-tag>
            </div>
          </div>
          <el-empty v-if="previewData.aiTrends.length === 0" description="暂无数据" />
        </el-card>
      </el-col>

      <el-col :xs="24" :lg="12">
        <el-card class="module-card" v-loading="loading.weaponWorkshop">
          <template #header>
            <div class="module-header">
              <div class="module-title">
                <el-icon><Box /></el-icon>
                <span>百工武器坊</span>
                <el-tag size="small">{{ counts.weaponCategories }} 分类</el-tag>
              </div>
              <el-button type="primary" link @click="navigateTo('/weapon-workshop')">查看</el-button>
            </div>
          </template>
          <div v-for="item in previewData.weaponCategories" :key="item.id" class="preview-item">
            <el-icon size="20"><component :is="item.icon || 'Box'" /></el-icon>
            <div class="preview-info">
              <div class="preview-title">{{ item.name }}</div>
              <div class="preview-desc">{{ item.description || '暂无描述' }}</div>
            </div>
          </div>
          <el-empty v-if="previewData.weaponCategories.length === 0" description="暂无数据" />
        </el-card>
      </el-col>

      <el-col :xs="24" :lg="12">
        <el-card class="module-card" v-loading="loading.labs">
          <template #header>
            <div class="module-header">
              <div class="module-title">
                <el-icon><Film /></el-icon>
                <span>实战实验室</span>
                <el-tag size="small">{{ counts.labs }} 个</el-tag>
              </div>
              <el-button type="primary" link @click="navigateTo('/labs')">查看</el-button>
            </div>
          </template>
          <div v-for="item in previewData.labs" :key="item.id" class="preview-item">
            <el-image :src="item.coverUrl" class="preview-img" />
            <div class="preview-info">
              <div class="preview-title">{{ item.title }}</div>
              <div class="preview-desc">时长: {{ item.duration }}</div>
            </div>
          </div>
          <el-empty v-if="previewData.labs.length === 0" description="暂无数据" />
        </el-card>
      </el-col>

      <el-col :xs="24" :lg="12">
        <el-card class="module-card" v-loading="loading.wikiCases">
          <template #header>
            <div class="module-header">
              <div class="module-title">
                <el-icon><Files /></el-icon>
                <span>案例百科</span>
                <el-tag size="small">{{ counts.wikiCases }} 个</el-tag>
              </div>
              <el-button type="primary" link @click="navigateTo('/wiki-cases')">查看</el-button>
            </div>
          </template>
          <div v-for="item in previewData.wikiCases" :key="item.id" class="preview-item">
            <el-image :src="item.coverUrl" class="preview-img" />
            <div class="preview-info">
              <div class="preview-title">{{ item.title }}</div>
              <div class="preview-tags">
                <el-tag v-for="tag in (item.tags || []).slice(0, 2)" :key="tag" size="small">
                  {{ tag }}
                </el-tag>
              </div>
            </div>
          </div>
          <el-empty v-if="previewData.wikiCases.length === 0" description="暂无数据" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  Picture, Tools, TrendCharts, Box, Film, Files,
  ArrowRight, Lightning
} from '@element-plus/icons-vue'
import { getAdminBanners } from '@/api/banners'
import { getAdminToolGuides } from '@/api/toolGuides'
import { getAdminAiTrends } from '@/api/aiTrends'
import { getWeaponCategories } from '@/api/weaponWorkshop'
import { getAdminLabs } from '@/api/labs'
import { getAdminWikiCases } from '@/api/wikiCases'
import type { Banner, ToolGuide, AiTrend, WeaponCategory, Lab, WikiCase } from '@/types'

const router = useRouter()

const moduleStats = reactive([
  { name: 'banners', label: 'Banner', icon: Picture, color: '#409EFF', count: 0, route: '/banners' },
  { name: 'toolGuides', label: '工具', icon: Tools, color: '#67C23A', count: 0, route: '/tool-guides' },
  { name: 'aiTrends', label: 'AI动态', icon: TrendCharts, color: '#E6A23C', count: 0, route: '/ai-trends' },
  { name: 'weaponWorkshop', label: '武器坊', icon: Box, color: '#F56C6C', count: 0, route: '/weapon-workshop' },
  { name: 'labs', label: '视频', icon: Film, color: '#909399', count: 0, route: '/labs' },
  { name: 'wikiCases', label: '案例', icon: Files, color: '#8E44AD', count: 0, route: '/wiki-cases' },
])

const counts = reactive({
  banners: 0,
  toolGuides: 0,
  aiTrends: 0,
  weaponCategories: 0,
  labs: 0,
  wikiCases: 0,
})

const previewData = reactive({
  banners: [] as Banner[],
  toolGuides: [] as ToolGuide[],
  aiTrends: [] as AiTrend[],
  weaponCategories: [] as WeaponCategory[],
  labs: [] as Lab[],
  wikiCases: [] as WikiCase[],
})

const loading = reactive({
  banners: false,
  toolGuides: false,
  aiTrends: false,
  weaponWorkshop: false,
  labs: false,
  wikiCases: false,
})

async function loadAllData() {
  loading.banners = true
  try {
    const res = await getAdminBanners({ page: 1, pageSize: 3 })
    counts.banners = res.total || 0
    previewData.banners = res.list || []
    moduleStats[0].count = counts.banners
  } finally { loading.banners = false }

  loading.toolGuides = true
  try {
    const res = await getAdminToolGuides({ page: 1, pageSize: 3 })
    counts.toolGuides = res.total || 0
    previewData.toolGuides = res.list || []
    moduleStats[1].count = counts.toolGuides
  } finally { loading.toolGuides = false }

  loading.aiTrends = true
  try {
    const res = await getAdminAiTrends(1, 3)
    counts.aiTrends = res.total || 0
    previewData.aiTrends = res.list || []
    moduleStats[2].count = counts.aiTrends
  } finally { loading.aiTrends = false }

  loading.weaponWorkshop = true
  try {
    const res = await getWeaponCategories(1, 3)
    counts.weaponCategories = res.total || 0
    previewData.weaponCategories = res.list || []
    moduleStats[3].count = counts.weaponCategories
  } finally { loading.weaponWorkshop = false }

  loading.labs = true
  try {
    const res = await getAdminLabs({ page: 1, pageSize: 3 })
    counts.labs = res.total || 0
    previewData.labs = res.list || []
    moduleStats[4].count = counts.labs
  } finally { loading.labs = false }

  loading.wikiCases = true
  try {
    const res = await getAdminWikiCases({ page: 1, pageSize: 3 })
    counts.wikiCases = res.total || 0
    previewData.wikiCases = res.list || []
    moduleStats[5].count = counts.wikiCases
  } finally { loading.wikiCases = false }
}

function navigateTo(route: string) {
  router.push(route)
}

onMounted(() => {
  loadAllData()
})
</script>

<style scoped>
.home-content-view { padding: 20px; }
.page-header { margin-bottom: 20px; }
.page-title { font-size: 24px; margin: 0; }
.page-subtitle { color: #909399; margin: 8px 0 0; }

.stats-row { margin-bottom: 20px; }
.stat-card { cursor: pointer; }
.stat-content { display: flex; align-items: center; gap: 16px; }
.stat-icon { width: 48px; height: 48px; border-radius: 8px; display: flex; align-items: center; justify-content: center; }
.stat-value { font-size: 28px; font-weight: 600; }
.stat-label { color: #909399; font-size: 14px; }
.stat-actions { text-align: right; margin-top: 12px; }

.modules-row { margin: 0; }
.module-card { margin-bottom: 20px; }
.module-header { display: flex; justify-content: space-between; align-items: center; }
.module-title { display: flex; align-items: center; gap: 8px; font-weight: 600; }

.preview-item { display: flex; align-items: center; gap: 12px; padding: 12px 0; border-bottom: 1px solid #EBEEF5; }
.preview-item:last-child { border-bottom: none; }
.preview-img { width: 80px; height: 50px; border-radius: 4px; }
.preview-info { flex: 1; min-width: 0; }
.preview-title { font-weight: 500; margin-bottom: 4px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.preview-desc { color: #909399; font-size: 12px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.preview-tags { display: flex; gap: 4px; flex-wrap: wrap; }
</style>
