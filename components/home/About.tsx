import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './About.module.scss'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

interface AboutProps {
  onTimelineComplete?: () => void
}

export function About({ onTimelineComplete }: AboutProps) {
  const containerRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current || !contentRef.current) return

    const ctx = gsap.context(() => {
      // Simple placeholder animation: fade in and slide up content
      // This timeline will be scrubbed while About is pinned
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=100vh', // Animation completes over 100vh of scroll
          scrub: true,
          pin: false, // Pin is handled by parent orchestrator
          onScrubComplete: () => {
            onTimelineComplete?.()
          },
        },
      })

      tl.fromTo(
        contentRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1 }
      )
    }, containerRef)

    return () => {
      ctx.revert()
    }
  }, [onTimelineComplete])

  return (
    <section className={styles.about} ref={containerRef} data-section="about">
      <div className={styles.about__content} ref={contentRef}>
        <h2 className={styles.about__title}>About</h2>
        <p className={styles.about__text}>About section placeholder</p>
      </div>
    </section>
  )
}
