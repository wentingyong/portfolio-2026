'use client'

import { useEffect, useMemo, useRef } from 'react'
import { EffectComposer } from '@react-three/postprocessing'
import { BlendFunction, ChromaticAberrationEffect, Effect, VignetteEffect } from 'postprocessing'
import { Color, Uniform, Vector2 } from 'three'
import { useThree } from './r3f'
import { useCrtImpulse } from '@/lib/motion/useCrtImpulse'
import { useReducedMotion } from '@/lib/hooks/useReducedMotion'
import { FX_PRESETS, type FxPreset } from './fxConfig'

const CURVATURE_FRAGMENT = `
uniform float curvature;

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
  vec2 centered = uv * 2.0 - 1.0;
  float dist = dot(centered, centered);
  centered *= 1.0 + curvature * dist;
  vec2 warped = centered * 0.5 + 0.5;
  vec2 clampedUv = clamp(warped, 0.0, 1.0);
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
  const reducedMotionPref = useReducedMotion()
  const reducedMotion = reducedMotionProp ?? reducedMotionPref
  const { invalidate } = useThree()
  const config = FX_PRESETS[preset]
  const enablePostFx = config.enablePostFx

  const motionScale = reducedMotion ? 0.35 : 1
  const chromaBase = config.chromatic.base * motionScale
  const chromaBoost = config.chromatic.boost * motionScale
  const chromaVertical = config.chromatic.vertical
  const vignetteDarkness = config.vignette.darkness * (reducedMotion ? 0.7 : 1)
  const curvatureAmount = config.curvature.amount * (reducedMotion ? 0.45 : 1)

  const chromaOffset = useRef(new Vector2(chromaBase, chromaBase * chromaVertical))
  const vignetteColor = useRef(new Color('#000000'))
  const modulationOffset = useMemo(() => 0.5, [])

  const curvatureEffect = useMemo(() => new CrtCurvatureEffect(0), [])
  const chromaEffect = useMemo(
    () =>
      new ChromaticAberrationEffect({
        blendFunction: BlendFunction.NORMAL,
        offset: chromaOffset.current.clone(),
        radialModulation: true,
        modulationOffset,
      }),
    [modulationOffset],
  )
  const vignetteEffect = useMemo(
    () =>
      new VignetteEffect({
        eskil: false,
        offset: config.vignette.offset,
        darkness: vignetteDarkness,
      }),
    [config.vignette.offset, vignetteDarkness],
  )

  const chromaticEnabled = enablePostFx && config.chromatic.enabled
  const vignetteEnabled = enablePostFx && config.vignette.enabled
  const curvatureEnabled = enablePostFx && config.curvature.enabled

  const applyChromatic = (impulse: number) => {
    if (!chromaticEnabled) return
    const intensity = chromaBase + impulse * chromaBoost
    chromaOffset.current.set(intensity, intensity * chromaVertical)
    chromaEffect.offset.copy(chromaOffset.current)
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
    if (!chromaticEnabled) return
    chromaOffset.current.set(chromaBase, chromaBase * chromaVertical)
    chromaEffect.offset.copy(chromaOffset.current)
    invalidate()
  }, [chromaBase, chromaEffect, chromaVertical, chromaticEnabled, invalidate])

  useEffect(() => {
    curvatureEffect.setCurvature(curvatureEnabled ? curvatureAmount : 0)
    invalidate()
  }, [curvatureAmount, curvatureEffect, curvatureEnabled, invalidate])

  useEffect(() => {
    if (!vignetteEnabled) return
    vignetteEffect.eskil = false
    vignetteEffect.offset = config.vignette.offset
    vignetteEffect.darkness = vignetteDarkness
    invalidate()
  }, [config.vignette.offset, invalidate, vignetteDarkness, vignetteEffect, vignetteEnabled])

  useEffect(() => {
    return () => {
      chromaEffect.dispose?.()
      vignetteEffect.dispose?.()
    }
  }, [chromaEffect, vignetteEffect])

  useEffect(() => {
    invalidate()
  }, [invalidate, preset, reducedMotion])

  if (!enablePostFx) {
    return null
  }

  const effects = (
    <>
      {curvatureEnabled && <primitive object={curvatureEffect} />}
      {chromaticEnabled && <primitive object={chromaEffect} />}
      {vignetteEnabled && <primitive object={vignetteEffect} />}
    </>
  )

  return <EffectComposer>{effects}</EffectComposer>
}
