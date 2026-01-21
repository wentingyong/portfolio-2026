'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useReducedMotion } from '@/lib/hooks/useReducedMotion'

export function useCoarsePointer(): boolean {
  const [coarsePointer, setCoarsePointer] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const checkPointer = () => {
      const hasCoarsePointer =
        window.matchMedia?.('(pointer: coarse)').matches ||
        window.matchMedia?.('(hover: none)').matches ||
        navigator.maxTouchPoints > 0
      setCoarsePointer(hasCoarsePointer)
    }

    checkPointer()
    window.addEventListener('resize', checkPointer)
    return () => window.removeEventListener('resize', checkPointer)
  }, [])

  return coarsePointer
}

interface CrtImpulseOptions {
  enabled?: boolean
  reducedMotion?: boolean
  coarsePointer?: boolean
  maxImpulse?: number
  scrollBoost?: number
  clickBoost?: number
  decayRate?: number
  minImpulse?: number
  onTick?: (value: number, dt: number) => void
}

export function useCrtImpulse(options: CrtImpulseOptions = {}) {
  const reducedMotion = options.reducedMotion ?? useReducedMotion()
  const coarsePointer = options.coarsePointer ?? useCoarsePointer()
  const enabled = options.enabled ?? true

  const config = useMemo(() => {
    const baseDefaults = reducedMotion
      ? { maxImpulse: 0.35, scrollBoost: 0.03, clickBoost: 0.1, decayRate: 5.5 }
      : { maxImpulse: 1, scrollBoost: 0.05, clickBoost: 0.2, decayRate: 3.6 }

    const pointerScale = coarsePointer ? 0.75 : 1
    const motionScale = reducedMotion ? 0.4 : 1

    return {
      maxImpulse:
        (options.maxImpulse ?? baseDefaults.maxImpulse) * pointerScale * motionScale,
      scrollBoost:
        (options.scrollBoost ?? baseDefaults.scrollBoost) * pointerScale * motionScale,
      clickBoost:
        (options.clickBoost ?? baseDefaults.clickBoost) * pointerScale * motionScale,
      decayRate:
        (options.decayRate ?? baseDefaults.decayRate) *
        (reducedMotion ? 1.4 : 1),
      minImpulse: options.minImpulse ?? 0.001,
    }
  }, [
    coarsePointer,
    reducedMotion,
    options.maxImpulse,
    options.scrollBoost,
    options.clickBoost,
    options.decayRate,
    options.minImpulse,
  ])

  const configRef = useRef(config)
  const callbacksRef = useRef({ onTick: options.onTick })
  const enabledRef = useRef(enabled)
  const impulseRef = useRef(0)
  const rafRef = useRef<number | null>(null)
  const lastTimeRef = useRef(0)
  const lastPointerDownRef = useRef(0)

  useEffect(() => {
    configRef.current = config
  }, [config])

  useEffect(() => {
    callbacksRef.current.onTick = options.onTick
  }, [options.onTick])

  useEffect(() => {
    enabledRef.current = enabled
    if (!enabled) {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
      impulseRef.current = 0
    }
  }, [enabled])

  const tick = useCallback((time: number) => {
    const delta = Math.min(0.05, (time - lastTimeRef.current) / 1000)
    lastTimeRef.current = time

    const cfg = configRef.current
    if (impulseRef.current > 0) {
      impulseRef.current *= Math.exp(-cfg.decayRate * delta)
      if (impulseRef.current < cfg.minImpulse) {
        impulseRef.current = 0
      }
    }

    callbacksRef.current.onTick?.(impulseRef.current, delta)

    if (impulseRef.current > 0 && enabledRef.current) {
      rafRef.current = requestAnimationFrame(tick)
    } else {
      rafRef.current = null
    }
  }, [])

  const startLoop = useCallback(() => {
    if (rafRef.current !== null) return
    lastTimeRef.current = performance.now()
    rafRef.current = requestAnimationFrame(tick)
  }, [tick])

  const addImpulse = useCallback((amount: number) => {
    if (!enabledRef.current) return
    const cfg = configRef.current
    impulseRef.current = Math.min(cfg.maxImpulse, impulseRef.current + amount)
    callbacksRef.current.onTick?.(impulseRef.current, 0)
    startLoop()
  }, [startLoop])

  useEffect(() => {
    if (typeof window === 'undefined' || !enabled) return

    const handleScroll = () => {
      addImpulse(configRef.current.scrollBoost)
    }

    const handlePointerDown = (event: PointerEvent) => {
      lastPointerDownRef.current = event.timeStamp
      addImpulse(configRef.current.clickBoost)
    }

    const handleClick = (event: MouseEvent) => {
      if (event.timeStamp - lastPointerDownRef.current < 300) return
      addImpulse(configRef.current.clickBoost)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('pointerdown', handlePointerDown, { passive: true })
    window.addEventListener('click', handleClick, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('click', handleClick)
    }
  }, [addImpulse, enabled])

  return {
    impulseRef,
    addImpulse,
    reducedMotion,
    coarsePointer,
  }
}
