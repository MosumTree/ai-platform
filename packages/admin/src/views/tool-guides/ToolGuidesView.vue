<!-- Spec: specs/api/tool-guides.spec.md -->
<template>
  <div>
    <div class="page-header">
      <h2 class="page-title">工具指导管理</h2>
      <el-button type="primary" :icon="Plus" @click="openCreate">新建工具</el-button>
    </div>

    <!-- 表格 -->
    <el-card shadow="never">
      <el-table
        v-loading="loading"
        :data="list"
        row-key="id"
        stripe
      >
        <el-table-column label="图标" width="70" align="center">
          <template #default="{ row }">
            <span :style="{ color: row.iconColor, fontSize: '1.5rem' }">{{ row.icon }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="工具名称" min-width="120" show-overflow-tooltip />
        <el-table-column prop="desc" label="描述" min-width="200" show-overflow-tooltip />
        <el-table-column prop="order" label="排序" width="80" align="center" />
        <el-table-column label="状态" width="90" align="center">
          <template #default="{ row }">
            <el-tag :type="row.isActive ? 'success' : 'info'" size="small">
              {{ row.isActive ? '已启用' : '已禁用' }}
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

    <!-- 新建/编辑弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="editing ? '编辑工具' : '新建工具'"
      width="560px"
      destroy-on-close
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="工具名称" prop="name">
          <el-input v-model="form.name" maxlength="100" show-word-limit placeholder="如：CodeAgent" />
        </el-form-item>
        <el-form-item label="描述" prop="desc">
          <el-input
            v-model="form.desc"
            type="textarea"
            :rows="2"
            maxlength="300"
            show-word-limit
            placeholder="一句话介绍该工具的用途"
          />
        </el-form-item>
        <el-form-item label="图标" prop="icon">
          <el-input v-model="form.icon" placeholder="输入 emoji，如：⌨" style="width: 120px" />
          <span v-if="form.icon" class="icon-preview" :style="{ color: form.iconColor }">
            {{ form.icon }}
          </span>
        </el-form-item>
        <el-form-item label="图标颜色" prop="iconColor">
          <el-color-picker v-model="form.iconColor" />
          <el-input
            v-model="form.iconColor"
            placeholder="#3b82f6"
            style="width: 120px; margin-left: 8px;"
          />
        </el-form-item>
        <el-form-item label="安装链接" prop="installUrl">
          <el-input v-model="form.installUrl" placeholder="https://..." />
        </el-form-item>
        <el-form-item label="指南链接" prop="guideUrl">
          <el-input v-model="form.guideUrl" placeholder="https://..." />
        </el-form-item>
        <el-form-item label="排序" prop="order">
          <el-input-number v-model="form.order" :min="0" />
          <span class="form-tip">数值越小越靠前</span>
        </el-form-item>
        <el-form-item label="启用展示">
          <el-switch v-model="form.isActive" />
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
// Spec: specs/api/tool-guides.spec.md
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import type { ToolGuide } from 'shared'
import {
  getAdminToolGuides,
  createToolGuide,
  updateToolGuide,
  deleteToolGuide,
} from '@/api/toolGuides'

const loading = ref(false)
const submitting = ref(false)
const list = ref<ToolGuide[]>([])
const total = ref(0)
const page = ref(1)
const pageSize = ref(20)

const dialogVisible = ref(false)
const editing = ref<ToolGuide | null>(null)
const formRef = ref<FormInstance>()

const defaultForm = () => ({
  name: '',
  desc: '',
  icon: '',
  iconColor: '#3b82f6',
  installUrl: '',
  guideUrl: '',
  order: 0,
  isActive: true,
})

const form = reactive(defaultForm())

const rules: FormRules = {
  name: [{ required: true, message: '请输入工具名称', trigger: 'blur' }],
  desc: [{ required: true, message: '请输入工具描述', trigger: 'blur' }],
  icon: [{ required: true, message: '请输入图标', trigger: 'blur' }],
  iconColor: [{ required: true, message: '请选择图标颜色', trigger: 'change' }],
  installUrl: [{ required: true, message: '请输入安装链接', trigger: 'blur' }],
  guideUrl: [{ required: true, message: '请输入指南链接', trigger: 'blur' }],
}

async function fetchList() {
  loading.value = true
  try {
    const res = await getAdminToolGuides({ page: page.value, pageSize: pageSize.value })
    list.value = res.list
    total.value = res.total
  } catch {
    ElMessage.error('加载工具列表失败，请刷新重试')
  } finally {
    loading.value = false
  }
}

function openCreate() {
  editing.value = null
  Object.assign(form, defaultForm())
  dialogVisible.value = true
}

function openEdit(row: ToolGuide) {
  editing.value = row
  Object.assign(form, {
    name: row.name,
    desc: row.desc,
    icon: row.icon,
    iconColor: row.iconColor,
    installUrl: row.installUrl,
    guideUrl: row.guideUrl,
    order: row.order,
    isActive: row.isActive,
  })
  dialogVisible.value = true
}

async function handleSubmit() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return

  submitting.value = true
  try {
    const payload = {
      name: form.name,
      desc: form.desc,
      icon: form.icon,
      iconColor: form.iconColor,
      installUrl: form.installUrl,
      guideUrl: form.guideUrl,
      order: form.order,
      isActive: form.isActive,
    }
    if (editing.value) {
      await updateToolGuide(editing.value.id, payload)
      ElMessage.success('更新成功')
    } else {
      await createToolGuide(payload)
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

async function handleDelete(row: ToolGuide) {
  await ElMessageBox.confirm(
    `确定要删除工具「${row.name}」吗？此操作不可撤销。`,
    '删除确认',
    {
      confirmButtonText: '确定删除',
      cancelButtonText: '取消',
      type: 'warning',
      confirmButtonClass: 'el-button--danger',
    },
  )
  try {
    await deleteToolGuide(row.id)
    ElMessage.success('删除成功')
    await fetchList()
  } catch {
    ElMessage.error('删除失败，请重试')
  }
}

onMounted(fetchList)
</script>

<style scoped>
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.page-title {
  font-size: 20px;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.pagination-wrap {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}

.form-tip {
  margin-left: 8px;
  font-size: 12px;
  color: #9ca3af;
}

.icon-preview {
  margin-left: 12px;
  font-size: 1.75rem;
  line-height: 1;
  vertical-align: middle;
}
</style>
