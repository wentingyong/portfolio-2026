'use client'

import { useEffect, useRef, useState } from 'react'

type InlineSvgProps = {
  src: string
  className?: string
  title?: string
}

const svgCache = new Map<string, string>()

export function InlineSvg({ src, className, title }: InlineSvgProps) {
  const wrapperRef = useRef<HTMLSpanElement | null>(null)
  const [markup, setMarkup] = useState<string | null>(null)

  useEffect(() => {
    if (!markup || !wrapperRef.current) return

    const svg = wrapperRef.current.querySelector('svg')
    if (!svg) return

    if (svg.querySelector('[data-part]')) return

    const paths = Array.from(svg.querySelectorAll('path'))
    if (!paths.length) return

    const byAttr = (attr: 'fill' | 'stroke') =>
      paths.filter((path) => {
        const value = path.getAttribute(attr)
        return value && value !== 'none'
      })

    const fillPaths = byAttr('fill')
    const strokePaths = byAttr('stroke')

    if (src.includes('title-frame.svg')) {
      fillPaths[0]?.setAttribute('data-part', 'dots')
      strokePaths[0]?.setAttribute('data-part', 'frame')
      return
    }

    if (src.includes('project-frame.svg')) {
      fillPaths[0]?.setAttribute('data-part', 'dots')
      strokePaths[0]?.setAttribute('data-part', 'frame')
      return
    }

    if (src.includes('project-image-frame.svg')) {
      fillPaths[0]?.setAttribute('data-part', 'dots')
      strokePaths[0]?.setAttribute('data-part', 'frame')
      strokePaths[1]?.setAttribute('data-part', 'ticks')
    }
  }, [markup, src])

  useEffect(() => {
    let isActive = true

    const loadSvg = async () => {
      const cached = svgCache.get(src)
      if (cached) {
        if (isActive) setMarkup(cached)
        return
      }

      try {
        const response = await fetch(src)
        if (!response.ok) {
          throw new Error(`Failed to fetch SVG: ${src}`)
        }
        const text = await response.text()
        svgCache.set(src, text)
        if (isActive) setMarkup(text)
      } catch (error) {
        if (process.env.NODE_ENV !== 'production') {
          console.warn('[InlineSvg] Failed to load', src, error)
        }
        if (isActive) setMarkup(null)
      }
    }

    loadSvg()

    return () => {
      isActive = false
    }
  }, [src])

  const ariaProps = title
    ? { role: 'img', 'aria-label': title }
    : { 'aria-hidden': 'true' as const }

  return (
    <span ref={wrapperRef} className={className} data-inline-svg {...ariaProps}>
      {markup ? <span dangerouslySetInnerHTML={{ __html: markup }} /> : null}
    </span>
  )
}
