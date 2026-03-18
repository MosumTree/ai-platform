# 认证与权限 Spec

## 概述

基于企业 SSO 的统一认证体系，所有用户（门户和管理后台）通过企业统一身份登录，后端签发 JWT，通过角色控制访问权限。

---

## 数据模型

| 字段 | 类型 | 说明 | 约束 |
|------|------|------|------|
| id | number | 用户主键 | 自增，只读 |
| employeeId | string | 企业工号 | 唯一，来自 SSO |
| name | string | 姓名 | 来自 SSO |
| avatar | string | 头像 URL | 可为空 |
| email | string | 邮箱 | 唯一，来自 SSO |
| role | UserRole | 角色 | viewer / editor / admin |
| permissions | string[] | 模块权限列表 | editor 专用，如 ['courses', 'cases'] |

### 角色定义

| 角色 | 标识 | 说明 |
|------|------|------|
| 普通员工 | viewer | 登录后可浏览所有内容，无任何管理权限 |
| 内容编辑 | editor | 可管理被分配模块的内容，permissions 字段标识模块列表 |
| 超级管理员 | admin | 全模块管理权限 + 用户角色分配 |

---

## 接口定义

### SSO 回调 - 换取 Token

```
GET /rest/cbc/aiplatform/auth/callback?code=[sso_code]
权限: 无（公开）
说明: SSO 登录成功后跳转到此地址，服务端用 code 换取用户信息，写库后签发 JWT
Response: {
  code: 200,
  data: {
    accessToken: string,   // JWT，有效期 8 小时
    refreshToken: string,  // 刷新 Token，有效期 7 天
    user: User
  }
}
错误: 401 SSO 验证失败
```

### 刷新 Token

```
POST /rest/cbc/aiplatform/auth/refresh
权限: 无（使用 refreshToken）
Body: { refreshToken: string }
Response: {
  code: 200,
  data: {
    accessToken: string,
    refreshToken: string
  }
}
错误: 401 refreshToken 无效或过期
```

### 获取当前用户信息

```
GET /rest/cbc/aiplatform/auth/me
权限: 已登录（Bearer Token）
Response: {
  code: 200,
  data: User
}
错误: 401 未登录
```

### 退出登录

```
POST /rest/cbc/aiplatform/auth/logout
权限: 已登录
Response: { code: 200, data: null }
```

---

## 页面/组件行为

### 登录跳转逻辑（前端通用）

- 用户访问任意受保护页面时，检查本地是否有有效的 accessToken
- 若无 Token 或 Token 已过期：自动跳转到企业 SSO 登录页（附带 `redirect_uri` 参数）
- SSO 登录成功后回调到 `/auth/callback?code=xxx`，前端解析后存储 Token，跳转到原目标页
- accessToken 过期时（401 响应），自动用 refreshToken 静默刷新，刷新成功后重试原请求
- refreshToken 也过期时，清空本地 Token，重新跳转 SSO 登录

### 权限指令（管理后台）

- `v-permission="'admin'"` — 仅 Admin 可见
- `v-permission="'editor:courses'"` — 拥有 courses 模块权限的 Editor 或 Admin 可见
- 无权限时元素不渲染（`v-if`，不仅仅是隐藏）

---

## 验收标准（Acceptance Criteria）

- [ ] 未登录用户访问门户任意页面，自动跳转 SSO 登录，登录后返回原页面
- [ ] 未登录用户访问管理后台任意页面，自动跳转 SSO 登录
- [ ] SSO 登录成功后，accessToken 和 refreshToken 安全存储（localStorage 或 httpOnly Cookie）
- [ ] accessToken 过期时，自动静默刷新，用户无感知
- [ ] refreshToken 过期时，清空 Token，跳转重新登录
- [ ] Viewer 用户访问管理后台，提示「无权限访问」并跳回门户
- [ ] Editor 用户进入管理后台，左侧菜单只显示被授权的模块
- [ ] Admin 用户进入管理后台，可见所有菜单项
- [ ] `/rest/cbc/aiplatform/auth/me` 返回的角色和权限信息与数据库一致
