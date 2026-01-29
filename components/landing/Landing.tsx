'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { useReducedMotion } from '@/lib/hooks/useReducedMotion'
import { createShutdownTimeline, typewriterEffect } from './landing.anim'
import { CRTLogo } from './CRTLogo'
import styles from './Landing.module.scss'

// ============================================
// Types
// ============================================

interface LandingProps {
  onComplete?: () => void
  className?: string
}

// ============================================
// Constants
// ============================================

const SPINNER_CHARS = ['/', '-', '\\', '|']
const IDLE_TIMEOUT = 10000 // 10 seconds
const PROMPT_DELAY = 5000 // 5 seconds - when prompt becomes interactive

// ============================================
// Component
// ============================================

export function Landing({ onComplete, className }: LandingProps) {
  // State - minimal, only for truly dynamic content
  const [spinnerIndex, setSpinnerIndex] = useState(0)
  const [isHovering, setIsHovering] = useState(false)
  const [isExecuting, setIsExecuting] = useState(false)
  const [showIdle, setShowIdle] = useState(false)
  const [isReady, setIsReady] = useState(false) // For keyboard interaction

  // Refs
  const containerRef = useRef<HTMLDivElement>(null)
  const shutdownLineRef = useRef<HTMLDivElement>(null)
  const executingRef = useRef<HTMLSpanElement>(null)
  const gsapCtxRef = useRef<gsap.Context | null>(null)
  const spinnerIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null)
  const hasTriggeredRef = useRef(false)

  // Hooks
  const reducedMotion = useReducedMotion()

  // ============================================
  // Spinner Animation (JS needed for character cycling)
  // ============================================

  useEffect(() => {
    if (isExecuting) {
      if (spinnerIntervalRef.current) {
        clearInterval(spinnerIntervalRef.current)
        spinnerIntervalRef.current = null
      }
      return
    }

    spinnerIntervalRef.current = setInterval(() => {
      setSpinnerIndex((prev) => (prev + 1) % SPINNER_CHARS.length)
    }, 100)

    return () => {
      if (spinnerIntervalRef.current) {
        clearInterval(spinnerIntervalRef.current)
        spinnerIntervalRef.current = null
      }
    }
  }, [isExecuting])

  // ============================================
  // Ready state - enable keyboard after animation timeline
  // ============================================

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true)
    }, PROMPT_DELAY)

    return () => clearTimeout(timer)
  }, [])

  // ============================================
  // Idle Timer (Easter Egg)
  // ============================================

  const resetIdleTimer = useCallback(() => {
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current)
    }
    setShowIdle(false)

    if (isReady && !isExecuting) {
      idleTimerRef.current = setTimeout(() => {
        setShowIdle(true)
      }, IDLE_TIMEOUT)
    }
  }, [isReady, isExecuting])

  useEffect(() => {
    if (!isReady || isExecuting) return

    resetIdleTimer()

    const handleInteraction = () => resetIdleTimer()

    window.addEventListener('mousemove', handleInteraction)
    window.addEventListener('keydown', handleInteraction)
    window.addEventListener('click', handleInteraction)

    return () => {
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current)
      }
      window.removeEventListener('mousemove', handleInteraction)
      window.removeEventListener('keydown', handleInteraction)
      window.removeEventListener('click', handleInteraction)
    }
  }, [isReady, isExecuting, resetIdleTimer])

  // ============================================
  // Execute Shutdown
  // ============================================

  const executeShutdown = useCallback(async () => {
    if (hasTriggeredRef.current || isExecuting) return
    hasTriggeredRef.current = true
    setIsExecuting(true)

    // Clear idle timer
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current)
    }

    // Typewriter the executing text
    if (executingRef.current) {
      await typewriterEffect(
        executingRef.current,
        '> EXECUTING MAIN_SITE.EXE...',
        35,
        reducedMotion
      )
    }

    // Small pause before shutdown
    await new Promise((resolve) => setTimeout(resolve, 250))

    // Run GSAP shutdown animation
    if (containerRef.current) {
      gsapCtxRef.current = gsap.context(() => {
        const tl = createShutdownTimeline({
          container: containerRef.current!,
          shutdownLine: shutdownLineRef.current,
          reducedMotion,
          onComplete,
        })
        tl.play()
      })
    } else {
      onComplete?.()
    }
  }, [isExecuting, reducedMotion, onComplete])

  // ============================================
  // Keyboard Handler
  // ============================================

  useEffect(() => {
    if (!isReady || isExecuting) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        executeShutdown()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isReady, isExecuting, executeShutdown])

  // ============================================
  // Hide scrollbar during landing
  // ============================================

  useEffect(() => {
    // Hide scrollbar when landing is mounted
    document.body.style.overflow = 'hidden'

    return () => {
      // Restore scrollbar when landing unmounts
      document.body.style.overflow = ''
    }
  }, [])

  // ============================================
  // Cleanup
  // ============================================

  useEffect(() => {
    return () => {
      if (spinnerIntervalRef.current) clearInterval(spinnerIntervalRef.current)
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current)

      if (gsapCtxRef.current) {
        gsapCtxRef.current.revert()
      }
    }
  }, [])

  // ============================================
  // Render
  // ============================================

  const containerClasses = [
    styles.landing,
    isExecuting && styles['landing--exiting'],
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div ref={containerRef} className={containerClasses}>
      <div className={styles.landing__container}>
        {/* Top-left: Version & Boot Sequence */}
        <div className={styles.landing__boot}>
          <span className={styles.landing__bootLine}>&gt; v.2026</span>
          <span className={styles.landing__bootLine}>&gt; INITIALIZING...</span>
          <span className={styles.landing__bootLine}>&gt; MEM_CHECK: 64KB OK</span>
          <span className={`${styles.landing__bootLine} ${styles['landing__bootLine--accent']}`}>
            &gt; SYSTEM READY.
          </span>
        </div>

        {/* Center: Main Content */}
        <div className={styles.landing__main}>
          {/* ASCII Logo with typewriter effect */}
          <CRTLogo delay={1.5} />

          {/* Roles - side by side */}
          <div className={styles.landing__roles}>
            <span className={styles.landing__role}>&gt;&gt; DESIGN ENGINEER</span>
            <span className={styles.landing__rolesSeparator}>|</span>
            <span className={styles.landing__role}>&gt;&gt; CREATIVE DEVELOPER</span>
          </div>

          {/* Loading bar - CSS animation handles progress bar */}
          <div className={styles.landing__loading}>
            [████████████████████] LOADING_ASSETS {SPINNER_CHARS[spinnerIndex]}
          </div>

          {/* CTA Prompt - CSS animation timeline controls visibility */}
          <div className={styles.landing__prompt}>
            {!isExecuting && (
              <button
                className={`${styles.landing__promptBtn} ${isHovering ? styles['u-linkBracketHover'] : ''}`}
                onClick={executeShutdown}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                tabIndex={0}
                role="button"
                aria-label="Press Enter to start"
              >
                <span className={styles.landing__promptSymbol}>&gt; </span>
                <span className={styles.landing__promptText}>PRESS [ENTER] TO START</span>
                <span className={styles.landing__cursor} aria-hidden="true" />
              </button>
            )}

            <span ref={executingRef} className={styles.landing__executing} />

            {showIdle && !isExecuting && (
              <div className={`${styles.landing__idle} ${styles['landing__idle--visible']}`}>
                &gt; ARE YOU STILL THERE? (Y/N)_
              </div>
            )}
          </div>
        </div>

        {/* Shutdown Line (CRT effect) */}
        <div ref={shutdownLineRef} className={styles.landing__shutdownLine} />
      </div>
    </div>
  )
}

export default Landing
