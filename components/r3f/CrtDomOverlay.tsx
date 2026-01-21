import type { CSSProperties } from 'react'
import styles from './CrtDomOverlay.module.scss'

interface CrtDomOverlayProps {
  opacity?: number
  speedSeconds?: number
}

export function CrtDomOverlay({
  opacity = 0.1,
  speedSeconds = 24,
}: CrtDomOverlayProps) {
  const style = {
    '--crt-scanline-opacity': `${opacity}`,
    '--crt-scanline-speed': `${speedSeconds}s`,
  } as CSSProperties

  return (
    <div className={styles.crtOverlay} style={style} aria-hidden="true">
      <div className={styles.crtOverlay__scanlines} />
    </div>
  )
}
