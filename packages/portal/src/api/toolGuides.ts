// Spec: specs/api/tool-guides.spec.md
import http from './http'
import type { ToolGuide } from 'shared'

export function getToolGuides(): Promise<ToolGuide[]> {
  return http.get('/tool-guides')
}
