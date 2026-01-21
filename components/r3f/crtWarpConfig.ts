import type { FxPreset } from './fxConfig'

export const WARP_SCALES: Record<FxPreset, number> = {
  low: 40,
  medium: 80,
  high: 85,
}

export const DEFAULT_WARP_POWER = 2

export function normalizeWarp(value: string | null): number | null {
  if (!value) return null
  const normalized = value.toLowerCase().trim()
  if (normalized === 'off' || normalized === '0' || normalized === 'false') {
    return 0
  }
  const numeric = Number.parseFloat(normalized)
  return Number.isFinite(numeric) ? numeric : null
}
