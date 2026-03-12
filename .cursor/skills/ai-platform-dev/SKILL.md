---
name: ai-platform-dev
description: ai-platform 项目全栈开发辅助技能。覆盖三类场景：(1) 编写和维护 specs/ 目录下的 Spec 文档；(2) Egg.js 后端开发——Controller/Service/Entity/Router 的标准写法；(3) Vue3 前端开发——portal 和 admin 的组件、API 封装、路由规范。当用户开发新功能、修改接口、创建页面、写 Spec 时自动应用。
---

# ai-platform 全栈开发辅助

## 项目结构速查

```
ai-platform/
├── packages/
│   ├── backend/          # Egg.js 3 + TypeORM + MySQL
│   │   ├── app/
│   │   │   ├── controller/   # 路由处理
│   │   │   ├── service/      # 业务逻辑
│   │   │   ├── entity/       # TypeORM Entity
│   │   │   ├── middleware/   # response / errorHandler / jwt
│   │   │   └── router.ts     # 统一路由
│   │   ├── config/
│   │   │   ├── config.default.ts
│   │   │   └── plugin.ts
│   │   ├── database/
│   │   │   └── dataSource.ts # AppDataSource
│   │   └── app.ts            # IBoot 生命周期
│   ├── portal/           # Vue3 + Vite + Tailwind（用户门户）
│   │   └── src/
│   │       ├── api/      # http.ts + 各模块 API
│   │       ├── components/
│   │       ├── views/
│   │       └── stores/   # Pinia
│   ├── admin/            # Vue3 + Vite + Element Plus（管理后台）
│   │   └── src/
│   │       ├── api/
│   │       ├── views/
│   │       └── directives/permission.ts
│   └── shared/           # 公共 TypeScript 类型
│       └── src/index.ts
└── specs/
    ├── api/              # 后端接口 Spec
    ├── portal/           # 门户页面 Spec
    └── admin/            # 管理后台 Spec
```

## 规则：Spec 先行

**新功能开发前必须确认 Spec 存在**，否则先创建 Spec 再写代码。

- 后端接口 → `specs/api/<模块>.spec.md`
- 门户页面 → `specs/portal/<页面>.spec.md`
- 管理后台 → `specs/admin/<页面>.spec.md`

Spec 模板参考 `specs/_template.spec.md`。

每个实现文件顶部必须标注：
```typescript
// Spec: specs/api/xxx.spec.md
```

---

## 后端开发规范（Egg.js）

### Entity（app/entity/）

```typescript
// Spec: specs/api/<模块>.spec.md
import 'reflect-metadata';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('<table_name>')
export class XxxEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 100 })
  title!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
```

新增 Entity 后必须注册到 `database/dataSource.ts` 的 `entities` 数组。

### Service（app/service/）

```typescript
// Spec: specs/api/<模块>.spec.md
import { Service } from 'egg';
import { Repository } from 'typeorm';
import { AppDataSource } from '../../database/dataSource';
import { XxxEntity } from '../entity/Xxx';

export default class XxxService extends Service {
  private get repo(): Repository<XxxEntity> {
    return AppDataSource.getRepository(XxxEntity);
  }

  async findAll() { ... }
  async create(data: CreateXxxData) { ... }
  async update(id: number, data: UpdateXxxData) {
    const item = await this.repo.findOneBy({ id });
    if (!item) {
      const err = new Error(`Xxx #${id} 不存在`);
      (err as any).status = 404;
      throw err;
    }
    ...
  }
}
```

### Controller（app/controller/）

```typescript
// Spec: specs/api/<模块>.spec.md
import { Controller } from 'egg';
import XxxService from '../service/xxx';

export default class XxxController extends Controller {
  private get svc(): XxxService {
    return (this.ctx.service as any).xxx;
  }

  async index() {
    this.ctx.body = await this.svc.findAll();
  }

  async create() {
    const data = this.ctx.request.body as CreateXxxData;
    this.ctx.status = 201;
    this.ctx.body = await this.svc.create(data);
  }
}
```

### 路由注册（app/router.ts）

```typescript
// 公开接口
router.get('/api/<resource>', controller.xxx.index);

// 需要 JWT 的接口
const jwt = middleware.jwt();
router.get('/api/auth/me', jwt, controller.auth.me);

// Admin 接口（CRUD）
router.get('/api/admin/<resource>', controller.adminXxx.index);
router.post('/api/admin/<resource>', controller.adminXxx.create);
router.put('/api/admin/<resource>/:id', controller.adminXxx.update);
router.del('/api/admin/<resource>/:id', controller.adminXxx.destroy);
```

### 统一响应格式

所有接口统一输出（由 `app/middleware/response.ts` 自动包装）：
```json
{ "code": 200, "message": "success", "data": <T> }
{ "code": 201, "message": "created", "data": <T> }
{ "code": 4xx|5xx, "message": "<错误信息>", "data": null }
```

---

## 前端开发规范

### API 封装（portal/src/api/ 或 admin/src/api/）

```typescript
// Spec: specs/api/<模块>.spec.md
import http from './http'
import type { Xxx } from 'shared'

export function getXxxList(): Promise<Xxx[]> {
  return http.get('/<resource>')
}

export function createXxx(data: Partial<Xxx>): Promise<Xxx> {
  return http.post('/admin/<resource>', data)
}
```

`http.ts` 的响应拦截器自动解包 `{ code, message, data }` → 直接返回 `data`。

### 共享类型（packages/shared/src/index.ts）

新数据模型必须先在 `shared` 中定义再使用：

```typescript
export interface Xxx {
  id: number
  title: string
  createdAt: string
  updatedAt: string
}
```

### Vue3 组件四态原则

每个列表/数据组件必须处理：
1. **加载中**：骨架屏或 loading 状态
2. **成功**：正常展示数据
3. **空状态**：无数据时的提示
4. **错误**：请求失败的 fallback

### portal 路由结构

`/` 路由以 `AppLayout` 为父组件（含导航栏+页脚），子页面通过 `<RouterView />` 渲染（**不是 `<slot />`**）。子页面 View 中不需要再包裹 `AppLayout`。

### admin 权限控制

```vue
<!-- 按钮级权限 -->
<el-button v-permission="'admin'">删除</el-button>
<el-button v-permission="'editor:banners'">编辑</el-button>
```

---

## 启动命令

```bash
# 后端（端口 3000）
pnpm --filter backend dev

# 门户（端口 5173）
pnpm --filter portal dev

# 管理后台（端口 5174）
pnpm --filter admin dev
```

## 当前模块状态

| 模块 | Spec | 后端 | portal | admin |
|------|------|------|--------|-------|
| Banner 轮播 | ✅ | ✅ | ✅ | ✅ |
| 通知公告 | ✅ | 骨架 | 占位 | 占位 |
| AI 课程 | ✅ | 骨架 | 占位 | 占位 |
| 能力市场 | ✅ | 骨架 | 占位 | 占位 |
| 优秀案例 | ✅ | 骨架 | 占位 | 占位 |
| 荣誉激励 | ✅ | 骨架 | 占位 | 占位 |
| 认证/SSO | ✅ | 骨架 | 已注释 | 已注释 |
| 管理 Dashboard | ✅ | 骨架 | - | 占位 |

详细规范参考 [spec-guide.md](spec-guide.md)
