import type { FxPreset } from './fxConfig'

export const DEFAULT_PRESET: FxPreset = 'medium'

export function normalizePreset(value: string | null): FxPreset | null {
  if (!value) return null
  const normalized = value.toLowerCase()
  if (normalized === 'low') return 'low'
  if (normalized === 'med' || normalized === 'medium') return 'medium'
  if (normalized === 'high') return 'high'
  return null
}
