<!-- Spec: specs/api/labs.spec.md -->
<template>
  <div>
    <div class="page-header">
      <h2 class="page-title">实战实验室管理</h2>
      <el-button type="primary" :icon="Plus" @click="openCreate">新建视频</el-button>
    </div>

    <el-card shadow="never">
      <el-table v-loading="loading" :data="list" row-key="id" stripe>
        <el-table-column label="封面" width="100">
          <template #default="{ row }">
            <el-image
              :src="row.coverUrl"
              fit="cover"
              style="width: 70px; height: 44px; border-radius: 4px;"
              :preview-src-list="[row.coverUrl]"
              preview-teleported
            />
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题" min-width="180" show-overflow-tooltip />
        <el-table-column prop="subtitle" label="副标题" min-width="180" show-overflow-tooltip />
        <el-table-column prop="duration" label="时长" width="80" align="center" />
        <el-table-column prop="order" label="排序" width="80" align="center" />
        <el-table-column label="状态" width="90" align="center">
          <template #default="{ row }">
            <el-tag :type="row.isPublished ? 'success' : 'info'" size="small">
              {{ row.isPublished ? '已发布' : '草稿' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="140" align="center" fixed="right">
          <template #default="{ row }">
            <el-button size="small" @click="openEdit(row)">编辑</el-button>
            <el-button
              v-permission="'admin'"
              size="small"
              type="danger"
              @click="handleDelete(row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-wrap">
        <el-pagination
          v-model:current-page="page"
          v-model:page-size="pageSize"
          :total="total"
          :page-sizes="[10, 20, 50]"
          layout="total, sizes, prev, pager, next"
          @change="fetchList"
        />
      </div>
    </el-card>

    <!-- 弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="editing ? '编辑视频' : '新建视频'"
      width="580px"
      destroy-on-close
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="90px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" maxlength="120" show-word-limit placeholder="视频标题" />
        </el-form-item>
        <el-form-item label="副标题" prop="subtitle">
          <el-input v-model="form.subtitle" maxlength="200" show-word-limit placeholder="一句话描述" />
        </el-form-item>
        <el-form-item label="封面 URL" prop="coverUrl">
          <el-input v-model="form.coverUrl" placeholder="https://..." />
          <el-image
            v-if="form.coverUrl"
            :src="form.coverUrl"
            fit="cover"
            style="margin-top: 8px; width: 100%; height: 100px; border-radius: 4px;"
          />
        </el-form-item>
        <el-form-item label="视频链接" prop="videoUrl">
          <el-input v-model="form.videoUrl" placeholder="https://..." />
        </el-form-item>
        <el-form-item label="时长" prop="duration">
          <el-input v-model="form.duration" placeholder="如：12:45" style="width: 120px;" />
        </el-form-item>
        <el-form-item label="排序" prop="order">
          <el-input-number v-model="form.order" :min="0" />
          <span class="form-tip">数值越小越靠前</span>
        </el-form-item>
        <el-form-item label="已发布">
          <el-switch v-model="form.isPublished" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="handleSubmit">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
// Spec: specs/api/labs.spec.md
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import type { Lab } from '@/types'
import { getAdminLabs, createLab, updateLab, deleteLab } from '@/api/labs'

const loading = ref(false)
const submitting = ref(false)
const list = ref<Lab[]>([])
const total = ref(0)
const page = ref(1)
const pageSize = ref(20)
const dialogVisible = ref(false)
const editing = ref<Lab | null>(null)
const formRef = ref<FormInstance>()

const defaultForm = () => ({
  title: '', subtitle: '', coverUrl: '', videoUrl: '', duration: '', order: 0, isPublished: false,
})
const form = reactive(defaultForm())

const rules: FormRules = {
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  subtitle: [{ required: true, message: '请输入副标题', trigger: 'blur' }],
  coverUrl: [{ required: true, message: '请输入封面 URL', trigger: 'blur' }],
  videoUrl: [{ required: true, message: '请输入视频链接', trigger: 'blur' }],
  duration: [{ required: true, message: '请输入时长', trigger: 'blur' }],
}

async function fetchList() {
  loading.value = true
  try {
    const res = await getAdminLabs({ page: page.value, pageSize: pageSize.value })
    list.value = res.list
    total.value = res.total
  } catch {
    ElMessage.error('加载列表失败，请刷新重试')
  } finally {
    loading.value = false
  }
}

function openCreate() {
  editing.value = null
  Object.assign(form, defaultForm())
  dialogVisible.value = true
}

function openEdit(row: Lab) {
  editing.value = row
  Object.assign(form, {
    title: row.title, subtitle: row.subtitle, coverUrl: row.coverUrl,
    videoUrl: row.videoUrl, duration: row.duration, order: row.order, isPublished: row.isPublished,
  })
  dialogVisible.value = true
}

async function handleSubmit() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return
  submitting.value = true
  try {
    if (editing.value) {
      await updateLab(editing.value.id, { ...form })
      ElMessage.success('更新成功')
    } else {
      await createLab({ ...form })
      ElMessage.success('创建成功')
    }
    dialogVisible.value = false
    await fetchList()
  } catch {
    ElMessage.error('保存失败，请重试')
  } finally {
    submitting.value = false
  }
}

async function handleDelete(row: Lab) {
  await ElMessageBox.confirm(`确定要删除「${row.title}」吗？`, '删除确认', {
    confirmButtonText: '确定删除', cancelButtonText: '取消', type: 'warning',
    confirmButtonClass: 'el-button--danger',
  })
  try {
    await deleteLab(row.id)
    ElMessage.success('删除成功')
    await fetchList()
  } catch {
    ElMessage.error('删除失败，请重试')
  }
}

onMounted(fetchList)
</script>

<style scoped>
.page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
.page-title { font-size: 20px; font-weight: 600; color: #111827; margin: 0; }
.pagination-wrap { display: flex; justify-content: flex-end; margin-top: 16px; }
.form-tip { margin-left: 8px; font-size: 12px; color: #9ca3af; }
</style>
