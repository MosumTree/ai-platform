# 能力市场 Spec

## 概述

集中展示团队积累的 AI 研发能力，包括 Skill（AI 技能/提示词模板）和 MCP（Model Context Protocol 工具），员工可浏览、搜索和查看详情，管理后台负责词条的维护。

---

## 数据模型

| 字段 | 类型 | 说明 | 约束 |
|------|------|------|------|
| id | number | 主键 | 自增，只读 |
| name | string | 能力名称 | 必填，最长 50 字 |
| description | string | 简短描述 | 必填，最长 200 字 |
| detail | string | 详细说明（富文本） | 可为空 |
| type | string | 类型 | skill / mcp / other |
| tags | string[] | 标签列表 | 可为空数组 |
| documentUrl | string | 文档链接 | 可为空 |
| repoUrl | string \| null | 代码仓库链接 | 可为空 |
| status | string | 状态 | active / deprecated |
| createdBy | number | 创建者用户 id | 只读 |
| createdAt | string | 创建时间 | 只读 |
| updatedAt | string | 更新时间 | 只读 |

---

## 接口定义

### 获取能力列表（门户）

```
GET /rest/cbc/aiplatform/capabilities
权限: Viewer 及以上
Query: { page?: number, pageSize?: number, type?: string, tags?: string, keyword?: string }
Response: {
  code: 200,
  data: { list: CapabilityItem[], total: number, page: number, pageSize: number }
}
说明: 只返回 status=active 的词条，按 createdAt 倒序；tags 支持逗号分隔多值
```

### 获取能力详情（门户）

```
GET /rest/cbc/aiplatform/capabilities/:id
权限: Viewer 及以上
Response: { code: 200, data: CapabilityItem }
错误: 404
```

### 获取所有标签

```
GET /rest/cbc/aiplatform/capabilities/tags
权限: Viewer 及以上
Response: { code: 200, data: string[] }
说明: 返回所有 active 词条涉及的标签，去重排序
```

### 获取全部能力列表（管理后台）

```
GET /rest/cbc/aiplatform/admin/capabilities
权限: Editor（capabilities 模块）或 Admin
Query: { page?: number, pageSize?: number, type?: string, status?: string, keyword?: string }
Response: {
  code: 200,
  data: { list: CapabilityItem[], total: number, page: number, pageSize: number }
}
```

### 创建能力词条

```
POST /rest/cbc/aiplatform/admin/capabilities
权限: Editor（capabilities 模块）或 Admin
Body: { name: string, description: string, type: string, tags?: string[], documentUrl?: string, repoUrl?: string, detail?: string }
Response: { code: 201, data: CapabilityItem }
```

### 更新能力词条

```
PUT /rest/cbc/aiplatform/admin/capabilities/:id
权限: Editor（capabilities 模块）或 Admin
Body: { name?: string, description?: string, type?: string, tags?: string[], documentUrl?: string, repoUrl?: string, detail?: string, status?: string }
Response: { code: 200, data: CapabilityItem }
```

### 删除能力词条

```
DELETE /rest/cbc/aiplatform/admin/capabilities/:id
权限: Admin
Response: { code: 200, data: null }
```

---

## 页面/组件行为

### 门户 - 能力市场页

- **顶部筛选区**：类型切换（全部 / Skill / MCP / 其他）+ 标签多选 + 关键字搜索框
- **加载中**：卡片骨架屏，8 个占位（4列）
- **成功**：卡片网格（4列桌面/2列移动端），每张卡片显示：类型徽标、名称、描述摘要、标签列表（最多显示 3 个）
- **空状态**：「未找到匹配的能力，尝试清空筛选条件」
- **点击卡片**：展开详情抽屉（右侧滑出），显示完整详情、文档链接、仓库链接

### 管理后台 - 能力市场管理页

- 表格：名称、类型、标签（最多 3 个 + 更多）、状态、创建时间、操作
- 操作：编辑、废弃（active → deprecated）、恢复（deprecated → active）、删除（Admin）
- 新建/编辑：抽屉表单，包含名称、描述、类型、标签（输入添加）、文档链接、仓库链接、详情（富文本）

---

## 验收标准（Acceptance Criteria）

- [ ] 门户只展示 status=active 的词条
- [ ] 类型和标签筛选可以同时生效（AND 逻辑）
- [ ] 关键字搜索匹配名称和描述字段
- [ ] 卡片标签超过 3 个时显示「+N」，详情弹窗显示全部标签
- [ ] 文档链接和仓库链接点击在新标签页打开
- [ ] 废弃后的词条在门户立即不可见，无需刷新
