<!-- Spec: specs/api/weapon-workshop.spec.md -->
<template>
  <div>
    <div class="page-header">
      <h2 class="page-title">百工武器坊管理</h2>
      <el-button type="primary" :icon="Plus" @click="openCategoryCreate">新建分类</el-button>
    </div>

    <!-- 分类表格 -->
    <el-card shadow="never" class="mb-6">
      <template #header>
        <div class="card-header">
          <span>分类管理</span>
        </div>
      </template>
      <el-table v-loading="categoryLoading" :data="categoryList" row-key="id" stripe>
        <el-table-column label="图标" width="80" align="center">
          <template #default="{ row }">
            <div class="category-icon">
              <span class="local-icon" aria-hidden="true">{{ resolveCategoryIcon(row.icon) }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="分类名称" min-width="150" />
        <el-table-column prop="description" label="描述" min-width="200" show-overflow-tooltip />
        <el-table-column label="状态" width="90" align="center">
          <template #default="{ row }">
            <el-tag :type="row.isActive ? 'success' : 'info'" size="small">
              {{ row.isActive ? '展示' : '隐藏' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="order" label="排序" width="80" align="center" />
        <el-table-column label="操作" width="250" align="center" fixed="right">
          <template #default="{ row }">
            <el-button size="small" @click="openCategoryEdit(row)">编辑</el-button>
            <el-button size="small" @click="showItems(row)">管理武器</el-button>
            <el-button
              v-permission="'admin'"
              size="small"
              type="danger"
              @click="handleCategoryDelete(row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 武器列表（选中分类后显示） -->
    <el-card v-if="selectedCategory" shadow="never">
      <template #header>
        <div class="card-header">
          <span>「{{ selectedCategory.name }}」武器列表</span>
          <el-button type="primary" size="small" :icon="Plus" @click="openItemCreate">新建武器</el-button>
        </div>
      </template>
      <el-table v-loading="itemLoading" :data="itemList" row-key="id" stripe>
        <el-table-column prop="name" label="武器名称" min-width="150" />
        <el-table-column prop="description" label="功能描述" min-width="250" show-overflow-tooltip />
        <el-table-column label="状态" width="90" align="center">
          <template #default="{ row }">
            <el-tag :type="row.isActive ? 'success' : 'info'" size="small">
              {{ row.isActive ? '展示' : '隐藏' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="order" label="排序" width="80" align="center" />
        <el-table-column label="操作" width="140" align="center" fixed="right">
          <template #default="{ row }">
            <el-button size="small" @click="openItemEdit(row)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleItemDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 分类弹窗 -->
    <el-dialog
      v-model="categoryDialogVisible"
      :title="editingCategory ? '编辑分类' : '新建分类'"
      width="500px"
      destroy-on-close
    >
      <el-form ref="categoryFormRef" :model="categoryForm" :rules="categoryRules" label-width="90px">
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="categoryForm.name" placeholder="如：前端开发利器" />
        </el-form-item>
        <el-form-item label="图标">
          <el-input v-model="categoryForm.icon" placeholder="Material Symbol，如 construction、code" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="categoryForm.description" type="textarea" :rows="2" placeholder="分类简介" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="categoryForm.order" :min="0" />
        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="categoryForm.isActive" active-text="展示" inactive-text="隐藏" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="categoryDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submittingCategory" @click="handleCategorySubmit">保存</el-button>
      </template>
    </el-dialog>

    <!-- 武器弹窗 -->
    <el-dialog
      v-model="itemDialogVisible"
      :title="editingItem ? '编辑武器' : '新建武器'"
      width="500px"
      destroy-on-close
    >
      <el-form ref="itemFormRef" :model="itemForm" :rules="itemRules" label-width="90px">
        <el-form-item label="所属分类" prop="categoryId">
          <el-select v-model="itemForm.categoryId" placeholder="选择分类" style="width: 100%">
            <el-option
              v-for="cat in categoryList"
              :key="cat.id"
              :label="cat.name"
              :value="cat.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="武器名称" prop="name">
          <el-input v-model="itemForm.name" placeholder="如：SDD 需求设计" />
        </el-form-item>
        <el-form-item label="功能描述" prop="description">
          <el-input v-model="itemForm.description" type="textarea" :rows="3" placeholder="描述该武器的功能" />
        </el-form-item>
        <el-form-item label="图标">
          <el-input v-model="itemForm.icon" placeholder="Material Symbol，可选" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="itemForm.order" :min="0" />
        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="itemForm.isActive" active-text="展示" inactive-text="隐藏" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="itemDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submittingItem" @click="handleItemSubmit">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
// Spec: specs/api/weapon-workshop.spec.md
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import type { WeaponCategory, WeaponItem } from '@/types'
import {
  getWeaponCategories,
  createWeaponCategory,
  updateWeaponCategory,
  deleteWeaponCategory,
  getCategoryItems,
  createWeaponItem,
  updateWeaponItem,
  deleteWeaponItem,
} from '@/api/weaponWorkshop'

// 分类相关
const categoryLoading = ref(false)
const categoryList = ref<WeaponCategory[]>([])
const categoryDialogVisible = ref(false)
const editingCategory = ref<WeaponCategory | null>(null)
const submittingCategory = ref(false)
const categoryFormRef = ref<FormInstance>()

const categoryForm = ref({
  name: '',
  icon: 'construction',
  description: '',
  order: 0,
  isActive: true,
})

const categoryRules: FormRules = {
  name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
}

// 武器项相关
const selectedCategory = ref<WeaponCategory | null>(null)
const itemLoading = ref(false)
const itemList = ref<WeaponItem[]>([])
const itemDialogVisible = ref(false)
const editingItem = ref<WeaponItem | null>(null)
const submittingItem = ref(false)
const itemFormRef = ref<FormInstance>()

const itemForm = ref({
  categoryId: 0,
  name: '',
  description: '',
  icon: '',
  order: 0,
  isActive: true,
})

const itemRules: FormRules = {
  categoryId: [{ required: true, message: '请选择所属分类', trigger: 'change' }],
  name: [{ required: true, message: '请输入武器名称', trigger: 'blur' }],
  description: [{ required: true, message: '请输入功能描述', trigger: 'blur' }],
}

// 加载分类列表
async function fetchCategories() {
  categoryLoading.value = true
  try {
    const res = await getWeaponCategories()
    categoryList.value = res.list
  } catch {
    ElMessage.error('加载分类列表失败')
  } finally {
    categoryLoading.value = false
  }
}

// 显示分类下的武器
async function showItems(category: WeaponCategory) {
  selectedCategory.value = category
  itemLoading.value = true
  try {
    itemList.value = await getCategoryItems(category.id)
  } catch {
    ElMessage.error('加载武器列表失败')
  } finally {
    itemLoading.value = false
  }
}

// 分类弹窗
function openCategoryCreate() {
  editingCategory.value = null
  categoryForm.value = {
    name: '',
    icon: 'construction',
    description: '',
    order: 0,
    isActive: true,
  }
  categoryDialogVisible.value = true
}

function openCategoryEdit(row: WeaponCategory) {
  editingCategory.value = row
  categoryForm.value = {
    name: row.name,
    icon: row.icon || 'construction',
    description: row.description,
    order: row.order,
    isActive: row.isActive,
  }
  categoryDialogVisible.value = true
}

async function handleCategorySubmit() {
  const valid = await categoryFormRef.value?.validate().catch(() => false)
  if (!valid) return

  submittingCategory.value = true
  try {
    if (editingCategory.value) {
      await updateWeaponCategory(editingCategory.value.id, categoryForm.value)
      ElMessage.success('更新成功')
    } else {
      await createWeaponCategory(categoryForm.value)
      ElMessage.success('创建成功')
    }
    categoryDialogVisible.value = false
    await fetchCategories()
  } catch {
    ElMessage.error('保存失败，请重试')
  } finally {
    submittingCategory.value = false
  }
}

async function handleCategoryDelete(row: WeaponCategory) {
  await ElMessageBox.confirm(`确定要删除分类「${row.name}」吗？该分类下的所有武器也会被删除！`, '删除确认', {
    confirmButtonText: '确定删除',
    cancelButtonText: '取消',
    type: 'warning',
    confirmButtonClass: 'el-button--danger',
  })
  try {
    await deleteWeaponCategory(row.id)
    ElMessage.success('删除成功')
    if (selectedCategory.value?.id === row.id) {
      selectedCategory.value = null
      itemList.value = []
    }
    await fetchCategories()
  } catch {
    ElMessage.error('删除失败，请重试')
  }
}

// 武器弹窗
function openItemCreate() {
  editingItem.value = null
  itemForm.value = {
    categoryId: selectedCategory.value?.id || 0,
    name: '',
    description: '',
    icon: '',
    order: 0,
    isActive: true,
  }
  itemDialogVisible.value = true
}

function openItemEdit(row: WeaponItem) {
  editingItem.value = row
  itemForm.value = {
    categoryId: row.categoryId,
    name: row.name,
    description: row.description,
    icon: row.icon || '',
    order: row.order,
    isActive: row.isActive,
  }
  itemDialogVisible.value = true
}

async function handleItemSubmit() {
  const valid = await itemFormRef.value?.validate().catch(() => false)
  if (!valid) return

  submittingItem.value = true
  try {
    if (editingItem.value) {
      await updateWeaponItem(editingItem.value.id, itemForm.value)
      ElMessage.success('更新成功')
    } else {
      await createWeaponItem(itemForm.value)
      ElMessage.success('创建成功')
    }
    itemDialogVisible.value = false
    if (selectedCategory.value) {
      await showItems(selectedCategory.value)
    }
  } catch {
    ElMessage.error('保存失败，请重试')
  } finally {
    submittingItem.value = false
  }
}

async function handleItemDelete(row: WeaponItem) {
  await ElMessageBox.confirm(`确定要删除武器「${row.name}」吗？`, '删除确认', {
    confirmButtonText: '确定删除',
    cancelButtonText: '取消',
    type: 'warning',
    confirmButtonClass: 'el-button--danger',
  })
  try {
    await deleteWeaponItem(row.id)
    ElMessage.success('删除成功')
    if (selectedCategory.value) {
      await showItems(selectedCategory.value)
    }
  } catch {
    ElMessage.error('删除失败，请重试')
  }
}

onMounted(fetchCategories)

function resolveCategoryIcon(icon?: string | null): string {
  if (!icon) return '🛠'
  const normalized = icon.trim().toLowerCase().replace(/[\s-]+/g, '_')
  const iconMap: Record<string, string> = {
    construction: '🛠',
    build: '🛠',
    engineering: '⚙️',
    code: '💻',
    terminal: '⌨️',
    memory: '🧠',
    extension: '🧩',
  }
  return iconMap[normalized] || '🧰'
}
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

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.mb-6 {
  margin-bottom: 24px;
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

.local-icon {
  line-height: 1;
  font-size: 1.25rem;
}
</style>
