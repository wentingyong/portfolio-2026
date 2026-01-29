
'use client'

import { useEffect, useRef, useState } from 'react'
import styles from './StatusLine.module.scss'

interface StatusLineProps {
  children: React.ReactNode
  /** Delay in seconds before animation starts */
  delay?: number
  /** Visual variant */
  variant?: 'status' | 'prompt' | 'loading' | 'accent'
  /** Whether the line is visible (triggers animation) */
  visible?: boolean
  /** Additional class name */
  className?: string
  /** Use typewriter effect instead of fade */
  typewriter?: boolean
}

export function StatusLine({
  children,
  delay = 0,
  variant = 'status',
  visible = true,
  className,
  typewriter = false,
}: StatusLineProps) {
  const lineRef = useRef<HTMLDivElement>(null)
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    if (!visible) {
      setShowContent(false)
      return
    }

    // Delay before showing content
    const showTimer = setTimeout(() => {
      setShowContent(true)
    }, delay * 1000)

    // Remove will-change after animation completes
    const cleanupTimer = setTimeout(
      () => {
        if (lineRef.current) {
          lineRef.current.classList.add(styles['statusLine--complete'])
        }
      },
      (delay + 1) * 1000
    )

    return () => {
      clearTimeout(showTimer)
      clearTimeout(cleanupTimer)
    }
  }, [delay, visible])

  const classNames = [
    styles.statusLine,
    styles[`statusLine--${variant}`],
    showContent && styles['statusLine--visible'],
    typewriter && styles['statusLine--typewriter'],
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div ref={lineRef} className={classNames}>
      {variant === 'prompt' && (
        <span className={styles.statusLine__prompt}>&gt; </span>
      )}
      <span className={styles.statusLine__text}>{children}</span>
    </div>
  )
}

export default StatusLine
