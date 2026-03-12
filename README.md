# AI 辅助研发平台（ai-platform）

部门 AI 辅助研发学习与宣传阵地，包含员工展示门户、管理后台和统一后端 API。

## 技术栈

- **portal**：Vue 3 + Vite + Tailwind CSS（员工展示门户）
- **admin**：Vue 3 + Vite + Element Plus（管理后台）
- **backend**：NestJS + TypeORM + MySQL（统一 API）
- **shared**：公共类型定义

## 开发方式

本项目采用 **Spec-Driven Development（规格驱动开发）**：

> 先写 Spec → 评审确认 → @引用 Spec 让 AI 生成代码 → 对照验收标准验收

所有功能的 Spec 文档在 `specs/` 目录下，开发前必须先阅读对应 Spec。

## 快速开始

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev:portal    # 员工门户 http://localhost:5173
pnpm dev:admin     # 管理后台 http://localhost:5174
pnpm dev:backend   # 后端 API http://localhost:3000
```

## 平台功能

| 功能 | 说明 |
|------|------|
| 通知公告 | 培训通知、新能力发布通知，支持定时发布和置顶 |
| AI 课程中心 | 系列课程列表与章节详情 |
| 能力市场 | Skill、MCP 等 AI 研发能力展示与搜索 |
| 优秀案例 | AI 辅助研发最佳实践集锦 |
| 荣誉激励 | 团队荣誉墙展示 |

## 角色权限

| 角色 | 说明 |
|------|------|
| Viewer | 普通员工，登录后浏览所有内容 |
| Editor | 内容编辑，管理被分配模块的内容 |
| Admin | 超级管理员，全权限 + 用户角色分配 |
