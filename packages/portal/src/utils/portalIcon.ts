// Spec: specs/portal/home.spec.md
export type PortalIconKind = 'material' | 'text'
export type PortalIconMode = 'auto' | 'material'

export interface ResolvedPortalIcon {
  kind: PortalIconKind
  value: string
}

interface ResolvePortalIconOptions {
  fallback?: string
  mode?: PortalIconMode
}

// ToolGuide 仍允许 emoji 或字面文本，这里只把明确像图标名的值走 Material Symbols 渲染。
const AUTO_MATERIAL_SYMBOL_NAME_PATTERN = /^[a-z0-9]+(?:[\s_-][a-z0-9]+)*$/

const MATERIAL_SYMBOL_ALIASES: Record<string, string> = {
  lightning: 'bolt',
}

const KNOWN_AUTO_MATERIAL_SYMBOLS = new Set([
  'auto_awesome',
  'bolt',
  'brush',
  'build',
  'code',
  'construction',
  'engineering',
  'extension',
  'insights',
  'memory',
  'science',
  'smart_toy',
  'terminal',
])

export function normalizeMaterialSymbolName(iconName: string): string {
  return iconName.trim().toLowerCase().replace(/[\s-]+/g, '_')
}

export function canonicalizeMaterialSymbolName(iconName: string): string {
  const normalized = normalizeMaterialSymbolName(iconName)
  return MATERIAL_SYMBOL_ALIASES[normalized] ?? normalized
}

export function isAutoMaterialSymbolName(icon?: string | null): boolean {
  if (!icon) return false
  if (!AUTO_MATERIAL_SYMBOL_NAME_PATTERN.test(icon.trim())) return false

  const normalized = canonicalizeMaterialSymbolName(icon)

  return normalized.includes('_') || KNOWN_AUTO_MATERIAL_SYMBOLS.has(normalized)
}

export function resolvePortalIcon(
  icon?: string | null,
  options: ResolvePortalIconOptions = {},
): ResolvedPortalIcon {
  const fallback = options.fallback ?? 'help'
  const mode = options.mode ?? 'auto'

  if (!icon?.trim()) {
    return {
      kind: 'material',
      value: canonicalizeMaterialSymbolName(fallback),
    }
  }

  if (mode === 'material') {
    return {
      kind: 'material',
      value: canonicalizeMaterialSymbolName(icon),
    }
  }

  if (isAutoMaterialSymbolName(icon)) {
    return {
      kind: 'material',
      value: canonicalizeMaterialSymbolName(icon),
    }
  }

  return {
    kind: 'text',
    value: icon.trim(),
  }
}
