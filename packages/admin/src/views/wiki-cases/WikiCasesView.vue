<!-- Spec: specs/api/wiki-cases.spec.md -->
<template>
  <div>
    <div class="page-header">
      <h2 class="page-title">案例百科管理</h2>
      <el-button type="primary" :icon="Plus" @click="openCreate">新建词条</el-button>
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
        <el-table-column label="标签" min-width="140">
          <template #default="{ row }">
            <el-tag
              v-for="tag in row.tags"
              :key="tag"
              size="small"
              class="mr-1"
            >{{ tag }}</el-tag>
          </template>
        </el-table-column>
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
      :title="editing ? '编辑词条' : '新建词条'"
      width="580px"
      destroy-on-close
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="90px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" maxlength="120" show-word-limit placeholder="词条标题" />
        </el-form-item>
        <el-form-item label="摘要" prop="summary">
          <el-input
            v-model="form.summary"
            type="textarea"
            :rows="3"
            maxlength="300"
            show-word-limit
            placeholder="2~3 句话概括内容"
          />
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
        <el-form-item label="阅读链接" prop="readUrl">
          <el-input v-model="form.readUrl" placeholder="https:// 或 /wiki/xxx" />
        </el-form-item>
        <el-form-item label="标签" prop="tags">
          <el-select
            v-model="form.tags"
            multiple
            filterable
            allow-create
            default-first-option
            placeholder="可输入后回车创建"
            style="width: 100%"
          />
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
// Spec: specs/api/wiki-cases.spec.md
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import type { WikiCase } from '@/types'
import { getAdminWikiCases, createWikiCase, updateWikiCase, deleteWikiCase } from '@/api/wikiCases'

const loading = ref(false)
const submitting = ref(false)
const list = ref<WikiCase[]>([])
const total = ref(0)
const page = ref(1)
const pageSize = ref(20)
const dialogVisible = ref(false)
const editing = ref<WikiCase | null>(null)
const formRef = ref<FormInstance>()

const defaultForm = () => ({
  title: '', summary: '', coverUrl: '', readUrl: '', tags: [] as string[], order: 0, isPublished: false,
})
const form = reactive(defaultForm())

const rules: FormRules = {
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  summary: [{ required: true, message: '请输入摘要', trigger: 'blur' }],
  coverUrl: [{ required: true, message: '请输入封面 URL', trigger: 'blur' }],
  readUrl: [{ required: true, message: '请输入阅读链接', trigger: 'blur' }],
}

async function fetchList() {
  loading.value = true
  try {
    const res = await getAdminWikiCases({ page: page.value, pageSize: pageSize.value })
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

function openEdit(row: WikiCase) {
  editing.value = row
  Object.assign(form, {
    title: row.title, summary: row.summary, coverUrl: row.coverUrl,
    readUrl: row.readUrl, tags: [...row.tags], order: row.order, isPublished: row.isPublished,
  })
  dialogVisible.value = true
}

async function handleSubmit() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return
  submitting.value = true
  try {
    if (editing.value) {
      await updateWikiCase(editing.value.id, { ...form })
      ElMessage.success('更新成功')
    } else {
      await createWikiCase({ ...form })
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

async function handleDelete(row: WikiCase) {
  await ElMessageBox.confirm(`确定要删除「${row.title}」吗？`, '删除确认', {
    confirmButtonText: '确定删除', cancelButtonText: '取消', type: 'warning',
    confirmButtonClass: 'el-button--danger',
  })
  try {
    await deleteWikiCase(row.id)
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
.mr-1 { margin-right: 4px; margin-bottom: 2px; }
</style>
