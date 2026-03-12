# Spec 编写规范

## Spec 文件位置

| 类型 | 路径 | 示例 |
|------|------|------|
| 后端接口 | `specs/api/<模块>.spec.md` | `specs/api/banners.spec.md` |
| 门户页面 | `specs/portal/<页面>.spec.md` | `specs/portal/home.spec.md` |
| 管理页面 | `specs/admin/<页面>.spec.md` | `specs/admin/dashboard.spec.md` |

完整模板见 `specs/_template.spec.md`。

## Spec 必须包含的内容

### 后端接口 Spec

1. **模块概述**：功能说明、业务背景
2. **数据模型**：字段名、类型、说明、示例
3. **接口定义**：每个接口的路径、方法、权限、请求参数、响应示例
4. **错误码**：模块级错误码列表
5. **数据库表设计**：字段定义

### 页面/组件 Spec

1. **页面概述**：用途、访问路径、权限要求
2. **页面结构**：布局描述
3. **组件行为**：加载、成功、空状态、错误四种状态
4. **接口依赖**：调用哪些后端接口

## 接口权限标注

```markdown
- 公开（无需登录）
- 需要登录（Viewer 及以上）
- Editor 及以上
- Admin 专属
```

## Spec 与代码的一致性要求

- 接口路径、HTTP 方法不得与 Spec 不一致
- 字段名不得自行增减（需先更新 Spec）
- 新增字段必须同步更新 `packages/shared/src/index.ts`
