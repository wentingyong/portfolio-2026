'use client'

import { useEffect, useRef, useState } from 'react'
import styles from './CRTLogo.module.scss'

const ASCII_LOGO_LINES = [
  '██╗    ██╗███████╗███╗   ██╗████████╗██╗███╗   ██╗ ██████╗',
  '██║    ██║██╔════╝████╗  ██║╚══██╔══╝██║████╗  ██║██╔════╝',
  '██║ █╗ ██║█████╗  ██╔██╗ ██║   ██║   ██║██╔██╗ ██║██║  ███╗',
  '██║███╗██║██╔══╝  ██║╚██╗██║   ██║   ██║██║╚██╗██║██║   ██║',
  '╚███╔███╔╝███████╗██║ ╚████║   ██║   ██║██║ ╚████║╚██████╔╝',
  ' ╚══╝╚══╝ ╚══════╝╚═╝  ╚═══╝   ╚═╝   ╚═╝╚═╝  ╚═══╝ ╚═════╝',
]

interface CRTLogoProps {
  className?: string
  visible?: boolean
  /** Delay in seconds before starting typewriter */
  delay?: number
}

export function CRTLogo({ className, visible = true, delay = 0 }: CRTLogoProps) {
  const logoRef = useRef<HTMLPreElement>(null)
  const [visibleLines, setVisibleLines] = useState<number[]>([])
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    if (!visible) {
      setVisibleLines([])
      setIsComplete(false)
      return
    }

    // Typewriter effect: reveal lines one by one
    const timers: NodeJS.Timeout[] = []
    const lineDelay = 80 // ms between each line

    ASCII_LOGO_LINES.forEach((_, index) => {
      const timer = setTimeout(() => {
        setVisibleLines((prev) => [...prev, index])
      }, delay * 1000 + index * lineDelay)
      timers.push(timer)
    })

    // Mark complete after all lines shown
    const completeTimer = setTimeout(() => {
      setIsComplete(true)
      if (logoRef.current) {
        logoRef.current.classList.add(styles['crtLogo--complete'])
      }
    }, delay * 1000 + ASCII_LOGO_LINES.length * lineDelay + 500)
    timers.push(completeTimer)

    return () => timers.forEach(clearTimeout)
  }, [visible, delay])

  const classNames = [
    styles.crtLogo,
    visible && styles['crtLogo--visible'],
    isComplete && styles['crtLogo--complete'],
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <pre ref={logoRef} className={classNames} aria-label="WENTING">
      {ASCII_LOGO_LINES.map((line, index) => (
        <div
          key={index}
          className={`${styles.crtLogo__line} ${visibleLines.includes(index) ? styles['crtLogo__line--visible'] : ''}`}
        >
          {line}
        </div>
      ))}
    </pre>
  )
}

export default CRTLogo
