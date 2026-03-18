# 案例百科（Wiki）Spec

## 概述

案例百科模块，以图文卡片展示 AI 研发实战经验的 Wiki 词条，包含封面图、标题、摘要和技术标签。门户首页展示最新 3 条，管理后台可完整增删改查。

---

## 数据模型

> 与 `packages/shared/src/index.ts` 中的 `WikiCase` 类型保持同步

| 字段 | 类型 | 说明 | 约束 |
|------|------|------|------|
| id | number | 主键 | 自增，只读 |
| title | string | 词条标题 | 必填，最长 120 字 |
| summary | string | 摘要（2 行截断展示） | 必填，最长 300 字 |
| coverUrl | string | 封面图 URL | 必填 |
| tags | string[] | 技术标签，如 `["Python", "GPT-4o"]` | 默认 `[]` |
| readUrl | string | 词条阅读链接（可内链，可外链） | 必填 |
| order | number | 排序权重 | 默认 0 |
| isPublished | boolean | 是否已发布（门户可见） | 默认 false |
| createdAt | string | 创建时间 | ISO 8601，只读 |
| updatedAt | string | 更新时间 | ISO 8601，只读 |

---

## 接口定义

### 门户 - 获取已发布案例列表（公开）

```
GET /rest/cbc/aiplatform/wiki-cases
权限: 公开（无需登录）
Query: { page?: number, pageSize?: number }  // 首页默认 pageSize=3
Response: {
  code: 200,
  message: "success",
  data: {
    list: WikiCase[],   // isPublished=true，按 order ASC、createdAt DESC 排序
    total: number,
    page: number,
    pageSize: number
  }
}
```

### 管理 - 获取全量列表（分页）

```
GET /rest/cbc/aiplatform/admin/wiki-cases
权限: Editor 及以上（暂时免鉴权）
Query: { page?: number, pageSize?: number }
Response: {
  code: 200,
  message: "success",
  data: { list: WikiCase[], total: number, page: number, pageSize: number }
}
```

### 管理 - 创建词条

```
POST /rest/cbc/aiplatform/admin/wiki-cases
权限: Editor 及以上（暂时免鉴权）
Body: { title, summary, coverUrl, tags?, readUrl, order?, isPublished? }
Response: { code: 201, message: "created", data: WikiCase }
错误: 400 参数校验失败
```

### 管理 - 更新词条

```
PUT /rest/cbc/aiplatform/admin/wiki-cases/:id
权限: Editor 及以上（暂时免鉴权）
Body: 所有字段均为可选
Response: { code: 200, message: "success", data: WikiCase }
错误: 400 | 404
```

### 管理 - 删除词条

```
DELETE /rest/cbc/aiplatform/admin/wiki-cases/:id
权限: Admin（暂时免鉴权）
Response: { code: 200, message: "success", data: null }
错误: 404
```

---

## 页面/组件行为

### 门户首页「案例百科」楼层（WikiCaseSection.vue）

- **加载中**：3 个骨架卡片占位（h-48 封面区 + 内容区）
- **成功**：3 列图文卡片，hover 封面显示「阅读百科词条」遮罩；下方展示标题、摘要（2 行截断）、标签
- **空状态**：楼层整体不渲染（`v-if="cases.length > 0"`）
- **错误**：静默，楼层不渲染

### 管理后台「案例百科管理」页面

- **表格**：分页 20 条，列：封面/标题/标签/状态/操作
- **新建/编辑**：弹窗表单，提交后刷新列表
- **删除**：二次确认弹窗（Admin 专属）

---

## 验收标准

- [ ] GET /rest/cbc/aiplatform/wiki-cases 返回 isPublished=true 的列表
- [ ] 门户首页案例百科楼层有骨架屏，从接口加载 3 条词条
- [ ] 楼层无数据时不渲染
- [ ] 词条卡片 hover 封面显示遮罩文字「阅读百科词条」
- [ ] Admin 后台可新建、编辑、删除词条，操作后列表刷新
