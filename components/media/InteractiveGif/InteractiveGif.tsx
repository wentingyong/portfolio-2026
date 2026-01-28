'use client'

import '@/components/r3f/reactCompat'

import { Canvas } from '@/components/r3f/r3f'
import {
  InteractiveGifPlane,
  type InteractiveGifPlaneProps,
} from '@/components/r3f/InteractiveGifPlane'
import { useReducedMotion } from '@/lib/hooks/useReducedMotion'
import { useCallback, useRef, useState } from 'react'
import styles from './InteractiveGif.module.scss'

export interface InteractiveGifProps extends InteractiveGifPlaneProps {
  className?: string
  fill?: boolean
  dpr?: number
}

export function InteractiveGif({
  className,
  fill = false,
  dpr,
  ...planeProps
}: InteractiveGifProps) {
  const reducedMotion = useReducedMotion()
  const [needsPlay, setNeedsPlay] = useState(false)
  const playRef = useRef<(() => void) | null>(null)

  const handleVideoBlocked = useCallback((playFn: () => void) => {
    playRef.current = playFn
    setNeedsPlay(true)
  }, [])

  const handleVideoPlaying = useCallback(() => {
    playRef.current = null
    setNeedsPlay(false)
  }, [])

  const handleOverlayClick = useCallback(() => {
    playRef.current?.()
  }, [])

  const rootClassName = [
    styles['interactive-gif'],
    fill ? styles['interactive-gif--fill'] : null,
    className ?? null,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={rootClassName} aria-hidden="true">
      <Canvas
        className={styles['interactive-gif__canvas']}
        frameloop="always"
        dpr={dpr ?? 1}
        orthographic
        camera={{ position: [0, 0, 1], zoom: 1, near: 0.1, far: 10 }}
        gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
      >
        <InteractiveGifPlane
          {...planeProps}
          reducedMotion={reducedMotion || planeProps.reducedMotion}
          onVideoBlocked={handleVideoBlocked}
          onVideoPlaying={handleVideoPlaying}
        />
      </Canvas>
      {needsPlay ? (
        <button
          type="button"
          className={styles['interactive-gif__overlay']}
          onClick={handleOverlayClick}
        >
          Click to play
        </button>
      ) : null}
    </div>
  )
}
