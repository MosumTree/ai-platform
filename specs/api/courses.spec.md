# AI 课程 Spec

## 概述

展示团队组织的 AI 系列课程，支持课程分类浏览和章节详情查看，管理后台负责课程及章节的全生命周期管理。

---

## 数据模型

### 课程（Course）

| 字段 | 类型 | 说明 | 约束 |
|------|------|------|------|
| id | number | 主键 | 自增，只读 |
| title | string | 课程标题 | 必填，最长 100 字 |
| description | string | 课程简介 | 必填，最长 500 字 |
| coverUrl | string | 封面图 URL | 必填 |
| category | string | 所属分类 | 必填，如「提示词工程」「MCP 实战」 |
| chaptersCount | number | 章节数量 | 只读，自动统计 |
| status | string | 状态 | draft / published |
| publishedAt | string \| null | 发布时间 | 只读 |
| createdBy | number | 创建者用户 id | 只读 |
| createdAt | string | 创建时间 | 只读 |
| updatedAt | string | 更新时间 | 只读 |

### 课程章节（CourseChapter）

| 字段 | 类型 | 说明 | 约束 |
|------|------|------|------|
| id | number | 主键 | 自增，只读 |
| courseId | number | 所属课程 id | 必填，外键 |
| title | string | 章节标题 | 必填，最长 100 字 |
| sort | number | 排序序号 | 必填，从 1 开始 |
| resourceUrl | string | 资源链接 | 必填 |
| resourceType | string | 资源类型 | video / doc / link |
| duration | number \| null | 时长（秒，仅 video） | 可为空 |
| createdAt | string | 创建时间 | 只读 |

---

## 接口定义

### 获取课程分类列表

```
GET /api/courses/categories
权限: Viewer 及以上
Response: { code: 200, data: string[] }
说明: 返回所有已发布课程涉及的分类列表，去重
```

### 获取已发布课程列表（门户）

```
GET /api/courses
权限: Viewer 及以上
Query: { page?: number, pageSize?: number, category?: string }
Response: {
  code: 200,
  data: { list: Course[], total: number, page: number, pageSize: number }
}
说明: 只返回 status=published 的课程，按 publishedAt 倒序
```

### 获取课程详情（含章节，门户）

```
GET /api/courses/:id
权限: Viewer 及以上
Response: {
  code: 200,
  data: Course & { chapters: CourseChapter[] }
}
错误: 404
说明: chapters 按 sort 升序排列
```

### 获取全部课程列表（管理后台）

```
GET /api/admin/courses
权限: Editor（courses 模块）或 Admin
Query: { page?: number, pageSize?: number, status?: string, category?: string, keyword?: string }
Response: {
  code: 200,
  data: { list: Course[], total: number, page: number, pageSize: number }
}
```

### 创建课程

```
POST /api/admin/courses
权限: Editor（courses 模块）或 Admin
Body: { title: string, description: string, coverUrl: string, category: string }
Response: { code: 201, data: Course }
```

### 更新课程

```
PUT /api/admin/courses/:id
权限: Editor（courses 模块）或 Admin
Body: { title?: string, description?: string, coverUrl?: string, category?: string }
Response: { code: 200, data: Course }
```

### 发布 / 下线课程

```
PATCH /api/admin/courses/:id/status
权限: Editor（courses 模块）或 Admin
Body: { status: 'published' | 'draft' }
Response: { code: 200, data: Course }
```

### 删除课程

```
DELETE /api/admin/courses/:id
权限: Admin
Response: { code: 200, data: null }
说明: 同时删除该课程的所有章节
```

### 获取章节列表

```
GET /api/admin/courses/:id/chapters
权限: Editor（courses 模块）或 Admin
Response: { code: 200, data: CourseChapter[] }
```

### 新增章节

```
POST /api/admin/courses/:id/chapters
权限: Editor（courses 模块）或 Admin
Body: { title: string, sort: number, resourceUrl: string, resourceType: string, duration?: number }
Response: { code: 201, data: CourseChapter }
```

### 更新章节

```
PUT /api/admin/courses/:courseId/chapters/:chapterId
权限: Editor（courses 模块）或 Admin
Body: { title?: string, sort?: number, resourceUrl?: string, resourceType?: string, duration?: number }
Response: { code: 200, data: CourseChapter }
```

### 删除章节

```
DELETE /api/admin/courses/:courseId/chapters/:chapterId
权限: Editor（courses 模块）或 Admin
Response: { code: 200, data: null }
```

---

## 页面/组件行为

### 门户 - 课程列表页

- **顶部分类 Tab**：「全部」+ 动态加载分类列表
- **加载中**：卡片骨架屏，6 个占位
- **成功**：卡片网格（3列桌面/2列平板/1列移动端），每张卡片显示封面图、分类标签、标题、章节数
- **空状态**：「该分类暂无课程」
- **分页**：每页 12 条，底部加载更多按钮

### 门户 - 课程详情页

- 顶部：封面大图、标题、分类、简介
- 左侧：章节目录（有序列表，点击跳转对应资源）
- 章节项：显示序号、标题、资源类型图标（视频/文档/链接）、时长（视频才显示）
- 点击章节：视频类在页内播放器播放；文档/链接类新标签页打开

### 管理后台 - 课程管理页

- 表格：封面缩略图、标题、分类、章节数、状态、发布时间、操作
- 操作：编辑基本信息、管理章节（跳转章节管理页）、发布/下线、删除（Admin）
- 新建/编辑：弹窗表单，包含标题、简介、封面上传、分类输入（带历史分类提示）

### 管理后台 - 章节管理页

- 支持拖拽排序（更新 sort 字段）
- 每行：序号、标题、资源类型、操作（编辑、删除）
- 新增/编辑：弹窗表单

---

## 验收标准（Acceptance Criteria）

- [ ] 门户只展示已发布课程
- [ ] 分类 Tab 动态渲染，不存在已发布课程的分类不出现
- [ ] 课程详情章节按 sort 字段升序排列
- [ ] 视频类章节在页内播放器打开，不跳转新标签
- [ ] 发布课程时，若课程无章节，给出警告提示（但不阻止发布）
- [ ] 管理后台章节拖拽排序后，刷新页面顺序持久化
- [ ] 删除课程时二次确认，确认后同步删除所有章节
