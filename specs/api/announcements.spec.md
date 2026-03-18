# 通知公告 Spec

## 概述

承载团队培训通知、新能力发布通知等内部公告，支持置顶、定时发布，门户展示最新公告，管理后台管理公告的全生命周期。

---

## 数据模型

| 字段 | 类型 | 说明 | 约束 |
|------|------|------|------|
| id | number | 主键 | 自增，只读 |
| title | string | 标题 | 必填，最长 100 字 |
| content | string | 正文（富文本 HTML） | 必填 |
| type | string | 类型 | training / capability / general |
| pinned | boolean | 是否置顶 | 默认 false |
| status | string | 状态 | draft / scheduled / published / offline |
| scheduledAt | string \| null | 定时发布时间 | ISO 8601，可为空 |
| publishedAt | string \| null | 实际发布时间 | 只读 |
| createdBy | number | 创建者用户 id | 只读 |
| createdAt | string | 创建时间 | 只读 |
| updatedAt | string | 更新时间 | 只读 |

### 公告类型

| type | 说明 |
|------|------|
| training | 培训通知 |
| capability | 新能力发布通知 |
| general | 其他通知 |

---

## 接口定义

### 获取已发布公告列表（门户）

```
GET /rest/cbc/aiplatform/announcements
权限: Viewer 及以上
Query: { page?: number, pageSize?: number, type?: string }
Response: {
  code: 200,
  data: {
    list: Announcement[],
    total: number,
    page: number,
    pageSize: number
  }
}
说明: 只返回 status=published 的公告，置顶公告排在最前，其余按 publishedAt 倒序
```

### 获取公告详情（门户）

```
GET /rest/cbc/aiplatform/announcements/:id
权限: Viewer 及以上
Response: { code: 200, data: Announcement }
错误: 404 公告不存在或未发布
```

### 获取全部公告列表（管理后台）

```
GET /rest/cbc/aiplatform/admin/announcements
权限: Editor（announcements 模块）或 Admin
Query: { page?: number, pageSize?: number, status?: string, type?: string, keyword?: string }
Response: {
  code: 200,
  data: { list: Announcement[], total: number, page: number, pageSize: number }
}
说明: 返回所有状态的公告，支持按标题关键字搜索
```

### 创建公告

```
POST /rest/cbc/aiplatform/admin/announcements
权限: Editor（announcements 模块）或 Admin
Body: { title: string, content: string, type: string, pinned?: boolean, scheduledAt?: string }
Response: { code: 201, data: Announcement }
错误: 400 参数校验失败
```

### 更新公告

```
PUT /rest/cbc/aiplatform/admin/announcements/:id
权限: Editor（announcements 模块）或 Admin
Body: { title?: string, content?: string, type?: string, pinned?: boolean, scheduledAt?: string }
Response: { code: 200, data: Announcement }
错误: 400 | 403 | 404
```

### 发布 / 下线公告

```
PATCH /rest/cbc/aiplatform/admin/announcements/:id/status
权限: Editor（announcements 模块）或 Admin
Body: { status: 'published' | 'offline' }
Response: { code: 200, data: Announcement }
```

### 删除公告

```
DELETE /rest/cbc/aiplatform/admin/announcements/:id
权限: Admin
Response: { code: 200, data: null }
错误: 403 | 404
```

---

## 页面/组件行为

### 门户 - 公告列表页

- **加载中**：显示 5 条骨架屏列表项
- **成功**：列表展示，每项显示 [类型标签]、标题、发布时间；置顶公告有「置顶」角标
- **分类筛选**：顶部 Tab 切换全部/培训通知/能力发布/其他
- **点击**：跳转公告详情页
- **空状态**：「暂无公告」
- **分页**：每页 10 条，底部分页器

### 门户 - 公告详情页

- 显示标题、类型标签、发布时间、正文（富文本渲染）
- 底部「返回列表」按钮

### 管理后台 - 公告管理页

- 表格展示：标题、类型、状态、置顶、发布时间、操作列
- 顶部：搜索框（标题）+ 状态筛选 + 类型筛选 + 「新建公告」按钮
- 操作列：编辑（草稿/已发布均可）、发布/下线切换、删除（Admin 可见）
- 新建/编辑：右侧抽屉表单，包含标题、类型、正文（富文本编辑器）、置顶开关、定时发布时间选择器

---

## 验收标准（Acceptance Criteria）

- [ ] 门户公告列表只显示已发布状态的公告
- [ ] 置顶公告始终排在列表最前面，多个置顶按发布时间倒序
- [ ] 类型筛选 Tab 切换，列表实时更新，无需刷新页面
- [ ] 设置定时发布时间后，到达时间自动变为已发布状态
- [ ] Editor 角色只看到被授权模块，能新建、编辑、发布/下线公告，无删除按钮
- [ ] Admin 可删除公告，删除前弹出二次确认
- [ ] 富文本内容在门户正确渲染，防止 XSS 注入
- [ ] 标题超过 100 字时，表单提交校验不通过并提示
