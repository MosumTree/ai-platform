# 工具指导 Spec

## 概述

工具指导模块，用于展示和管理 AI 研发工具的安装入口与使用指南卡片。门户首页以 4 列卡片形式展示启用的工具，管理后台可对工具进行完整的增删改查操作。

---

## 数据模型

> 与 `packages/shared/src/index.ts` 中的 `ToolGuide` 类型保持同步

| 字段 | 类型 | 说明 | 约束 |
|------|------|------|------|
| id | number | 主键 | 自增，只读 |
| name | string | 工具名称 | 必填，最长 100 字 |
| desc | string | 工具描述 | 必填，最长 300 字 |
| icon | string | 图标（emoji 或图标名） | 必填 |
| iconColor | string | 图标颜色（CSS color） | 必填，如 `#3b82f6` |
| installUrl | string | 安装入口链接 | 必填 |
| guideUrl | string | 用户指南链接 | 必填 |
| order | number | 排序权重，小数值排前 | 默认 0 |
| isActive | boolean | 是否在门户展示 | 默认 true |
| createdAt | string | 创建时间 | ISO 8601，只读 |
| updatedAt | string | 更新时间 | ISO 8601，只读 |

---

## 接口定义

### 门户 - 获取已启用工具列表（公开）

```
GET /rest/cbc/aiplatform/tool-guides
权限: 公开（无需登录）
Response: {
  code: 200,
  message: "success",
  data: ToolGuide[]  // isActive=true，按 order ASC 排序
}
```

### 管理 - 获取全量列表（分页）

```
GET /rest/cbc/aiplatform/admin/tool-guides
权限: Editor 及以上（暂时免鉴权）
Query: { page?: number, pageSize?: number }
Response: {
  code: 200,
  message: "success",
  data: {
    list: ToolGuide[],
    total: number,
    page: number,
    pageSize: number
  }
}
```

### 管理 - 创建工具

```
POST /rest/cbc/aiplatform/admin/tool-guides
权限: Editor 及以上（暂时免鉴权）
Body: {
  name: string,        // 必填
  desc: string,        // 必填
  icon: string,        // 必填
  iconColor: string,   // 必填
  installUrl: string,  // 必填
  guideUrl: string,    // 必填
  order?: number,
  isActive?: boolean
}
Response: { code: 201, message: "created", data: ToolGuide }
错误: 400 参数校验失败
```

### 管理 - 更新工具

```
PUT /rest/cbc/aiplatform/admin/tool-guides/:id
权限: Editor 及以上（暂时免鉴权）
Body: CreateToolGuideDto 的所有字段均为可选
Response: { code: 200, message: "success", data: ToolGuide }
错误: 400 | 404 工具不存在
```

### 管理 - 删除工具

```
DELETE /rest/cbc/aiplatform/admin/tool-guides/:id
权限: Admin（暂时免鉴权）
Response: { code: 200, message: "success", data: null }
错误: 404 工具不存在
```

---

## 页面/组件行为

### 门户首页「工具指导」楼层（ToolGuide.vue）

- **加载中**：显示 4 个骨架卡片占位
- **成功**：4 列卡片，每张展示 icon/name/desc/安装入口/用户指南
- **空状态**：楼层整体不渲染（`v-if="tools.length > 0"`）
- **错误**：静默，楼层不渲染

### 管理后台「工具指导管理」页面

- **表格**：分页展示，每页 20 条，列：名称/图标/描述/排序/状态/操作
- **新建/编辑**：弹窗表单，提交后刷新列表
- **删除**：二次确认弹窗（Admin 专属按钮）

---

## 验收标准

- [ ] GET /rest/cbc/aiplatform/tool-guides 返回 isActive=true 的工具列表，按 order ASC 排序
- [ ] 门户首页工具指导楼层从接口加载数据，有骨架屏过渡
- [ ] 楼层无数据时不显示
- [ ] Admin 后台可新建、编辑、删除工具，操作后列表刷新
- [ ] 删除操作有二次确认弹窗
