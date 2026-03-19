// Spec: specs/api/analytics.spec.md
import http from './http'

export interface ReportPageViewPayload {
  path: string
  visitorId: string
  visitedAt?: string
}

export interface ReportPageViewResult {
  accepted: boolean
}

export function reportPageView(data: ReportPageViewPayload): Promise<ReportPageViewResult> {
  return http.post('/analytics/page-view', data)
}

export interface AnalyticsSummary {
  totals: {
    pageViews: number
    visitors: number
  }
}

export function getAnalyticsSummary(): Promise<AnalyticsSummary> {
  return http.get('/analytics/summary')
}
