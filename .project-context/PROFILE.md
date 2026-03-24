# `ai-platform` 上下文摘要

生成时间：`2026-03-19T07:40:18Z`  
来源提交：`888a7519fb78f7318572f2c4cab808eabebe1bfe`

## 这是什么

这是一个基于 npm workspaces 的多包仓库，目标是承载企业内部 AI 学习与宣传平台：

- `packages/portal`：员工展示门户，负责首页内容聚合、微前端接入、统一图标渲染和访问统计上报。
- `packages/admin`：管理后台，负责访问统计看板、首页内容总览和各内容模块管理入口。
- `packages/backend`：Egg.js + TypeORM + MySQL 的统一 API 服务。
- `specs`：Spec-Driven Development 的规格来源。

## 主要结构判断

- 前端两端都使用 `Vue 3 + Vite + Pinia + axios`，其中 `portal` 已补充 `Vitest` 图标回归测试；UI 体系不同：`portal` 使用 Tailwind 风格页面组件，`admin` 使用 Element Plus。
- `portal` 和 `admin` 都具备微前端宿主接入逻辑，依赖 `window.$wujie.bus` 接收登录态。
- 后端路由集中在 `packages/backend/app/router.ts`，成功响应通过 `packages/backend/app/middleware/response.ts` 统一包装为 `{ code, message, data }`。
- 当前版本新增了 `analytics` 统计链路：门户路由切换上报页面访问，页脚展示累计 PV/UV，管理后台 Dashboard 展示最近 7 天访问总览和路径排行。
- `portal` 首页图标现已通过 `AppIcon` + `portalIcon` 统一渲染，并使用本地自托管 `Material Symbols Rounded` 字体替代运行时外链。

## 已识别共享参考模式

- 前端统一 HTTP 客户端：Bearer 注入、响应解包、401 刷新重试。
- 微前端登录桥接：宿主下发用户信息，auth store 做规范化展示。
- 门户楼层组件自取数：各楼层独立 `loading/成功/静默失败`，互不阻塞。
- 门户访问统计：`router.afterEach` 异步上报 `path + visitorId`，layout 挂载时拉取累计统计，失败静默。
- 门户图标渲染：`AppIcon` + `portalIcon` 在首页楼层统一消费 `Material Symbol` 名称，并兼容 emoji / 普通文本回退。
- 后端内容 CRUD：TypeORM Repository + service 层 404 异常 + controller 输出裸业务数据。
- analytics 聚合：TypeORM QueryBuilder 汇总 PV/UV，并在 boot hook 中兜底创建 `page_visit_logs` 表。
- 管理后台权限表面：`route meta` + `v-permission` + `auth store`。

详情见：

- `./profile.yaml`
- `./references.yaml`
- `./features/index.yaml`

## 已识别关键特性

- 统一认证、SSO 回调与权限外壳
- 门户首页聚合展示
- 门户访问统计与管理端 PV/UV 总览
- Banner 与工具指导内容链路
- AI 风向标与百工武器坊内容链路
- 实战实验室与案例百科通道
- 用户角色与权限管理
- 管理后台首页内容总览

## 重要未知项与风险

- `README.md` 仍写着 NestJS 和 `packages/shared`，与当前代码现状不一致。
- `portal` / `admin` 的路由守卫被注释，后端 `auth` service 也仍是 TODO，认证闭环未落地。
- `/admin/analytics/overview` 规范要求 `Editor` 及以上，但当前实现只做了 JWT 解析，没有看到显式登录或角色校验。
- Dashboard 当前页面主要展示 analytics 统计；Spec 中的内容总览、最近操作和 `/admin/dashboard*` 契约仍未与前后端完全对齐。
- 用户管理前端入口已存在，但后端未发现 `/admin/users` 相关实现。
- 门户的 `/trends`、`/courses`、`/cases`、`/capabilities` 等入口仍未在当前 router 中看到实际页面。
- `packages/admin/src/views/home-content/HomeContentView.vue` 引用了缺失的 `specs/admin/home-content.spec.md`。
- `portal` 已新增 `Vitest` 图标解析回归测试，但仓库仍未发现 CI 工作流，`admin` / `backend` 也未见自动化测试目录。
- `ToolGuide.icon` 的契约仍是“emoji 或图标名”自由输入；`portal` 已增加 auto 模式兼容，但 `admin` / `backend` 尚未对单词型图标名做统一校验或归一化。

## Follow-Up

- 优先继续同步以下区域：认证链路、analytics 权限校验、Dashboard 契约、用户管理、首页内容总览。
- 若要继续扩展 portal 图标覆盖，新增单词型 Material Symbol 时同步更新 `packages/portal/src/utils/portalIcon.ts` 的 allowlist / alias。
- 若要继续开发管理后台首页内容总览，先补 `specs/admin/home-content.spec.md`。
- 若要继续完善 Dashboard，先决定是继续走独立 `analytics` 看板，还是回到 `specs/admin/dashboard.spec.md` 的完整内容概览设计。
- 若要推进前端页面开发，建议先补齐 portal 中 `/capabilities`、`/courses`、`/cases`、`/trends` 等实际路由或明确宿主提供方式。
