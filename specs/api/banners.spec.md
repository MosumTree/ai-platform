# Banner 轮播 Spec

## 概述

门户首页顶部的 Banner 轮播模块，支持多条 Banner 配置，通过管理后台进行增删改查，门户端以轮播图形式展示。

---

## 数据模型

| 字段 | 类型 | 说明 | 约束 |
|------|------|------|------|
| id | number | 主键 | 自增，只读 |
| title | string | 标题 | 必填，最长 100 字 |
| description | string | 描述文字 | 选填，最长 200 字 |
| buttonText | string | 按钮文案 | 选填 |
| buttonLink | string | 按钮跳转链接 | 选填 |
| imageUrl | string | 背景图 URL | 必填 |
| tags | string[] | 标签列表 | 选填 |
| order | number | 排序权重，小数值排前 | 默认 0 |
| isActive | boolean | 是否启用 | 默认 true |
| createdAt | string | 创建时间 | ISO 8601，只读 |
| updatedAt | string | 更新时间 | ISO 8601，只读 |

---

## 接口定义

### 门户 - 获取已启用的 Banner 列表

```
GET /api/banners
权限: 无（公开接口）
Response: {
  code: 200,
  data: Banner[]
}
说明: 仅返回 isActive=true 的 Banner，按 order 升序排列
```

### 管理 - 获取全部 Banner 列表

```
GET /api/admin/banners
权限: Editor 及以上
Query: { page?: number, pageSize?: number }
Response: {
  code: 200,
  data: {
    list: Banner[],
    total: number,
    page: number,
    pageSize: number
  }
}
说明: 返回全部 Banner（含 isActive=false），按 order 升序
```

### 管理 - 创建 Banner

```
POST /api/admin/banners
权限: Editor 及以上
Body: {
  title: string,          // 必填
  imageUrl: string,       // 必填
  description?: string,
  buttonText?: string,
  buttonLink?: string,
  tags?: string[],
  order?: number,         // 默认 0
  isActive?: boolean      // 默认 true
}
Response: {
  code: 201,
  data: Banner
}
错误: 400 参数校验失败 | 401 未登录 | 403 权限不足
```

### 管理 - 更新 Banner

```
PUT /api/admin/banners/:id
权限: Editor 及以上
Body: { 同创建，所有字段均为选填 }
Response: {
  code: 200,
  data: Banner
}
错误: 400 | 401 | 403 | 404
```

### 管理 - 删除 Banner

```
DELETE /api/admin/banners/:id
权限: Admin
Response: { code: 200, data: null }
错误: 401 | 403 | 404
```

---

## 页面/组件行为

### 门户 - BannerCarousel 轮播组件

- **加载中**：显示与 Banner 等高的灰色渐变骨架占位块（animate-pulse 效果）
- **成功（多条）**：自动轮播，间隔 5 秒，底部显示圆点指示器，支持手动点击切换，鼠标悬停暂停轮播
- **成功（单条）**：静态展示，无指示器，无自动轮播
- **空状态 / 错误**：不渲染轮播区域，回退展示静态 Hero Banner 内容

### 管理后台 - Banner 管理页

- **表格**：列：背景图缩略图（60×40 预览）、标题、标签、排序值、状态（启用/禁用标签）、操作（编辑/删除）
- **新建/编辑弹窗**：包含全部字段，tags 使用 el-select（允许创建新标签），imageUrl 为 URL 文本框
- **删除**：El-MessageBox 二次确认弹窗

---

## 验收标准（Acceptance Criteria）

- [ ] 门户首页顶部展示轮播 Banner，数据来自 GET /api/banners
- [ ] 多条 Banner 时自动轮播（5 秒间隔），单条时静态展示
- [ ] 鼠标悬停时暂停轮播，移开后继续
- [ ] Banner 加载中显示骨架屏，加载失败时静默回退到静态 Hero
- [ ] 管理后台「Banner 管理」页可查看全部 Banner 列表（含 inactive）
- [ ] 新建 Banner 必须填写 title 和 imageUrl，保存后列表刷新
- [ ] 编辑 Banner 弹窗回填当前数据，保存后列表刷新
- [ ] 删除 Banner 需二次确认，Admin 专属
- [ ] order 字段控制轮播顺序，数值小的排前面
