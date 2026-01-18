'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Hero } from './Hero'
import { About } from './About'
import { Projects } from './Projects'
import { Blogs } from './Blogs'
import { CTA } from './CTA'
import { useReducedMotion } from '@/lib/hooks/useReducedMotion'
import { useIsMobile } from '@/lib/hooks/useIsMobile'
import styles from './HomeExperience.module.scss'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export function HomeExperience() {
  const containerRef = useRef<HTMLDivElement>(null)
  const horizontalTrackRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLElement>(null)
  const aboutRef = useRef<HTMLElement>(null)
  const projectsRef = useRef<HTMLElement>(null)
  const blogsRef = useRef<HTMLElement>(null)
  const ctaRef = useRef<HTMLElement>(null)

  const reducedMotion = useReducedMotion()
  const isMobile = useIsMobile()
  const [, setAboutTimelineComplete] = useState(false)

  // Disable horizontal/pin choreography on mobile or reduced motion
  const enableChoreography = !reducedMotion && !isMobile

  useEffect(() => {
    if (!containerRef.current || !enableChoreography) return

    const ctx = gsap.context(() => {
      const container = containerRef.current!
      const horizontalTrack = horizontalTrackRef.current!
      const hero = heroRef.current!
      const about = aboutRef.current!
      const projects = projectsRef.current!

      // Set up horizontal track for Hero and About
      gsap.set(horizontalTrack, {
        display: 'flex',
        width: '200vw',
        x: 0,
      })

      gsap.set([hero, about], {
        width: '100vw',
        flexShrink: 0,
      })

      // Step 1: Horizontal transition Hero → About (first 100vh of scroll)
      const heroToAbout = ScrollTrigger.create({
        trigger: container,
        start: 'top top',
        end: '+=100vh',
        scrub: true,
        onUpdate: (self) => {
          const progress = self.progress
          gsap.set(horizontalTrack, {
            x: `-${progress * 100}vw`,
          })
        },
      })

      // Step 2: Pin About section (starts after Hero→About completes, next 100vh)
      const aboutPin = ScrollTrigger.create({
        trigger: container,
        start: 'top+=100vh top', // Start after Hero→About transition
        end: '+=100vh', // About animation takes 100vh
        pin: about,
        pinSpacing: true,
        anticipatePin: 1,
        onComplete: () => {
          setAboutTimelineComplete(true)
        },
      })

      // Step 3: Horizontal transition About → Projects (after About pin ends)
      const aboutToProjects = ScrollTrigger.create({
        trigger: container,
        start: () => {
          // Start after About pin completes (200vh total: 100vh Hero→About + 100vh About pin)
          return 'top+=200vh top'
        },
        end: '+=100vh',
        scrub: true,
        onUpdate: (self) => {
          const progress = self.progress
          // Continue from -100vw to -200vw (fully transitioned to Projects)
          gsap.set(horizontalTrack, {
            x: `-${100 + progress * 100}vw`,
          })
        },
        onComplete: () => {
          // Hide horizontal track, let Projects scroll normally
          gsap.set(horizontalTrack, { display: 'none' })
        },
      })

      // Refresh triggers on resize
      const handleResize = () => {
        ScrollTrigger.refresh()
      }

      window.addEventListener('resize', handleResize)

      return () => {
        window.removeEventListener('resize', handleResize)
      }
    }, containerRef)

    return () => {
      ctx.revert()
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [enableChoreography])

  // Vertical fallback layout (mobile or reduced motion)
  if (!enableChoreography) {
    return (
      <div className={styles.homeExperience} ref={containerRef}>
        <Hero />
        <About onTimelineComplete={() => setAboutTimelineComplete(true)} />
        <Projects />
        <Blogs />
        <CTA />
      </div>
    )
  }

  // Desktop choreography layout
  return (
    <div className={styles.homeExperience} ref={containerRef}>
      <div className={styles.homeExperience__horizontalTrack} ref={horizontalTrackRef}>
        <div ref={(el) => (heroRef.current = el as HTMLElement)}>
          <Hero />
        </div>
        <div ref={(el) => (aboutRef.current = el as HTMLElement)}>
          <About onTimelineComplete={() => setAboutTimelineComplete(true)} />
        </div>
      </div>
      <div ref={(el) => (projectsRef.current = el as HTMLElement)}>
        <Projects />
      </div>
      <div ref={(el) => (blogsRef.current = el as HTMLElement)}>
        <Blogs />
      </div>
      <div ref={(el) => (ctaRef.current = el as HTMLElement)}>
        <CTA />
      </div>
    </div>
  )
}
