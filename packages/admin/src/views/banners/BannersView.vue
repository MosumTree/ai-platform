<!-- Spec: specs/api/banners.spec.md -->
<template>
  <div>
    <div class="page-header">
      <h2 class="page-title">Banner 管理</h2>
      <el-button type="primary" :icon="Plus" @click="openCreate">新建 Banner</el-button>
    </div>

    <!-- 表格 -->
    <el-card shadow="never">
      <el-table
        v-loading="loading"
        :data="banners"
        row-key="id"
        stripe
      >
        <el-table-column label="预览图" width="100">
          <template #default="{ row }">
            <el-image
              :src="row.imageUrl"
              fit="cover"
              style="width: 60px; height: 40px; border-radius: 4px;"
              :preview-src-list="[row.imageUrl]"
              preview-teleported
            />
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题" min-width="160" show-overflow-tooltip />
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
            <el-tag :type="row.isActive ? 'success' : 'info'" size="small">
              {{ row.isActive ? '启用' : '禁用' }}
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
          @change="fetchBanners"
        />
      </div>
    </el-card>

    <!-- 新建/编辑弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="editing ? '编辑 Banner' : '新建 Banner'"
      width="600px"
      destroy-on-close
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="90px"
      >
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" maxlength="100" show-word-limit placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="背景图 URL" prop="imageUrl">
          <el-input v-model="form.imageUrl" placeholder="请输入图片 URL" />
          <el-image
            v-if="form.imageUrl"
            :src="form.imageUrl"
            fit="cover"
            style="margin-top: 8px; width: 100%; height: 120px; border-radius: 4px;"
          />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="2"
            maxlength="200"
            show-word-limit
            placeholder="选填"
          />
        </el-form-item>
        <el-form-item label="按钮文案" prop="buttonText">
          <el-input v-model="form.buttonText" placeholder="选填，如：立即了解" />
        </el-form-item>
        <el-form-item label="按钮链接" prop="buttonLink">
          <el-input v-model="form.buttonLink" placeholder="选填，如：/courses" />
        </el-form-item>
        <el-form-item label="标签" prop="tags">
          <el-select
            v-model="form.tags"
            multiple
            filterable
            allow-create
            default-first-option
            placeholder="选填，可输入后回车创建"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="排序" prop="order">
          <el-input-number v-model="form.order" :min="0" />
          <span class="form-tip">数值越小越靠前</span>
        </el-form-item>
        <el-form-item label="启用">
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
// Spec: specs/api/banners.spec.md
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import type { Banner } from '@/types'
import { getAdminBanners, createBanner, updateBanner, deleteBanner } from '@/api/banners'

const loading = ref(false)
const submitting = ref(false)
const banners = ref<Banner[]>([])
const total = ref(0)
const page = ref(1)
const pageSize = ref(20)

const dialogVisible = ref(false)
const editing = ref<Banner | null>(null)
const formRef = ref<FormInstance>()

const defaultForm = () => ({
  title: '',
  imageUrl: '',
  description: '',
  buttonText: '',
  buttonLink: '',
  tags: [] as string[],
  order: 0,
  isActive: true,
})

const form = reactive(defaultForm())

const rules: FormRules = {
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  imageUrl: [{ required: true, message: '请输入背景图 URL', trigger: 'blur' }],
}

async function fetchBanners() {
  loading.value = true
  try {
    const res = await getAdminBanners({ page: page.value, pageSize: pageSize.value })
    banners.value = res.list
    total.value = res.total
  } catch {
    ElMessage.error('加载 Banner 列表失败，请刷新重试')
  } finally {
    loading.value = false
  }
}

function openCreate() {
  editing.value = null
  Object.assign(form, defaultForm())
  dialogVisible.value = true
}

function openEdit(row: Banner) {
  editing.value = row
  Object.assign(form, {
    title: row.title,
    imageUrl: row.imageUrl,
    description: row.description ?? '',
    buttonText: row.buttonText ?? '',
    buttonLink: row.buttonLink ?? '',
    tags: [...row.tags],
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
      title: form.title,
      imageUrl: form.imageUrl,
      description: form.description || undefined,
      buttonText: form.buttonText || undefined,
      buttonLink: form.buttonLink || undefined,
      tags: form.tags,
      order: form.order,
      isActive: form.isActive,
    }
    if (editing.value) {
      await updateBanner(editing.value.id, payload)
      ElMessage.success('更新成功')
    } else {
      await createBanner(payload as typeof payload & { title: string; imageUrl: string })
      ElMessage.success('创建成功')
    }
    dialogVisible.value = false
    await fetchBanners()
  } catch {
    ElMessage.error('保存失败，请重试')
  } finally {
    submitting.value = false
  }
}

async function handleDelete(row: Banner) {
  await ElMessageBox.confirm(`确定要删除 Banner「${row.title}」吗？此操作不可撤销。`, '删除确认', {
    confirmButtonText: '确定删除',
    cancelButtonText: '取消',
    type: 'warning',
    confirmButtonClass: 'el-button--danger',
  })
  try {
    await deleteBanner(row.id)
    ElMessage.success('删除成功')
    await fetchBanners()
  } catch {
    ElMessage.error('删除失败，请重试')
  }
}

onMounted(fetchBanners)
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

.mr-1 {
  margin-right: 4px;
  margin-bottom: 2px;
}
</style>
