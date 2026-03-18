# [模块名称] Spec

> 复制此文件到对应目录，将 [模块名称] 替换为实际功能名称

## 概述

一句话描述该功能的目的和业务价值。

---

## 数据模型

> 与 `packages/shared/src/index.ts` 中的类型定义保持同步

| 字段 | 类型 | 说明 | 约束 |
|------|------|------|------|
| id | number | 主键 | 自增，只读 |
| title | string | 标题 | 必填，最长 100 字 |
| createdAt | string | 创建时间 | ISO 8601 格式，只读 |
| updatedAt | string | 更新时间 | ISO 8601 格式，只读 |

---

## 接口定义

> 后端实现必须严格遵守此处定义的路径、方法、参数名和响应结构

### 获取列表

```
GET /rest/cbc/aiplatform/[resource]
权限: Viewer 及以上
Query: { page?: number, pageSize?: number }
Response: {
  code: 200,
  data: {
    list: [模型][]
    total: number
    page: number
    pageSize: number
  }
}
```

### 获取详情

```
GET /rest/cbc/aiplatform/[resource]/:id
权限: Viewer 及以上
Response: {
  code: 200,
  data: [模型]
}
错误: 404 资源不存在
```

### 创建

```
POST /rest/cbc/aiplatform/[resource]
权限: Editor 及以上
Body: { title: string, ... }
Response: {
  code: 201,
  data: [模型]
}
错误: 400 参数校验失败 | 401 未登录 | 403 权限不足
```

### 更新

```
PUT /rest/cbc/aiplatform/[resource]/:id
权限: Editor 及以上（只能更新自己负责模块的内容，Admin 无限制）
Body: { title?: string, ... }
Response: {
  code: 200,
  data: [模型]
}
错误: 400 | 401 | 403 | 404
```

### 删除

```
DELETE /rest/cbc/aiplatform/[resource]/:id
权限: Admin
Response: { code: 200, data: null }
错误: 401 | 403 | 404
```

---

## 页面/组件行为

> 前端实现必须覆盖以下所有状态

### [列表页名称]

- **加载中**：显示骨架屏，卡片占位 6 个
- **成功**：卡片列表，每项显示 [字段1]、[字段2]、[字段3]
- **空状态**：显示「暂无内容，敬请期待」图标和文案
- **错误**：显示 Toast「加载失败，请刷新重试」

### [详情页名称]

- **加载中**：显示骨架屏
- **成功**：显示完整内容
- **错误/不存在**：显示 404 提示页，提供「返回」按钮

### [管理页面（如有）]

- **表格**：分页展示，每页 20 条，支持按 [字段] 搜索
- **新建/编辑**：弹窗表单，提交后刷新列表
- **删除**：二次确认弹窗，确认后执行

---

## 验收标准（Acceptance Criteria）

> 每条验收标准对应一个可测试的行为，开发完成后逐条勾选

- [ ] 未登录用户访问任意页面，自动跳转企业 SSO 登录
- [ ] Viewer 角色可以查看列表和详情，无新建/编辑/删除按钮
- [ ] Editor 角色可以新建和编辑内容，无删除按钮
- [ ] Admin 角色可以执行所有操作
- [ ] 列表页按 [排序字段] 倒序排列，每页 [N] 条，支持翻页
- [ ] 表单提交时校验必填字段，不合法时高亮提示对应字段
- [ ] 删除操作需要二次确认，确认后执行并更新列表
- [ ] 接口异常时显示 Toast 错误提示，不崩溃白屏
