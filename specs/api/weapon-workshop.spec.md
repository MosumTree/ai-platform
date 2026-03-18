# 百工武器坊 Spec

## 概述

百工武器坊模块，按类别展示各类 AI 研发工具/武器，如需求设计、代码生成、测试等，帮助开发者快速找到合适的 AI 工具提升研发效率。

---

## 数据模型

### 分类（WeaponCategory）

| 字段 | 类型 | 说明 | 约束 |
|------|------|------|------|
| id | number | 主键 | 自增，只读 |
| name | string | 分类名称 | 必填，如"前端开发利器" |
| icon | string | 图标（Material Symbol 名称） | 默认 "construction" |
| description | string | 分类描述 | 如"全流程 AI 加持" |
| order | number | 排序权重 | 默认 0 |
| isActive | boolean | 是否展示 | 默认 true |
| createdAt | string | 创建时间 | ISO 8601，只读 |
| updatedAt | string | 更新时间 | ISO 8601，只读 |

### 武器工具（WeaponItem）

| 字段 | 类型 | 说明 | 约束 |
|------|------|------|------|
| id | number | 主键 | 自增，只读 |
| categoryId | number | 所属分类 ID | 必填，外键 |
| name | string | 武器名称 | 必填，如 "SDD 需求设计" |
| description | string | 功能描述 | 必填 |
| icon | string | 图标（Material Symbol 名称） | 可选 |
| order | number | 排序权重 | 默认 0 |
| isActive | boolean | 是否展示 | 默认 true |
| createdAt | string | 创建时间 | ISO 8601，只读 |
| updatedAt | string | 更新时间 | ISO 8601，只读 |

---

## 接口定义

### 门户 - 获取武器坊数据（分类+武器列表）

```
GET /rest/cbc/aiplatform/weapon-workshop
权限: 公开（无需登录）
Query: { categoryLimit?: number, itemLimit?: number }  // 首页默认 1 个分类，展示 2-3 个武器
Response: {
  code: 200,
  message: "success",
  data: {
    categories: [
      {
        id: number,
        name: string,
        icon: string,
        description: string,
        items: WeaponItem[]  // 该分类下的武器列表
      }
    ]
  }
}
说明: 只返回 isActive=true 的分类和武器，分类按 order ASC，武器按 order ASC
```

### 管理 - 获取分类列表

```
GET /rest/cbc/aiplatform/admin/weapon-categories
权限: Editor 及以上（暂时免鉴权）
Query: { page?: number, pageSize?: number }
Response: { code: 200, data: { list: WeaponCategory[], total, page, pageSize } }
```

### 管理 - 创建分类

```
POST /rest/cbc/aiplatform/admin/weapon-categories
权限: Editor 及以上
Body: { name: string, icon?: string, description?: string, order?: number, isActive?: boolean }
Response: { code: 201, data: WeaponCategory }
```

### 管理 - 更新分类

```
PUT /rest/cbc/aiplatform/admin/weapon-categories/:id
权限: Editor 及以上
Body: 所有字段可选
Response: { code: 200, data: WeaponCategory }
```

### 管理 - 删除分类

```
DELETE /rest/cbc/aiplatform/admin/weapon-categories/:id
权限: Admin
说明: 删除分类时，该分类下的所有武器也会被删除
Response: { code: 200, data: null }
```

### 管理 - 获取武器列表（按分类）

```
GET /rest/cbc/aiplatform/admin/weapon-categories/:id/items
权限: Editor 及以上
Response: { code: 200, data: WeaponItem[] }
```

### 管理 - 创建武器

```
POST /rest/cbc/aiplatform/admin/weapon-items
权限: Editor 及以上
Body: { categoryId: number, name: string, description: string, icon?: string, order?: number, isActive?: boolean }
Response: { code: 201, data: WeaponItem }
```

### 管理 - 更新武器

```
PUT /rest/cbc/aiplatform/admin/weapon-items/:id
权限: Editor 及以上
Body: 所有字段可选
Response: { code: 200, data: WeaponItem }
```

### 管理 - 删除武器

```
DELETE /rest/cbc/aiplatform/admin/weapon-items/:id
权限: Editor 及以上
Response: { code: 200, data: null }
```

---

## 页面/组件行为

### 门户首页「百工武器坊」楼层（WeaponWorkshopSection.vue）

- **加载中**: 骨架卡片占位
- **成功**: 展示一个分类卡片（右侧楼层样式）：
  - 分类标题栏：图标 + 分类名 + 描述
  - 武器列表：每个武器显示名称（primary 色加粗）+ 描述（小字）
  - "进入武器库" 按钮
- **空状态**: 楼层整体不渲染
- **错误**: 静默，楼层不渲染
- **交互**: 点击武器项或按钮可跳转到工具列表页（预留）

### 管理后台「百工武器坊管理」页面

- **分类管理**:
  - 表格：分类名/图标/描述/排序/操作
  - 新建/编辑：弹窗表单
  - 删除：二次确认（Admin）
  
- **武器管理（按分类筛选）**:
  - 表格：名称/所属分类/描述/排序/操作
  - 新建/编辑：弹窗表单，需选择所属分类
  - 删除：二次确认

---

## 验收标准

- [ ] GET /rest/cbc/aiplatform/weapon-workshop 返回分类和武器数据
- [ ] 门户首页百工武器坊楼层有骨架屏，展示第一个分类及其武器
- [ ] 楼层无数据时不渲染
- [ ] 武器项 hover 有高亮效果
- [ ] Admin 后台可管理分类和武器，支持增删改查
- [ ] 删除分类时级联删除该分类下的所有武器
