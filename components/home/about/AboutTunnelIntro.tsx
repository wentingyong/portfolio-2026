
'use client'

import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import styles from './AboutTunnelIntro.module.scss'

const CLIP_START = 'polygon(48% 48%, 52% 48%, 52% 52%, 48% 52%)'
const CLIP_END = 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)'

export function AboutTunnelIntro() {
  const rootRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    const ctx = gsap.context(() => {
      const screenWrap = root.querySelector<HTMLElement>('[data-about-screen]')
      const structureLayer =
        root.querySelector<HTMLElement>('[data-tunnel-structure]')
      const gridLayer = root.querySelector<HTMLElement>('[data-tunnel-grid]')

      if (!screenWrap || !structureLayer || !gridLayer) return

      if (prefersReducedMotion) {
        gsap.set(screenWrap, { opacity: 1, scale: 1, willChange: 'auto' })
        gsap.set([structureLayer, gridLayer], {
          opacity: 1,
          clipPath: CLIP_END,
        })
        return
      }

      gsap.set(screenWrap, { opacity: 0, scale: 0.96 })
      gsap.set([structureLayer, gridLayer], {
        opacity: 0,
        clipPath: CLIP_START,
      })

      const timeline = gsap.timeline({ defaults: { ease: 'power2.out' } })

      // Phase 1: center screen fades + scales in
      timeline.to(screenWrap, { opacity: 1, scale: 1, duration: 0.45 })

      // Phase 2: structure layer reveals from the center outward
      timeline.to(
        structureLayer,
        { opacity: 1, clipPath: CLIP_END, duration: 0.6 },
        '>'
      )

      // Phase 3: grid layer reveals after structure starts (overlap)
      timeline.to(
        gridLayer,
        { opacity: 1, clipPath: CLIP_END, duration: 0.8 },
        '<+0.12'
      )

      timeline.set(screenWrap, { willChange: 'auto' })
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <div className={styles['about-tunnel']} data-about-tunnel ref={rootRef}>
      <div className={styles['about-tunnel__bg']}>
        <div
          className={`${styles['about-tunnel__layer']} ${styles['about-tunnel__layer--structure']}`}
          data-tunnel-structure
        >
          <img
            className={styles['about-tunnel__img']}
            src="/about/tunnel-structure.svg"
            alt=""
          />
        </div>
        <div
          className={`${styles['about-tunnel__layer']} ${styles['about-tunnel__layer--grid']}`}
          data-tunnel-grid
        >
          <img
            className={styles['about-tunnel__img']}
            src="/about/tunnel-grid.svg"
            alt=""
          />
        </div>
      </div>

      <div className={styles['about-tunnel__screenWrap']} data-about-screen>
        <div className={styles['about-tunnel__screen']}>
          <h2 className={styles['about-tunnel__screenTitle']}>ABOUT</h2>
        </div>
      </div>
    </div>
  )
}
