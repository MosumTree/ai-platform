# 门户首页 Spec

## 概述

AI 辅助研发平台的门户首页，聚合展示各模块的精华内容，起到导航和吸引访问的作用。

---

## 页面布局

```
[轮播 Banner 区域]              ← 全宽，依赖接口
[工具指导（最多 8 张卡片）]      ← 依赖接口
[AI 风向标 + 百工武器坊]        ← 2 列布局，依赖接口
[实战实验室（3 条视频）]        ← 依赖接口
[案例百科（3 条词条）]          ← 依赖接口
```

---

## 接口依赖

| 区块 | 接口 | 说明 |
|------|------|------|
| 轮播 Banner | GET /rest/cbc/aiplatform/banners | 返回 isActive=true 的全量列表，按 order ASC |
| 工具指导 | GET /rest/cbc/aiplatform/tool-guides | 返回 isActive=true 的全量列表，按 order ASC |
| AI 风向标 | GET /rest/cbc/aiplatform/ai-trends | 返回 isActive=true，默认 limit=5 |
| 百工武器坊 | GET /rest/cbc/aiplatform/weapon-workshop | 返回第一个分类及其武器项 |
| 实战实验室 | GET /rest/cbc/aiplatform/labs | isPublished=true，page=1, pageSize=3 |
| 案例百科 | GET /rest/cbc/aiplatform/wiki-cases | isPublished=true，page=1, pageSize=3 |

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

### AI 风向标（AiTrendSection.vue）

> 接口与数据模型详见 `specs/api/ai-trends.spec.md`

| 状态 | 表现 |
|------|------|
| 加载中 | 3 个骨架列表项占位 |
| 成功 | 列表展示，每项包含图标、标题、摘要、发布时间、详情链接 |
| 空 / 接口失败 | 楼层整体不渲染（`v-if="trends.length > 0"`） |

内容展示：Material Symbol 图标（hover 变色）→ 标题（加粗）→ 摘要（2 行截断）→ 相对时间（2 小时前）→ 详情链接（↗）。

### 百工武器坊（WeaponWorkshopSection.vue）

> 接口与数据模型详见 `specs/api/weapon-workshop.spec.md`

| 状态 | 表现 |
|------|------|
| 加载中 | 骨架卡片占位（含标题栏、2 个武器项、按钮） |
| 成功 | 右侧卡片样式：分类标题栏（图标+名称+描述）+ 武器列表（名称蓝色加粗+描述）+ "进入武器库" 按钮 |
| 空 / 接口失败 | 楼层整体不渲染 |

布局：占 1/3 宽度，右侧卡片样式，与 AI 风向标（占 2/3）组成 2 列布局。

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

- **并行请求**：6 个区块数据并行拉取，互不依赖，各自独立控制加载/成功/空/错误状态
- **接口失败处理**：静默，对应楼层不渲染，不弹 Toast，不影响其他楼层
- **各楼层右上角**：有「查看更多 / 进入xxx」链接，跳转对应列表页

---

## 验收标准（Acceptance Criteria）

- [ ] 轮播 Banner 首屏可见，加载中显示骨架屏，接口失败时静默不渲染
- [ ] 多条 Banner 自动轮播（5 秒间隔），hover 暂停；单条时静态展示，无指示器
- [ ] 工具指导、AI 风向标、百工武器坊、实战实验室、案例百科各自独立加载，任一接口失败不影响其他楼层
- [ ] 所有内容楼层均有骨架屏过渡；无数据时楼层整体不渲染
- [ ] AI 风向标与百工武器坊组成 2 列网格布局（2:1 比例）
- [ ] 各楼层「查看更多」链接跳转路径正确
- [ ] 首页在 3G 网络下 LCP 不超过 3 秒
