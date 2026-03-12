# 实战实验室（视频教学）Spec

## 概述

实战实验室模块，以视频卡片形式展示 AI 研发实战教程，包含封面图、标题、副标题和视频时长标签。门户首页展示最新 3 条已发布视频，管理后台可完整增删改查。

---

## 数据模型

> 与 `packages/shared/src/index.ts` 中的 `Lab` 类型保持同步

| 字段 | 类型 | 说明 | 约束 |
|------|------|------|------|
| id | number | 主键 | 自增，只读 |
| title | string | 视频标题 | 必填，最长 120 字 |
| subtitle | string | 副标题/一行描述 | 必填，最长 200 字 |
| coverUrl | string | 封面图 URL | 必填 |
| duration | string | 视频时长，如 `12:45` | 必填，最长 10 字 |
| videoUrl | string | 视频播放链接 | 必填 |
| order | number | 排序权重，小数值排前 | 默认 0 |
| isPublished | boolean | 是否已发布（门户可见） | 默认 false |
| createdAt | string | 创建时间 | ISO 8601，只读 |
| updatedAt | string | 更新时间 | ISO 8601，只读 |

---

## 接口定义

### 门户 - 获取已发布视频列表（公开）

```
GET /api/labs
权限: 公开（无需登录）
Query: { page?: number, pageSize?: number }  // 首页默认 pageSize=3
Response: {
  code: 200,
  message: "success",
  data: {
    list: Lab[],   // isPublished=true，按 order ASC、createdAt DESC 排序
    total: number,
    page: number,
    pageSize: number
  }
}
```

### 管理 - 获取全量列表（分页）

```
GET /api/admin/labs
权限: Editor 及以上（暂时免鉴权）
Query: { page?: number, pageSize?: number }
Response: {
  code: 200,
  message: "success",
  data: { list: Lab[], total: number, page: number, pageSize: number }
}
```

### 管理 - 创建视频

```
POST /api/admin/labs
权限: Editor 及以上（暂时免鉴权）
Body: { title, subtitle, coverUrl, duration, videoUrl, order?, isPublished? }
Response: { code: 201, message: "created", data: Lab }
错误: 400 参数校验失败
```

### 管理 - 更新视频

```
PUT /api/admin/labs/:id
权限: Editor 及以上（暂时免鉴权）
Body: 所有字段均为可选
Response: { code: 200, message: "success", data: Lab }
错误: 400 | 404
```

### 管理 - 删除视频

```
DELETE /api/admin/labs/:id
权限: Admin（暂时免鉴权）
Response: { code: 200, message: "success", data: null }
错误: 404
```

---

## 页面/组件行为

### 门户首页「实战实验室」楼层（LabSection.vue）

- **加载中**：3 个骨架卡片占位（16:9 比例）
- **成功**：3 列视频卡片，hover 显示播放图标遮罩，右下角时长标签
- **空状态**：楼层整体不渲染（`v-if="labs.length > 0"`）
- **错误**：静默，楼层不渲染

### 管理后台「实战实验室管理」页面

- **表格**：分页 20 条，列：封面/标题/时长/状态/排序/操作
- **新建/编辑**：弹窗表单，提交后刷新列表
- **删除**：二次确认弹窗（Admin 专属）

---

## 验收标准

- [ ] GET /api/labs 返回 isPublished=true 的列表
- [ ] 门户首页实战实验室楼层有骨架屏，从接口加载 3 条视频
- [ ] 楼层无数据时不渲染
- [ ] 视频卡片 hover 展示播放遮罩
- [ ] Admin 后台可新建、编辑、删除视频，操作后列表刷新
