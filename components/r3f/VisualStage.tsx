'use client'

import { Canvas } from '@react-three/fiber'
import { useMemo } from 'react'
import { Color } from 'three'
import { useSearchParams } from 'next/navigation'
import { useReducedMotion } from '@/lib/hooks/useReducedMotion'
import { CrtDomOverlay } from './CrtDomOverlay'
import { FX_PRESETS, PostFX, type FxPreset } from './PostFX'
import styles from './VisualStage.module.scss'

const DEFAULT_PRESET: FxPreset = 'medium'

function normalizePreset(value: string | null): FxPreset | null {
  if (!value) return null
  const normalized = value.toLowerCase()
  if (normalized === 'low') return 'low'
  if (normalized === 'med' || normalized === 'medium') return 'medium'
  if (normalized === 'high') return 'high'
  return null
}

export function VisualStage() {
  const reducedMotion = useReducedMotion()
  const searchParams = useSearchParams()
  const fxParam = searchParams?.get('fx') ?? null

  const preset = useMemo(() => {
    if (process.env.NODE_ENV === 'production') return DEFAULT_PRESET
    return normalizePreset(fxParam) ?? DEFAULT_PRESET
  }, [fxParam])

  const presetConfig = FX_PRESETS[preset]
  const dpr = reducedMotion ? 1 : presetConfig.dpr
  const scanlineOpacity = reducedMotion
    ? presetConfig.scanlines.opacity * 0.45
    : presetConfig.scanlines.opacity

  return (
    <div className={styles.visualStage} aria-hidden="true">
      <Canvas
        className={styles.visualStage__canvas}
        frameloop="demand"
        dpr={dpr}
        orthographic
        camera={{ position: [0, 0, 1], zoom: 1, near: 0.1, far: 10 }}
        gl={{ antialias: preset === 'high', alpha: true, powerPreference: 'high-performance' }}
        onCreated={({ scene }) => {
          if (typeof window === 'undefined') return
          const styles = getComputedStyle(document.documentElement)
          const bg = styles.getPropertyValue('--c-bg').trim()
          scene.background = new Color(bg || '#000000')
        }}
      >
        <PostFX preset={preset} reducedMotion={reducedMotion} />
      </Canvas>
      <CrtDomOverlay
        opacity={scanlineOpacity}
        speedSeconds={presetConfig.scanlines.speed}
      />
    </div>
  )
}
