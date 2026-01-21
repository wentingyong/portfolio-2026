'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import GUI from 'lil-gui'
import { useReducedMotion } from '@/lib/hooks/useReducedMotion'
import { CrtDomOverlay } from './CrtDomOverlay'
import {
  DEFAULT_WARP_POWER,
  WARP_SCALES,
  normalizeWarp,
} from './crtWarpConfig'
import { DEFAULT_PRESET, normalizePreset } from './fxPreset'

export function CrtDomOverlayLayer() {
  const reducedMotion = useReducedMotion()
  const searchParams = useSearchParams()
  const fxParam = searchParams?.get('fx') ?? null
  const warpParam = searchParams?.get('warp') ?? null
  const debugParam = searchParams?.get('debug') ?? null

  const preset = useMemo(() => {
    if (process.env.NODE_ENV === 'production') return DEFAULT_PRESET
    return normalizePreset(fxParam) ?? DEFAULT_PRESET
  }, [fxParam])

  const motionScale = reducedMotion ? 0.6 : 1
  const scanlineOpacity = 0.5 * motionScale
  const scanlineSpeed = 13.5
  const vignetteOpacity = 0.4 * motionScale
  const curvatureOpacity = 0.5 * motionScale
  const curvatureHighlightOpacity = 0.57 * motionScale
  const curvatureShadowOpacity = 0.71 * motionScale
  const warpOverride = normalizeWarp(warpParam)

  const warpScale = useMemo(() => {
    if (warpOverride === 0) return 0
    if (typeof warpOverride === 'number') return warpOverride
    const base = WARP_SCALES[preset]
    return reducedMotion ? base * 0.45 : base
  }, [preset, reducedMotion, warpOverride])

  const defaults = useMemo(
    () => ({
      scanlineOpacity,
      scanlineSpeed,
      vignetteOpacity,
      curvatureOpacity,
      curvatureHighlightOpacity,
      curvatureShadowOpacity,
      warpScale,
      warpPower: DEFAULT_WARP_POWER,
    }),
    [
      scanlineOpacity,
      scanlineSpeed,
      vignetteOpacity,
      curvatureOpacity,
      curvatureHighlightOpacity,
      curvatureShadowOpacity,
      warpScale,
    ],
  )

  const [values, setValues] = useState(defaults)
  const guiRef = useRef<GUI | null>(null)
  const guiStateRef = useRef({ ...defaults })
  const controllersRef = useRef<Record<string, { setValue: (v: number) => void }>>({})

  useEffect(() => {
    if (guiRef.current) {
      Object.entries(defaults).forEach(([key, value]) => {
        guiStateRef.current[key as keyof typeof defaults] = value
        controllersRef.current[key]?.setValue(value)
      })
      setValues({ ...guiStateRef.current })
      return
    }

    guiStateRef.current = { ...defaults }
    setValues(defaults)
  }, [defaults])

  const enableGui =
    process.env.NODE_ENV !== 'production' && (debugParam === 'crt' || debugParam === 'gui')

  useEffect(() => {
    if (typeof window === 'undefined') return

    if (!enableGui) {
      window.dispatchEvent(
        new CustomEvent('crt-debug', { detail: { warpScale: null, warpPower: null } }),
      )
      return
    }

    window.dispatchEvent(
      new CustomEvent('crt-debug', {
        detail: { warpScale: values.warpScale, warpPower: values.warpPower },
      }),
    )
  }, [enableGui, values.warpPower, values.warpScale])

  useEffect(() => {
    if (!enableGui || typeof window === 'undefined') {
      if (guiRef.current) {
        guiRef.current.destroy()
        guiRef.current = null
        controllersRef.current = {}
      }
      return
    }

    if (guiRef.current) return

    const gui = new GUI({ title: 'CRT Overlay' })
    const state = guiStateRef.current

    const bind = (key: keyof typeof state, min: number, max: number, step: number) => {
      const controller = gui
        .add(state, key, min, max, step)
        .onChange(() => setValues({ ...guiStateRef.current }))
      controllersRef.current[key] = controller
    }

    bind('scanlineOpacity', 0, 1, 0.01)
    bind('scanlineSpeed', 4, 30, 0.5)
    bind('vignetteOpacity', 0, 1, 0.01)
    bind('curvatureOpacity', 0, 1, 0.01)
    bind('curvatureHighlightOpacity', 0, 1, 0.01)
    bind('curvatureShadowOpacity', 0, 1, 0.01)
    bind('warpScale', 0, 140, 1)
    bind('warpPower', 1, 5, 0.05)

    gui.add(
      {
        reset: () => {
          Object.entries(defaults).forEach(([key, value]) => {
            guiStateRef.current[key as keyof typeof defaults] = value
            controllersRef.current[key]?.setValue(value)
          })
          setValues({ ...guiStateRef.current })
        },
      },
      'reset',
    )

    guiRef.current = gui

    return () => {
      gui.destroy()
      guiRef.current = null
      controllersRef.current = {}
    }
  }, [defaults, enableGui])

  return (
    <CrtDomOverlay
      opacity={values.scanlineOpacity}
      speedSeconds={values.scanlineSpeed}
      vignetteOpacity={values.vignetteOpacity}
      curvatureOpacity={values.curvatureOpacity}
      curvatureHighlightOpacity={values.curvatureHighlightOpacity}
      curvatureShadowOpacity={values.curvatureShadowOpacity}
    />
  )
}
