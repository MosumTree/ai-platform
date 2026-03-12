# 用户与权限管理 Spec

## 概述

仅 Admin 可见的用户管理模块，用于查看平台用户列表和分配角色权限。

---

## 接口定义

### 获取用户列表

```
GET /api/admin/users
权限: Admin
Query: { page?: number, pageSize?: number, keyword?: string, role?: string }
Response: {
  code: 200,
  data: { list: User[], total: number, page: number, pageSize: number }
}
```

### 更新用户角色与权限

```
PATCH /api/admin/users/:id/role
权限: Admin
Body: { role: UserRole, permissions?: string[] }
Response: { code: 200, data: User }
说明: role=editor 时 permissions 必填，列出被授权的模块（如 ['courses', 'cases']）
     role=viewer 或 admin 时 permissions 忽略
```

---

## 页面行为

### 管理后台 - 用户管理页（Admin 专属）

- 表格：头像、姓名、工号、邮箱、角色（彩色标签）、权限模块、最后登录时间、操作
- 操作：编辑角色权限（弹窗）
- 编辑弹窗：角色单选（Viewer / Editor / Admin）；选 Editor 后出现模块多选框

---

## 验收标准（Acceptance Criteria）

- [ ] 非 Admin 用户访问此页面，返回 403 并提示无权限
- [ ] 将用户改为 Editor 时，必须至少选一个模块权限
- [ ] 权限变更立即生效，被改权限的用户下次请求时使用新权限
