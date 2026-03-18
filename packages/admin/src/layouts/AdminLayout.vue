<!-- Spec: specs/admin/dashboard.spec.md + specs/api/auth.spec.md -->
<template>
  <el-container class="admin-layout">
    <!-- 侧边菜单 -->
    <el-aside width="220px" class="aside">
      <div class="logo">
        <span class="logo-text">AI 研发平台</span>
        <span class="logo-sub">管理后台</span>
      </div>
      <el-menu
        :default-active="activeMenu"
        router
        background-color="#1a1a2e"
        text-color="#a0aec0"
        active-text-color="#ffffff"
      >
        <el-menu-item index="/dashboard">
          <el-icon><Odometer /></el-icon>
          <span>数据概览</span>
        </el-menu-item>

        <el-menu-item
          v-if="authStore.hasModulePermission('announcements')"
          index="/announcements"
        >
          <el-icon><Bell /></el-icon>
          <span>通知公告</span>
        </el-menu-item>

        <el-menu-item
          v-if="authStore.hasModulePermission('courses')"
          index="/courses"
        >
          <el-icon><VideoPlay /></el-icon>
          <span>AI 课程</span>
        </el-menu-item>

        <el-menu-item
          v-if="authStore.hasModulePermission('capabilities')"
          index="/capabilities"
        >
          <el-icon><Grid /></el-icon>
          <span>能力市场</span>
        </el-menu-item>

        <el-menu-item
          v-if="authStore.hasModulePermission('cases')"
          index="/cases"
        >
          <el-icon><Collection /></el-icon>
          <span>优秀案例</span>
        </el-menu-item>

        <el-menu-item
          v-if="authStore.hasModulePermission('honors')"
          index="/honors"
        >
          <el-icon><Trophy /></el-icon>
          <span>荣誉激励</span>
        </el-menu-item>

        <el-menu-item
          v-if="authStore.isAdmin"
          index="/users"
        >
          <el-icon><User /></el-icon>
          <span>用户权限</span>
        </el-menu-item>

        <el-menu-item
          v-if="authStore.hasModulePermission('banners')"
          index="/banners"
        >
          <el-icon><Picture /></el-icon>
          <span>Banner 管理</span>
        </el-menu-item>

        <el-menu-item
          v-if="authStore.hasModulePermission('tool-guides')"
          index="/tool-guides"
        >
          <el-icon><Tools /></el-icon>
          <span>工具指导</span>
        </el-menu-item>

        <el-menu-item
          v-if="authStore.hasModulePermission('labs')"
          index="/labs"
        >
          <el-icon><Film /></el-icon>
          <span>实战实验室</span>
        </el-menu-item>

        <el-menu-item
          v-if="authStore.hasModulePermission('wiki-cases')"
          index="/wiki-cases"
        >
          <el-icon><Files /></el-icon>
          <span>案例百科</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <!-- 主区域 -->
    <el-container direction="vertical">
      <!-- 顶部栏 -->
      <el-header class="header">
        <div class="header-left">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/dashboard' }">首页</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="header-right">
          <el-dropdown @command="handleCommand">
            <div class="user-info">
              <el-avatar :size="32" :src="authStore.user?.avatar">
                {{ authStore.user?.name?.charAt(0) }}
              </el-avatar>
              <span class="user-name">{{ authStore.user?.name }}</span>
              <el-tag size="small" :type="roleTagType">{{ roleLabel }}</el-tag>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <!-- 内容区 -->
      <el-main class="main">
        <RouterView />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
// Spec: specs/admin/dashboard.spec.md
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  Odometer, Bell, VideoPlay, Grid, Collection, Trophy, User, Picture, Tools, Film, Files,
} from '@element-plus/icons-vue'
import { useAuthStore } from '@/stores/auth'
import { logout } from '@/api/auth'
import { UserRole } from '@/types'

const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()

const activeMenu = computed(() => '/' + route.path.split('/')[1])

const roleLabel = computed(() => {
  const map: Record<UserRole, string> = {
    [UserRole.Admin]: '超级管理员',
    [UserRole.Editor]: '内容编辑',
    [UserRole.Viewer]: '普通员工',
  }
  return authStore.user ? map[authStore.user.role] : ''
})

const roleTagType = computed(() => {
  const map: Record<UserRole, 'danger' | 'warning' | 'info'> = {
    [UserRole.Admin]: 'danger',
    [UserRole.Editor]: 'warning',
    [UserRole.Viewer]: 'info',
  }
  return authStore.user ? map[authStore.user.role] : 'info'
})

async function handleCommand(command: string) {
  if (command === 'logout') {
    try {
      await logout()
    } finally {
      authStore.clearAuth()
      ElMessage.success('已退出登录')
      await router.push('/auth/callback')
      authStore.redirectToSSO()
    }
  }
}
</script>

<style scoped>
.admin-layout {
  height: 100vh;
}

.aside {
  background-color: #1a1a2e;
  overflow: hidden;
}

.logo {
  padding: 20px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.logo-text {
  color: #ffffff;
  font-size: 16px;
  font-weight: 700;
}

.logo-sub {
  color: #a0aec0;
  font-size: 12px;
}

.header {
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
}

.header-right {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.user-name {
  font-size: 14px;
  color: #374151;
}

.main {
  background-color: #f3f4f6;
  padding: 24px;
}
</style>
