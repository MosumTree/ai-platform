# 优秀案例 Spec

## 概述

展示团队内 AI 辅助研发的最佳实践集锦，激励成员学习和借鉴，管理后台支持审核流程保证内容质量。

---

## 数据模型

| 字段 | 类型 | 说明 | 约束 |
|------|------|------|------|
| id | number | 主键 | 自增，只读 |
| title | string | 案例标题 | 必填，最长 100 字 |
| summary | string | 摘要 | 必填，最长 300 字 |
| content | string | 正文（富文本） | 必填 |
| coverUrl | string | 封面图 URL | 可为空 |
| tags | string[] | 标签列表 | 可为空 |
| author | string | 作者姓名 | 必填 |
| authorAvatar | string \| null | 作者头像 | 可为空 |
| status | string | 状态 | draft / reviewing / published / rejected |
| rejectReason | string \| null | 拒绝原因 | 仅 rejected 时有值 |
| publishedAt | string \| null | 发布时间 | 只读 |
| createdBy | number | 创建者用户 id | 只读 |
| createdAt | string | 创建时间 | 只读 |

---

## 接口定义

### 获取已发布案例列表（门户）

```
GET /rest/cbc/aiplatform/cases
权限: Viewer 及以上
Query: { page?: number, pageSize?: number, tags?: string, keyword?: string }
Response: {
  code: 200,
  data: { list: Case[], total: number, page: number, pageSize: number }
}
说明: 只返回 status=published，按 publishedAt 倒序
```

### 获取案例详情（门户）

```
GET /rest/cbc/aiplatform/cases/:id
权限: Viewer 及以上
Response: { code: 200, data: Case }
错误: 404
```

### 获取全部案例列表（管理后台）

```
GET /rest/cbc/aiplatform/admin/cases
权限: Editor（cases 模块）或 Admin
Query: { page?: number, pageSize?: number, status?: string, keyword?: string }
Response: { code: 200, data: { list: Case[], total: number, page: number, pageSize: number } }
```

### 创建案例

```
POST /rest/cbc/aiplatform/admin/cases
权限: Editor（cases 模块）或 Admin
Body: { title: string, summary: string, content: string, coverUrl?: string, tags?: string[], author: string, authorAvatar?: string }
Response: { code: 201, data: Case }
说明: 创建后状态为 draft
```

### 提交审核

```
PATCH /rest/cbc/aiplatform/admin/cases/:id/submit
权限: Editor（cases 模块）或 Admin
Response: { code: 200, data: Case }
说明: draft → reviewing
```

### 审核通过 / 拒绝

```
PATCH /rest/cbc/aiplatform/admin/cases/:id/review
权限: Admin
Body: { action: 'approve' | 'reject', rejectReason?: string }
Response: { code: 200, data: Case }
说明: approve → published；reject → rejected（需填写 rejectReason）
```

### 更新案例

```
PUT /rest/cbc/aiplatform/admin/cases/:id
权限: Editor（cases 模块）或 Admin
Body: { title?: string, summary?: string, content?: string, ... }
Response: { code: 200, data: Case }
说明: 只有 draft / rejected 状态可以编辑
```

### 删除案例

```
DELETE /rest/cbc/aiplatform/admin/cases/:id
权限: Admin
Response: { code: 200, data: null }
```

---

## 页面/组件行为

### 门户 - 案例集锦页

- **筛选区**：标签多选 + 关键字搜索
- **列表**：卡片网格（3列），每张卡片：封面图（无封面时显示渐变占位）、标签、标题、摘要、作者头像和姓名、发布时间
- **点击卡片**：跳转案例详情页

### 门户 - 案例详情页

- 顶部：封面图（可选）、标题、作者、发布时间、标签
- 正文：富文本渲染
- 底部：「返回列表」按钮

### 管理后台 - 案例管理页

- 表格：标题、作者、标签、状态（彩色标签）、创建时间、操作
- 操作：查看、编辑（draft/rejected）、提交审核（draft）、审核（reviewing，仅 Admin）、删除（Admin）
- 审核弹窗：通过按钮 + 拒绝（需填拒绝原因）

---

## 验收标准（Acceptance Criteria）

- [ ] 门户只显示 published 状态的案例
- [ ] reviewing 状态不可编辑，需先撤回审核（可选功能）
- [ ] reject 时必须填写拒绝原因，否则无法提交
- [ ] Editor 提交审核后，状态流转为 reviewing，编辑按钮消失
- [ ] Admin 审核通过后，门户立即可见（无缓存延迟超过 1 秒）
