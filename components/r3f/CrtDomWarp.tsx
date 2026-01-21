'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { useReducedMotion } from '@/lib/hooks/useReducedMotion'
import { DEFAULT_PRESET, normalizePreset } from './fxPreset'
import {
  DEFAULT_WARP_POWER,
  WARP_SCALES,
  normalizeWarp,
} from './crtWarpConfig'
import styles from './CrtDomWarp.module.scss'

const MAP_MAX_SIZE = 256
interface CrtDebugDetail {
  warpScale?: number | null
  warpPower?: number | null
}

function getMapDimensions(target: HTMLElement) {
  const rect = target.getBoundingClientRect()
  const width = Math.max(1, Math.round(rect.width))
  const height = Math.max(1, Math.round(rect.height))
  const maxDimension = Math.max(width, height)
  const scale = MAP_MAX_SIZE / maxDimension
  return {
    width: Math.max(2, Math.round(width * scale)),
    height: Math.max(2, Math.round(height * scale)),
  }
}

function createRadialMap(
  width: number,
  height: number,
  power: number,
): string | null {
  if (typeof document === 'undefined') return null
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  const imageData = ctx.createImageData(width, height)
  const data = imageData.data
  const maxX = Math.max(1, width - 1)
  const maxY = Math.max(1, height - 1)

  // Encode outward radial displacement into RG channels for feDisplacementMap.
  for (let y = 0; y < height; y += 1) {
    const ny = (y / maxY) * 2 - 1
    for (let x = 0; x < width; x += 1) {
      const nx = (x / maxX) * 2 - 1
      const r = Math.min(1, Math.sqrt(nx * nx + ny * ny))
      const mask = Math.pow(r, power)
      const dx = nx * mask
      const dy = ny * mask
      const idx = (y * width + x) * 4
      data[idx] = Math.round((dx * 0.5 + 0.5) * 255)
      data[idx + 1] = Math.round((dy * 0.5 + 0.5) * 255)
      data[idx + 2] = 128
      data[idx + 3] = 255
    }
  }

  ctx.putImageData(imageData, 0, 0)
  return canvas.toDataURL('image/png')
}

export function CrtDomWarp() {
  const reducedMotion = useReducedMotion()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const fxParam = searchParams?.get('fx') ?? null
  const warpParam = searchParams?.get('warp') ?? null
  const [mapUrl, setMapUrl] = useState<string | null>(null)
  const [debugWarpScale, setDebugWarpScale] = useState<number | null>(null)
  const [debugWarpPower, setDebugWarpPower] = useState<number | null>(null)
  const previousTargetRef = useRef<HTMLElement | null>(null)
  const targetRef = useRef<HTMLElement | null>(null)
  const mapKeyRef = useRef<string | null>(null)

  const preset = useMemo(() => {
    if (process.env.NODE_ENV === 'production') return DEFAULT_PRESET
    return normalizePreset(fxParam) ?? DEFAULT_PRESET
  }, [fxParam])

  const warpScale = useMemo(() => {
    if (typeof debugWarpScale === 'number') return debugWarpScale
    const override = normalizeWarp(warpParam)
    if (override === 0) return 0
    if (typeof override === 'number') return override
    const base = WARP_SCALES[preset]
    return reducedMotion ? base * 0.45 : base
  }, [debugWarpScale, preset, reducedMotion, warpParam])

  const warpPower =
    typeof debugWarpPower === 'number' ? debugWarpPower : DEFAULT_WARP_POWER

  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleDebug = (event: Event) => {
      const detail = (event as CustomEvent<CrtDebugDetail>).detail
      if (!detail) return
      if (Object.prototype.hasOwnProperty.call(detail, 'warpScale')) {
        setDebugWarpScale(
          typeof detail.warpScale === 'number' ? detail.warpScale : null,
        )
      }
      if (Object.prototype.hasOwnProperty.call(detail, 'warpPower')) {
        setDebugWarpPower(
          typeof detail.warpPower === 'number' ? detail.warpPower : null,
        )
      }
    }

    window.addEventListener('crt-debug', handleDebug as EventListener)
    return () => window.removeEventListener('crt-debug', handleDebug as EventListener)
  }, [])

  useEffect(() => {
    if (typeof document === 'undefined') return
    const target = document.querySelector<HTMLElement>('[data-crt-warp]')

    if (!target) {
      if (previousTargetRef.current) {
        previousTargetRef.current.classList.remove(styles.warpTarget)
      }
      previousTargetRef.current = null
      targetRef.current = null
      mapKeyRef.current = null
      setMapUrl(null)
      return
    }

    if (previousTargetRef.current && previousTargetRef.current !== target) {
      previousTargetRef.current.classList.remove(styles.warpTarget)
      mapKeyRef.current = null
      setMapUrl(null)
    }

    previousTargetRef.current = target
    targetRef.current = target

    const updateMap = () => {
      const currentTarget = targetRef.current
      if (!currentTarget) return
      const { width, height } = getMapDimensions(currentTarget)
      const key = `${width}x${height}:${warpPower.toFixed(3)}`
      if (mapKeyRef.current === key) return
      mapKeyRef.current = key
      const url = createRadialMap(width, height, warpPower)
      if (url) setMapUrl(url)
    }

    updateMap()
    const resizeObserver = new ResizeObserver(() => {
      updateMap()
    })
    resizeObserver.observe(target)

    return () => {
      resizeObserver.disconnect()
    }
  }, [pathname, warpPower])

  const active = warpScale > 0 && Boolean(mapUrl)

  useEffect(() => {
    if (typeof document === 'undefined') return
    const target = targetRef.current
    if (!target) return

    if (active) {
      target.classList.add(styles.warpTarget)
    } else {
      target.classList.remove(styles.warpTarget)
    }

    return () => {
      target.classList.remove(styles.warpTarget)
    }
  }, [active, pathname])

  return (
    <>
      <svg className={styles.warpSvg} aria-hidden="true">
        <filter
          id="crt-warp"
          x="-20%"
          y="-20%"
          width="140%"
          height="140%"
          filterUnits="objectBoundingBox"
          primitiveUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          {mapUrl ? (
            <>
              <feImage
                href={mapUrl}
                result="warpMap"
                preserveAspectRatio="none"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="warpMap"
                scale={warpScale}
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </>
          ) : null}
        </filter>
      </svg>
    </>
  )
}
