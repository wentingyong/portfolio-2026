'use client'

import { useEffect, useMemo, useRef } from 'react'
import { EffectComposer, ChromaticAberration, Vignette } from '@react-three/postprocessing'
import { BlendFunction, Effect } from 'postprocessing'
import { Color, Uniform, Vector2 } from 'three'
import type { ChromaticAberrationEffect } from 'postprocessing'
import { useThree } from '@react-three/fiber'
import { useCrtImpulse } from '@/lib/motion/useCrtImpulse'
import { useReducedMotion } from '@/lib/hooks/useReducedMotion'

export type FxPreset = 'low' | 'medium' | 'high'

// Tune effect intensity + performance presets here.
export const FX_PRESETS: Record<
  FxPreset,
  {
    dpr: number
    enablePostFx: boolean
    scanlines: { opacity: number; speed: number }
    chromatic: { enabled: boolean; base: number; boost: number; vertical: number }
    vignette: { enabled: boolean; offset: number; darkness: number }
    curvature: { enabled: boolean; amount: number }
    impulse: { max: number; scroll: number; click: number; decayRate: number }
  }
> = {
  low: {
    dpr: 1,
    enablePostFx: true, // Set false to disable postprocessing on low.
    scanlines: { opacity: 0.08, speed: 26 },
    chromatic: { enabled: false, base: 0, boost: 0, vertical: 0.6 },
    vignette: { enabled: true, offset: 0.44, darkness: 0.32 },
    curvature: { enabled: false, amount: 0 },
    impulse: { max: 0.6, scroll: 0.035, click: 0.12, decayRate: 3.8 },
  },
  medium: {
    dpr: 1.25,
    enablePostFx: true,
    scanlines: { opacity: 0.1, speed: 24 },
    chromatic: { enabled: true, base: 0.00035, boost: 0.0021, vertical: 0.65 },
    vignette: { enabled: true, offset: 0.4, darkness: 0.38 },
    curvature: { enabled: true, amount: 0.018 },
    impulse: { max: 1, scroll: 0.05, click: 0.2, decayRate: 3.6 },
  },
  high: {
    dpr: 1.5,
    enablePostFx: true,
    scanlines: { opacity: 0.11, speed: 20 },
    chromatic: { enabled: true, base: 0.00045, boost: 0.0026, vertical: 0.7 },
    vignette: { enabled: true, offset: 0.38, darkness: 0.4 },
    curvature: { enabled: true, amount: 0.022 },
    impulse: { max: 1, scroll: 0.06, click: 0.22, decayRate: 3.4 },
  },
}

const CURVATURE_FRAGMENT = `
uniform float curvature;

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
  vec2 centered = uv - 0.5;
  float radius = dot(centered, centered);
  vec2 distorted = uv + centered * radius * curvature;
  vec2 clampedUv = clamp(distorted, 0.0, 1.0);
  outputColor = texture2D(inputBuffer, clampedUv);
}
`

class CrtCurvatureEffect extends Effect {
  constructor(curvature: number) {
    super('CrtCurvatureEffect', CURVATURE_FRAGMENT, {
      blendFunction: BlendFunction.NORMAL,
      uniforms: new Map([['curvature', new Uniform(curvature)]]),
    })
  }

  setCurvature(value: number) {
    const uniform = this.uniforms.get('curvature')
    if (uniform) {
      uniform.value = value
    }
  }
}

interface PostFXProps {
  preset: FxPreset
  reducedMotion?: boolean
}

export function PostFX({ preset, reducedMotion: reducedMotionProp }: PostFXProps) {
  const reducedMotion = reducedMotionProp ?? useReducedMotion()
  const { invalidate } = useThree()
  const config = FX_PRESETS[preset]
  const enablePostFx = config.enablePostFx

  const motionScale = reducedMotion ? 0.35 : 1
  const chromaBase = config.chromatic.base * motionScale
  const chromaBoost = config.chromatic.boost * motionScale
  const chromaVertical = config.chromatic.vertical
  const vignetteDarkness = config.vignette.darkness * (reducedMotion ? 0.7 : 1)
  const curvatureAmount = config.curvature.amount * (reducedMotion ? 0.45 : 1)

  const chromaRef = useRef<ChromaticAberrationEffect | null>(null)
  const chromaOffset = useRef(new Vector2(chromaBase, chromaBase * chromaVertical))
  const vignetteColor = useRef(new Color('#000000'))
  const modulationOffset = useMemo(() => new Vector2(0.5, 0.5), [])

  const curvatureEffect = useMemo(() => new CrtCurvatureEffect(0), [])

  const chromaticEnabled = enablePostFx && config.chromatic.enabled
  const vignetteEnabled = enablePostFx && config.vignette.enabled
  const curvatureEnabled = enablePostFx && config.curvature.enabled

  const applyChromatic = (impulse: number) => {
    if (!chromaticEnabled || !chromaRef.current) return
    const intensity = chromaBase + impulse * chromaBoost
    chromaOffset.current.set(intensity, intensity * chromaVertical)
    chromaRef.current.offset.copy(chromaOffset.current)
    invalidate()
  }

  useCrtImpulse({
    enabled: chromaticEnabled,
    reducedMotion,
    maxImpulse: config.impulse.max,
    scrollBoost: config.impulse.scroll,
    clickBoost: config.impulse.click,
    decayRate: config.impulse.decayRate,
    onTick: applyChromatic,
  })

  useEffect(() => {
    if (typeof window === 'undefined') return
    const styles = getComputedStyle(document.documentElement)
    const bg = styles.getPropertyValue('--c-bg').trim()
    if (bg) {
      vignetteColor.current.set(bg)
    }
    invalidate()
  }, [invalidate])

  useEffect(() => {
    if (!chromaticEnabled || !chromaRef.current) return
    chromaOffset.current.set(chromaBase, chromaBase * chromaVertical)
    chromaRef.current.offset.copy(chromaOffset.current)
    invalidate()
  }, [chromaBase, chromaVertical, chromaticEnabled, invalidate])

  useEffect(() => {
    curvatureEffect.setCurvature(curvatureEnabled ? curvatureAmount : 0)
    invalidate()
  }, [curvatureAmount, curvatureEffect, curvatureEnabled, invalidate])

  useEffect(() => {
    invalidate()
  }, [invalidate, preset, reducedMotion])

  if (!enablePostFx) {
    return null
  }

  return (
    <EffectComposer>
      {curvatureEnabled && <primitive object={curvatureEffect} />}
      {chromaticEnabled && (
        <ChromaticAberration
          ref={chromaRef}
          offset={chromaOffset.current}
          radialModulation
          modulationOffset={modulationOffset}
        />
      )}
      {vignetteEnabled && (
        <Vignette
          eskil={false}
          offset={config.vignette.offset}
          darkness={vignetteDarkness}
          color={vignetteColor.current}
        />
      )}
    </EffectComposer>
  )
}
