'use client'

import { useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { useReducedMotion } from '@/lib/hooks/useReducedMotion'
import { CrtDomOverlay } from './CrtDomOverlay'
import { FX_PRESETS } from './fxConfig'
import { DEFAULT_PRESET, normalizePreset } from './fxPreset'

export function CrtDomOverlayLayer() {
  const reducedMotion = useReducedMotion()
  const searchParams = useSearchParams()
  const fxParam = searchParams?.get('fx') ?? null

  const preset = useMemo(() => {
    if (process.env.NODE_ENV === 'production') return DEFAULT_PRESET
    return normalizePreset(fxParam) ?? DEFAULT_PRESET
  }, [fxParam])

  const presetConfig = FX_PRESETS[preset]
  const scanlineOpacity = reducedMotion
    ? presetConfig.scanlines.opacity * 0.45
    : presetConfig.scanlines.opacity
  const vignetteOpacity = reducedMotion ? 0.45 : 0.7
  const curvatureOpacity = reducedMotion ? 0.35 : 0.6
  const curvatureHighlightOpacity = reducedMotion ? 0.5 : 0.85
  const curvatureShadowOpacity = reducedMotion ? 0.6 : 0.9

  return (
    <CrtDomOverlay
      opacity={scanlineOpacity}
      speedSeconds={presetConfig.scanlines.speed}
      vignetteOpacity={vignetteOpacity}
      curvatureOpacity={curvatureOpacity}
      curvatureHighlightOpacity={curvatureHighlightOpacity}
      curvatureShadowOpacity={curvatureShadowOpacity}
    />
  )
}
