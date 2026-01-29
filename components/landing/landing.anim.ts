import { gsap } from 'gsap'

/**
 * Configuration for shutdown animation
 */
interface ShutdownConfig {
  container: HTMLElement
  shutdownLine: HTMLElement | null
  reducedMotion: boolean
  onComplete?: () => void
}

/**
 * Creates the CRT shutdown timeline with vertical collapse → horizontal collapse
 * For reduced motion: simple fade out
 */
export function createShutdownTimeline({
  container,
  shutdownLine,
  reducedMotion,
  onComplete,
}: ShutdownConfig): gsap.core.Timeline {
  const tl = gsap.timeline({
    paused: true,
    onComplete,
  })

  if (reducedMotion) {
    // Simple fade for reduced motion users
    tl.to(container, {
      opacity: 0,
      duration: 0.3,
      ease: 'power2.inOut',
    })
  } else {
    // Phase 1: Vertical collapse to thin line
    tl.to(container, {
      scaleY: 0.003,
      duration: 0.4,
      ease: 'power3.in',
      transformOrigin: 'center center',
    })

    // Phase 2: Show bright shutdown line
    if (shutdownLine) {
      tl.set(
        shutdownLine,
        {
          opacity: 1,
          scaleX: 1,
        },
        '-=0.1'
      )
    }

    // Phase 3: Horizontal collapse
    tl.to(
      container,
      {
        scaleX: 0,
        duration: 0.25,
        ease: 'power4.in',
      },
      '+=0.08'
    )

    // Phase 4: Fade the shutdown line
    if (shutdownLine) {
      tl.to(
        shutdownLine,
        {
          opacity: 0,
          scaleX: 0,
          duration: 0.15,
          ease: 'power2.out',
        },
        '-=0.1'
      )
    }
  }

  return tl
}

/**
 * Typewriter effect for executing text
 * Returns a promise that resolves when typing is complete
 */
export function typewriterEffect(
  element: HTMLElement,
  text: string,
  charDelay: number = 40,
  reducedMotion: boolean = false
): Promise<void> {
  return new Promise((resolve) => {
    if (reducedMotion) {
      // Instant reveal for reduced motion
      element.textContent = text
      resolve()
      return
    }

    let index = 0
    element.textContent = ''

    const interval = setInterval(() => {
      if (index < text.length) {
        element.textContent += text[index]
        index++
      } else {
        clearInterval(interval)
        resolve()
      }
    }, charDelay)
  })
}

/**
 * Create a random delay within a range
 */
export function randomDelay(min: number, max: number): number {
  return Math.random() * (max - min) + min
}
