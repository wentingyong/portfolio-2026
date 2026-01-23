'use client'

import { useCallback, useEffect, useRef } from 'react'

interface ImpulseDecayOptions {
  maxImpulse?: number
  decayRate?: number
  minImpulse?: number
  disabled?: boolean
  continuous?: boolean
}

type ImpulseTick = (impulse: number, dt: number) => void

export function useImpulseDecay(options: ImpulseDecayOptions = {}) {
  const impulseRef = useRef(0)
  const rafRef = useRef<number | null>(null)
  const lastTimeRef = useRef(0)
  const callbackRef = useRef<ImpulseTick | null>(null)
  const configRef = useRef({
    maxImpulse: options.maxImpulse ?? 1,
    decayRate: options.decayRate ?? 3.6,
    minImpulse: options.minImpulse ?? 0.001,
    disabled: options.disabled ?? false,
    continuous: options.continuous ?? false,
  })

  useEffect(() => {
    configRef.current = {
      maxImpulse: options.maxImpulse ?? 1,
      decayRate: options.decayRate ?? 3.6,
      minImpulse: options.minImpulse ?? 0.001,
      disabled: options.disabled ?? false,
      continuous: options.continuous ?? false,
    }
  }, [
    options.maxImpulse,
    options.decayRate,
    options.minImpulse,
    options.disabled,
    options.continuous,
  ])

  const stopLoop = useCallback(() => {
    if (rafRef.current === null) return
    cancelAnimationFrame(rafRef.current)
    rafRef.current = null
  }, [])

  useEffect(() => {
    if (!options.disabled) return
    stopLoop()
    impulseRef.current = 0
  }, [options.disabled, stopLoop])

  const tick = useCallback((time: number) => {
    const delta = Math.min(0.05, (time - lastTimeRef.current) / 1000)
    lastTimeRef.current = time

    const cfg = configRef.current
    if (!cfg.disabled && impulseRef.current > 0) {
      impulseRef.current *= Math.exp(-cfg.decayRate * delta)
      if (impulseRef.current < cfg.minImpulse) {
        impulseRef.current = 0
      }
    }

    callbackRef.current?.(impulseRef.current, delta)

    if (!cfg.disabled && (cfg.continuous || impulseRef.current > cfg.minImpulse)) {
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

  const startDecay = useCallback((onTick?: ImpulseTick) => {
    callbackRef.current = onTick ?? null
    const cfg = configRef.current
    if (cfg.disabled) return
    if (!cfg.continuous && impulseRef.current <= cfg.minImpulse) return
    startLoop()
  }, [startLoop])

  const addImpulse = useCallback((amount = 1) => {
    const cfg = configRef.current
    if (cfg.disabled) return
    const safeAmount = Math.max(0, amount)
    impulseRef.current = Math.min(cfg.maxImpulse, impulseRef.current + safeAmount)
    callbackRef.current?.(impulseRef.current, 0)
    if (impulseRef.current > cfg.minImpulse) {
      startLoop()
    }
  }, [startLoop])

  useEffect(() => stopLoop, [stopLoop])

  return { impulseRef, addImpulse, startDecay }
}
