/// <reference types="vite/client" />

// Vue SFC 模块声明（让 TS 识别 .vue 文件导入）
declare module '*.vue' {
  import type { Component } from 'vue'
  const component: Component
  export default component
}

// wujie 微前端框架注入的全局变量类型声明
interface WujieBus {
  $on(event: string, handler: (...args: unknown[]) => void): void
  $off(event: string, handler?: (...args: unknown[]) => void): void
  $emit(event: string, ...args: unknown[]): void
}

interface Window {
  $wujie?: {
    bus: WujieBus
    props?: Record<string, unknown>
  }
}
