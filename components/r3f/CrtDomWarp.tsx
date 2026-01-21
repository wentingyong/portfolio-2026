'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { useReducedMotion } from '@/lib/hooks/useReducedMotion'
import { DEFAULT_PRESET, normalizePreset } from './fxPreset'
import styles from './CrtDomWarp.module.scss'

const WARP_SCALES = {
  low: 40,
  medium: 60,
  high: 85,
}

const MAP_MAX_SIZE = 256
const MAP_POWER = 2.8

function normalizeWarp(value: string | null): number | null {
  if (!value) return null
  const normalized = value.toLowerCase().trim()
  if (normalized === 'off' || normalized === '0' || normalized === 'false') {
    return 0
  }
  const numeric = Number.parseFloat(normalized)
  return Number.isFinite(numeric) ? numeric : null
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
  const previousFilter = useRef<{ target: HTMLElement | null; value: string }>({
    target: null,
    value: '',
  })
  const targetRef = useRef<HTMLElement | null>(null)
  const mapKeyRef = useRef<string | null>(null)

  const preset = useMemo(() => {
    if (process.env.NODE_ENV === 'production') return DEFAULT_PRESET
    return normalizePreset(fxParam) ?? DEFAULT_PRESET
  }, [fxParam])

  const warpScale = useMemo(() => {
    const override = normalizeWarp(warpParam)
    if (override === 0) return 0
    if (typeof override === 'number') return override
    const base = WARP_SCALES[preset]
    return reducedMotion ? base * 0.45 : base
  }, [preset, reducedMotion, warpParam])

  useEffect(() => {
    if (typeof document === 'undefined') return
    const target = document.querySelector<HTMLElement>('[data-crt-warp]')

    if (!target) {
      if (previousFilter.current.target) {
        previousFilter.current.target.style.filter = previousFilter.current.value
      }
      targetRef.current = null
      mapKeyRef.current = null
      setMapUrl(null)
      return
    }

    if (previousFilter.current.target && previousFilter.current.target !== target) {
      previousFilter.current.target.style.filter = previousFilter.current.value
    }

    targetRef.current = target
    if (previousFilter.current.target !== target) {
      previousFilter.current = { target, value: target.style.filter }
    }

    const updateMap = () => {
      const currentTarget = targetRef.current
      if (!currentTarget) return
      const { width, height } = getMapDimensions(currentTarget)
      const key = `${width}x${height}`
      if (mapKeyRef.current === key) return
      mapKeyRef.current = key
      const url = createRadialMap(width, height, MAP_POWER)
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
  }, [pathname])

  const active = warpScale > 0 && Boolean(mapUrl)

  useEffect(() => {
    if (typeof document === 'undefined') return
    const target = targetRef.current
    if (!target) return

    if (!active) {
      target.style.filter = previousFilter.current.value
      return
    }

    const base = previousFilter.current.value
    const next = base.includes('url(#crt-warp)')
      ? base
      : base
        ? `${base} url(#crt-warp)`
        : 'url(#crt-warp)'
    target.style.filter = next

    return () => {
      target.style.filter = base
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
