# 荣誉激励 Spec

## 概述

展示团队成员在 AI 辅助研发方面获得的荣誉和激励，通过荣誉墙形式增强团队成就感，管理后台维护荣誉记录。

---

## 数据模型

| 字段 | 类型 | 说明 | 约束 |
|------|------|------|------|
| id | number | 主键 | 自增，只读 |
| recipientName | string | 获奖人姓名 | 必填 |
| recipientAvatar | string \| null | 获奖人头像 URL | 可为空 |
| honorTitle | string | 荣誉标题 | 必填，最长 100 字 |
| honorLevel | string | 荣誉等级 | gold / silver / bronze / special |
| description | string | 荣誉描述 | 必填，最长 300 字 |
| coverUrl | string \| null | 荣誉配图 | 可为空 |
| awardedAt | string | 颁奖时间 | 必填，ISO 8601 |
| visible | boolean | 是否在门户显示 | 默认 true |
| createdBy | number | 创建者用户 id | 只读 |
| createdAt | string | 创建时间 | 只读 |

---

## 接口定义

### 获取荣誉列表（门户）

```
GET /rest/cbc/aiplatform/honors
权限: Viewer 及以上
Query: { page?: number, pageSize?: number }
Response: {
  code: 200,
  data: { list: Honor[], total: number, page: number, pageSize: number }
}
说明: 只返回 visible=true 的记录，按 awardedAt 倒序
```

### 获取全部荣誉列表（管理后台）

```
GET /rest/cbc/aiplatform/admin/honors
权限: Editor（honors 模块）或 Admin
Query: { page?: number, pageSize?: number, keyword?: string }
Response: { code: 200, data: { list: Honor[], total: number, page: number, pageSize: number } }
```

### 创建荣誉记录

```
POST /rest/cbc/aiplatform/admin/honors
权限: Editor（honors 模块）或 Admin
Body: { recipientName: string, recipientAvatar?: string, honorTitle: string, honorLevel: string, description: string, coverUrl?: string, awardedAt: string, visible?: boolean }
Response: { code: 201, data: Honor }
```

### 更新荣誉记录

```
PUT /rest/cbc/aiplatform/admin/honors/:id
权限: Editor（honors 模块）或 Admin
Body: Partial<创建参数>
Response: { code: 200, data: Honor }
```

### 删除荣誉记录

```
DELETE /rest/cbc/aiplatform/admin/honors/:id
权限: Admin
Response: { code: 200, data: null }
```

---

## 页面/组件行为

### 门户 - 荣誉墙页

- **布局**：卡片网格（4列桌面/2列移动端），金色 > 银色 > 铜色 > 特别荣誉排序
- **卡片内容**：荣誉等级徽章（颜色区分）、配图（可选）、荣誉标题、获奖人头像和姓名、颁奖时间、描述摘要
- **加载中**：骨架屏 8 个占位

### 管理后台 - 荣誉管理页

- 表格：获奖人、荣誉标题、等级、颁奖时间、是否显示、操作
- 操作：编辑、显示/隐藏切换、删除（Admin）
- 新建/编辑：弹窗表单

---

## 验收标准（Acceptance Criteria）

- [ ] visible=false 的记录在门户不可见
- [ ] 同等级荣誉按 awardedAt 倒序排列
- [ ] 切换显示/隐藏后门户立即生效
- [ ] 荣誉等级用不同颜色的徽章直观区分（金/银/铜/特别）
