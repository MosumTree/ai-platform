# 页面统计 Analytics Spec

## 概述

用于统计门户页面访问量（PV）与访客数（UV），支持按页面路径和日期聚合。  
要求：本地调试环境产生的访问不计入统计。

---

## 接口定义

### 1) 上报页面访问

```
POST /rest/cbc/aiplatform/analytics/page-view
权限: 公开接口（无需登录）
Body: {
  path: string,          // 页面路径，例如 "/"、"/courses"
  visitorId: string,     // 前端生成并持久化的访客唯一标识
  visitedAt?: string     // ISO 时间，可选，不传则后端取当前时间
}
Response: {
  code: 200,
  message: "success",
  data: { accepted: boolean }
}
```

规则：
- 当请求来源为本地调试环境（localhost / 127.0.0.1 / 0.0.0.0）时，`accepted=false`，不入库。
- 缺少 `path` 或 `visitorId` 时返回 400。

### 2) 获取聚合统计（管理端）

```
GET /rest/cbc/aiplatform/admin/analytics/overview?from=2026-03-01&to=2026-03-31
权限: Editor 及以上
Response: {
  code: 200,
  message: "success",
  data: {
    range: { from: string, to: string },
    totals: {
      pageViews: number,     // 范围内总 PV
      visitors: number       // 范围内总 UV（visitorId 去重）
    },
    byPath: Array<{
      path: string,
      pageViews: number,     // 该 path PV
      visitors: number       // 该 path UV
    }>
  }
}
```

规则：
- `from` / `to` 可选；未传时默认最近 7 天（含当天）。
- `byPath` 按 `pageViews` 倒序返回。

### 3) 获取访问汇总（门户页脚）

```
GET /rest/cbc/aiplatform/analytics/summary
权限: 公开接口（无需登录）
Response: {
  code: 200,
  message: "success",
  data: {
    totals: {
      pageViews: number,   // 累计总 PV
      visitors: number     // 累计总 UV
    }
  }
}
```

规则：
- 返回累计总量（全量数据）；
- 本地调试环境访问该接口不受限制（仅上报接口会排除本地统计）。

---

## 数据模型

### page_visit_logs

| 字段 | 类型 | 说明 |
|---|---|---|
| id | number | 主键 |
| path | string(255) | 页面路径 |
| visitorId | string(64) | 访客唯一标识 |
| visitedAt | datetime | 访问时间 |
| createdAt | datetime | 创建时间 |
| updatedAt | datetime | 更新时间 |

---

## 验收标准（Acceptance Criteria）

- [ ] 门户路由切换会触发上报，且不阻塞页面渲染
- [ ] 本地调试访问不入库
- [ ] 可按时间范围返回 PV/UV 总览
- [ ] 可按页面路径返回 PV/UV 排行
