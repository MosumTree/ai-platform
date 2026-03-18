# AI 风向标 Spec

## 概述

AI 风向标模块，展示 AI 行业最新动态、技术突破和产品发布等新闻资讯，帮助用户及时了解 AI 领域的前沿趋势。

---

## 数据模型

| 字段 | 类型 | 说明 | 约束 |
|------|------|------|------|
| id | number | 主键 | 自增，只读 |
| title | string | 新闻标题 | 必填，最长 200 字 |
| summary | string | 内容摘要 | 必填，最长 500 字 |
| icon | string | 图标（Material Symbol 名称） | 默认 "bolt" |
| source | string | 来源网站/媒体 | 必填 |
| sourceUrl | string | 原文链接 | 必填 |
| publishDate | string | 发布日期 | ISO 8601 |
| isActive | boolean | 是否展示 | 默认 true |
| order | number | 排序权重 | 默认 0 |
| createdAt | string | 创建时间 | ISO 8601，只读 |
| updatedAt | string | 更新时间 | ISO 8601，只读 |

---

## 接口定义

### 门户 - 获取最新动态列表

```
GET /rest/cbc/aiplatform/ai-trends
权限: 公开（无需登录）
Query: { page?: number, pageSize?: number, limit?: number }
Response: {
  code: 200,
  message: "success",
  data: {
    list: AiTrend[],
    total: number,
    page: number,
    pageSize: number
  }
}
说明: 只返回 isActive=true，按 order ASC、publishDate DESC 排序，首页默认 limit=5
```

### 管理 - 获取全量列表（分页）

```
GET /rest/cbc/aiplatform/admin/ai-trends
权限: Editor 及以上（暂时免鉴权）
Query: { page?: number, pageSize?: number, keyword?: string }
Response: {
  code: 200,
  message: "success",
  data: { list: AiTrend[], total: number, page: number, pageSize: number }
}
```

### 管理 - 创建动态

```
POST /rest/cbc/aiplatform/admin/ai-trends
权限: Editor 及以上（暂时免鉴权）
Body: {
  title: string,        // 必填
  summary: string,      // 必填
  icon?: string,        // 默认 "bolt"
  source: string,       // 必填
  sourceUrl: string,    // 必填
  publishDate?: string, // ISO 8601，默认当前时间
  order?: number,
  isActive?: boolean
}
Response: { code: 201, message: "created", data: AiTrend }
错误: 400 参数校验失败
```

### 管理 - 更新动态

```
PUT /rest/cbc/aiplatform/admin/ai-trends/:id
权限: Editor 及以上（暂时免鉴权）
Body: 所有字段均为可选
Response: { code: 200, message: "success", data: AiTrend }
错误: 400 | 404
```

### 管理 - 删除动态

```
DELETE /rest/cbc/aiplatform/admin/ai-trends/:id
权限: Admin（暂时免鉴权）
Response: { code: 200, message: "success", data: null }
错误: 404
```

---

## 页面/组件行为

### 门户首页「AI 风向标」楼层（AiTrendSection.vue）

- **加载中**: 3 个骨架卡片占位
- **成功**: 列表展示，每项显示：图标、标题（加粗）、摘要（2 行截断）、发布时间、详情链接
- **空状态**: 楼层整体不渲染（`v-if="list.length > 0"`）
- **错误**: 静默，楼层不渲染
- **交互**: 点击标题或"详情"跳转 sourceUrl（新标签页打开）

### 管理后台「AI 风向标管理」页面

- **表格**: 分页 20 条，列：标题/来源/发布日期/状态/排序/操作
- **新建/编辑**: 弹窗表单，字段：标题、摘要、图标选择、来源、原文链接、发布日期、排序、启用状态
- **删除**: 二次确认弹窗（Admin 专属）

---

## 验收标准

- [ ] GET /rest/cbc/aiplatform/ai-trends 返回 isActive=true 的列表
- [ ] 门户首页 AI 风向标楼层有骨架屏，从接口加载 5 条最新动态
- [ ] 楼层无数据时不渲染
- [ ] 点击标题或详情链接在新标签页打开原文
- [ ] Admin 后台可新建、编辑、删除动态，操作后列表刷新
