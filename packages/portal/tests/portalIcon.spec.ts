import { describe, expect, it } from 'vitest'
import { resolvePortalIcon } from '../src/utils/portalIcon'

describe('resolvePortalIcon', () => {
  it('normalizes spaced material symbol names in auto mode', () => {
    expect(resolvePortalIcon('auto awesome', { fallback: 'bolt' })).toEqual({
      kind: 'material',
      value: 'auto_awesome',
    })
  })

  it('keeps emoji icons literal', () => {
    expect(resolvePortalIcon('🤖', { fallback: 'bolt' })).toEqual({
      kind: 'text',
      value: '🤖',
    })
  })

  it('keeps title-cased labels as literal text', () => {
    expect(resolvePortalIcon('Cursor', { fallback: 'bolt' })).toEqual({
      kind: 'text',
      value: 'Cursor',
    })
  })

  it('keeps plain lowercase labels as literal text in auto mode', () => {
    expect(resolvePortalIcon('cursor', { fallback: 'bolt' })).toEqual({
      kind: 'text',
      value: 'cursor',
    })
  })

  it('maps legacy material aliases in strict material mode', () => {
    expect(resolvePortalIcon('Lightning', { fallback: 'bolt', mode: 'material' })).toEqual({
      kind: 'material',
      value: 'bolt',
    })
  })

  it('maps lower-case legacy aliases in auto mode', () => {
    expect(resolvePortalIcon('lightning', { fallback: 'bolt' })).toEqual({
      kind: 'material',
      value: 'bolt',
    })
  })

  it('uses fallback for empty icons', () => {
    expect(resolvePortalIcon('', { fallback: 'construction' })).toEqual({
      kind: 'material',
      value: 'construction',
    })
  })
})
