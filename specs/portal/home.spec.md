# 门户首页 Spec

## 概述

AI 辅助研发平台的门户首页，聚合展示各模块的精华内容，起到导航和吸引访问的作用。

---

## 页面布局

```
[轮播 Banner 区域]         ← 全宽，依赖接口
[工具指导（最多 8 张卡片）] ← 依赖接口
[实战实验室（3 条视频）]   ← 依赖接口
[案例百科（3 条词条）]     ← 依赖接口
```

---

## 接口依赖

| 区块 | 接口 | 说明 |
|------|------|------|
| 轮播 Banner | GET /api/banners | 返回 isActive=true 的全量列表，按 order ASC |
| 工具指导 | GET /api/tool-guides | 返回 isActive=true 的全量列表，按 order ASC |
| 实战实验室 | GET /api/labs | isPublished=true，page=1, pageSize=3 |
| 案例百科 | GET /api/wiki-cases | isPublished=true，page=1, pageSize=3 |

---

## 各区块行为

### 轮播 Banner 区域（BannerCarousel.vue）

> 接口与数据模型详见 `specs/api/banners.spec.md`

| 状态 | 表现 |
|------|------|
| 加载中 | 与 Banner 等高的 shimmer 骨架占位块 |
| 成功（多条） | 全宽背景图轮播，5 秒自动切换，底部圆点指示器，hover 暂停，支持手动点击切换 |
| 成功（单条） | 静态展示，无指示器，无自动轮播 |
| 空 / 接口失败 | 整个区域不渲染，静默处理 |

Banner 内容分层：背景大图（imageUrl）→ tags 角标 → title 大标题 → description 副标题 → CTA 按钮（buttonText + buttonLink，为空时不渲染）。

### 工具指导（ToolGuide.vue）

> 接口与数据模型详见 `specs/api/tool-guides.spec.md`

| 状态 | 表现 |
|------|------|
| 加载中 | 4 个骨架卡片占位 |
| 成功 | 4 列卡片，每张展示 icon / name / desc / 安装入口 / 用户指南 |
| 空 / 接口失败 | 楼层整体不渲染（`v-if="tools.length > 0"`） |

### 实战实验室（LabSection.vue）

> 接口与数据模型详见 `specs/api/labs.spec.md`

| 状态 | 表现 |
|------|------|
| 加载中 | 3 个 16:9 骨架卡片占位 |
| 成功 | 3 列视频卡片，hover 展示播放图标遮罩，右下角显示时长标签 |
| 空 / 接口失败 | 楼层整体不渲染（`v-if="labs.length > 0"`） |

### 案例百科（WikiCaseSection.vue）

> 接口与数据模型详见 `specs/api/wiki-cases.spec.md`

| 状态 | 表现 |
|------|------|
| 加载中 | 3 个图文骨架卡片占位 |
| 成功 | 3 列图文卡片，封面 hover 显示「阅读百科词条」遮罩，下方展示 title / summary（2 行截断）/ tags |
| 空 / 接口失败 | 楼层整体不渲染（`v-if="cases.length > 0"`） |

---

## 页面行为

- **并行请求**：4 个区块数据并行拉取，互不依赖，各自独立控制加载/成功/空/错误状态
- **接口失败处理**：静默，对应楼层不渲染，不弹 Toast，不影响其他楼层
- **各楼层右上角**：有「查看更多 / 进入xxx」链接，跳转对应列表页

---

## 验收标准（Acceptance Criteria）

- [ ] 轮播 Banner 首屏可见，加载中显示骨架屏，接口失败时静默不渲染
- [ ] 多条 Banner 自动轮播（5 秒间隔），hover 暂停；单条时静态展示，无指示器
- [ ] 工具指导、实战实验室、案例百科各自独立加载，任一接口失败不影响其他楼层
- [ ] 三个内容楼层均有骨架屏过渡；无数据时楼层整体不渲染
- [ ] 各楼层「查看更多」链接跳转路径正确
- [ ] 首页在 3G 网络下 LCP 不超过 3 秒
