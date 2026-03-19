<!-- Spec: specs/admin/dashboard.spec.md -->
<template>
  <div class="dashboard-view">
    <h2 class="page-title">访问统计</h2>

    <el-row :gutter="16" class="stats-row">
      <el-col :xs="24" :md="12">
        <el-card class="stat-card" shadow="never" v-loading="loading">
          <div class="stat-label">最近 7 天总访问量（PV）</div>
          <div class="stat-value">{{ overview?.totals.pageViews ?? 0 }}</div>
        </el-card>
      </el-col>
      <el-col :xs="24" :md="12">
        <el-card class="stat-card" shadow="never" v-loading="loading">
          <div class="stat-label">最近 7 天访客数（UV）</div>
          <div class="stat-value">{{ overview?.totals.visitors ?? 0 }}</div>
        </el-card>
      </el-col>
    </el-row>

    <el-card shadow="never" v-loading="loading">
      <template #header>
        <div class="table-header">
          <span>页面访问排行</span>
          <span v-if="overview" class="table-sub">
            {{ formatRange(overview.range.from, overview.range.to) }}
          </span>
        </div>
      </template>

      <el-table
        v-if="(overview?.byPath.length ?? 0) > 0"
        :data="overview?.byPath.slice(0, 10) || []"
        stripe
      >
        <el-table-column label="路径" min-width="260" prop="path" />
        <el-table-column label="PV" width="120" align="right" prop="pageViews" />
        <el-table-column label="UV" width="120" align="right" prop="visitors" />
      </el-table>
      <el-empty v-else-if="!loading" description="暂无统计数据" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
// Spec: specs/admin/dashboard.spec.md
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getAnalyticsOverview, type AnalyticsOverview } from '@/api/admin'

const loading = ref(false)
const overview = ref<AnalyticsOverview | null>(null)

onMounted(async () => {
  loading.value = true
  try {
    overview.value = await getAnalyticsOverview()
  } catch {
    ElMessage.error('获取访问统计失败')
  } finally {
    loading.value = false
  }
})

function formatRange(from: string, to: string): string {
  const f = from.slice(0, 10)
  const t = to.slice(0, 10)
  return `${f} ~ ${t}`
}
</script>

<style scoped>
.dashboard-view {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.page-title {
  font-size: 20px;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.stats-row {
  margin-bottom: 0;
}

.stat-card {
  border-radius: 10px;
}

.stat-label {
  color: #6b7280;
  font-size: 13px;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 32px;
  line-height: 1;
  font-weight: 700;
  color: #111827;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
}

.table-sub {
  font-size: 12px;
  color: #6b7280;
}
</style>
