'use client'

import { Canvas } from './r3f'
import { useMemo } from 'react'
import { Color } from 'three'
import { useSearchParams } from 'next/navigation'
import { useReducedMotion } from '@/lib/hooks/useReducedMotion'
import { PostFX } from './PostFX'
import { CrtNoisePlane } from './CrtNoisePlane'
import { FX_PRESETS } from './fxConfig'
import { DEFAULT_PRESET, normalizePreset } from './fxPreset'
import styles from './VisualStage.module.scss'

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
        <CrtNoisePlane opacity={preset === 'low' ? 0.03 : 0.06} />
        <PostFX preset={preset} reducedMotion={reducedMotion} />
      </Canvas>
    </div>
  )
}
