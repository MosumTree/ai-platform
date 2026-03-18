# Spec 文档说明

本目录是项目的核心资产，所有功能开发必须先在此处编写对应的 Spec 文件。
设计稿：https://stitch.withgoogle.com/projects/12404152126625160076

## 目录结构

```
specs/
├── _template.spec.md        # Spec 标准模板（每次新建 Spec 时复制此文件）
├── api/                     # 后端接口 Spec
│   ├── auth.spec.md         # 认证与权限
│   ├── announcements.spec.md
│   ├── courses.spec.md
│   ├── capability-market.spec.md
│   ├── cases.spec.md
│   └── honors.spec.md
├── portal/                  # 用户门户前端 Spec
│   ├── home.spec.md
│   ├── course-list.spec.md
│   ├── capability-market.spec.md
│   └── case-gallery.spec.md
└── admin/                   # 管理后台 Spec
    ├── dashboard.spec.md
    ├── content-manage.spec.md
    └── user-manage.spec.md
```

## Spec 编写规范

1. 每个 Spec 文件必须包含：概述、数据模型、接口定义、页面/组件行为、验收标准五节
2. 数据模型字段必须与 `packages/shared/src/index.ts` 中的类型定义保持同步
3. 接口定义是后端实现的唯一依据，字段名、类型、路径不得随意更改
4. 验收标准是测试和验收的唯一依据，任何与 Spec 不符的行为视为 Bug

## 开发流程

```
编写 Spec → 评审确认 → @引用 Spec 让 AI 生成代码 → 对照验收标准验收
```
