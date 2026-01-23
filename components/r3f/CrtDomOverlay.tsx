import type { CSSProperties } from 'react'
import styles from './CrtDomOverlay.module.scss'

interface CrtDomOverlayProps {
  opacity?: number
  speedSeconds?: number
  vignetteOpacity?: number
  curvatureOpacity?: number
  curvatureHighlightOpacity?: number
  curvatureShadowOpacity?: number
  scoped?: boolean
}

export function CrtDomOverlay({
  opacity = 0.1,
  speedSeconds = 24,
  vignetteOpacity,
  curvatureOpacity,
  curvatureHighlightOpacity,
  curvatureShadowOpacity,
  scoped = false,
}: CrtDomOverlayProps) {
  const style: CSSProperties & Record<string, string> = {
    '--crt-scanline-opacity-base': `${opacity}`,
    '--crt-scanline-speed-base': `${speedSeconds}s`,
  }

  if (typeof vignetteOpacity === 'number') {
    style['--crt-vignette-opacity-base'] = `${vignetteOpacity}`
  }

  if (typeof curvatureOpacity === 'number') {
    style['--crt-curvature-opacity-base'] = `${curvatureOpacity}`
  }

  if (typeof curvatureHighlightOpacity === 'number') {
    style['--crt-curvature-highlight-base'] = `${curvatureHighlightOpacity}`
  }

  if (typeof curvatureShadowOpacity === 'number') {
    style['--crt-curvature-shadow-base'] = `${curvatureShadowOpacity}`
  }

  const rootClassName = scoped
    ? `${styles.crtOverlay} ${styles['crtOverlay--scoped']}`
    : styles.crtOverlay

  return (
    <div className={rootClassName} style={style} aria-hidden="true">
      <div className={styles.crtOverlay__scanlines} />
      <div className={styles.crtOverlay__vignette} />
      <div className={styles.crtOverlay__curvature} />
    </div>
  )
}
