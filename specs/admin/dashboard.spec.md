# 管理后台 Dashboard Spec

## 概述

管理后台首页，展示平台数据概览和最近操作记录，帮助管理员快速掌握平台运营状况。

---

## 接口定义

### 获取数据概览

```
GET /rest/cbc/aiplatform/admin/dashboard/overview
权限: Editor 及以上
Response: {
  code: 200,
  data: {
    announcements: { total: number, published: number },
    courses: { total: number, published: number },
    capabilities: { total: number, active: number },
    cases: { total: number, published: number, reviewing: number },
    honors: { total: number }
  }
}
```

### 获取最近发布记录

```
GET /rest/cbc/aiplatform/admin/dashboard/recent
权限: Editor 及以上
Response: {
  code: 200,
  data: Array<{
    module: string,    // 模块名称
    title: string,     // 内容标题
    action: string,    // 操作类型：published / created / updated
    operatorName: string,
    createdAt: string
  }>
}
说明: 返回最近 10 条操作记录，全模块混合
```

### 获取访问统计（PV/UV）

```
GET /rest/cbc/aiplatform/admin/analytics/overview?from=2026-03-01&to=2026-03-31
权限: Editor 及以上
Response: {
  code: 200,
  data: {
    range: { from: string, to: string },
    totals: {
      pageViews: number,
      visitors: number
    },
    byPath: Array<{
      path: string,
      pageViews: number,
      visitors: number
    }>
  }
}
说明:
- from/to 不传时默认最近 7 天（含当天）
- byPath 按 pageViews 倒序
```

---

## 页面行为

- **数据统计卡片**：5 张卡片，每张显示模块名、总数、已发布/active 数量
- **最近操作**：表格，列：模块、内容标题、操作类型、操作人、时间
- 数据卡片点击，跳转对应模块管理页
- Editor 角色只能看到被授权模块的统计卡片
- **访问统计卡片**：展示最近 7 天 `总访问量(PV)` 与 `访客数(UV)`
- **访问排行表**：展示 `path / PV / UV`，按 PV 倒序，默认展示前 10 条

---

## 验收标准（Acceptance Criteria）

- [ ] 统计数字实时反映数据库当前状态
- [ ] Editor 只看到自己被授权模块的卡片
- [ ] 最近操作列表按时间倒序，最多显示 10 条
- [ ] Dashboard 可展示最近 7 天 PV/UV 统计
- [ ] 访问排行按 PV 倒序展示
