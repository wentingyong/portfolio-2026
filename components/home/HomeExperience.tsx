'use client'

import { useLayoutEffect, useRef } from 'react'
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

// Placeholder to tune the About scroll-controlled animation length.
const ABOUT_SCROLL_MULTIPLIER = 1

export function HomeExperience() {
  const sequenceRef = useRef<HTMLDivElement>(null)
  const horizontalTrackRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const aboutRef = useRef<HTMLDivElement>(null)
  const projectsRef = useRef<HTMLDivElement>(null)
  const blogsRef = useRef<HTMLDivElement>(null)

  const reducedMotion = useReducedMotion()
  const isMobile = useIsMobile()

  // Disable horizontal/pin choreography on mobile or reduced motion
  const enableChoreography = !reducedMotion && !isMobile

  useLayoutEffect(() => {
    if (!sequenceRef.current || !horizontalTrackRef.current || !enableChoreography) return

    const ctx = gsap.context(() => {
      const sequence = sequenceRef.current!
      const horizontalTrack = horizontalTrackRef.current!
      const heroPanel = heroRef.current!
      const aboutPanel = aboutRef.current!
      const projectsPanel = projectsRef.current!
      const blogsPanel = blogsRef.current!

      if (!heroPanel || !aboutPanel || !projectsPanel || !blogsPanel) return

      const panels = [heroPanel, aboutPanel, projectsPanel, blogsPanel]
      const aboutContent = sequence.querySelector('[data-anim="about-content"]') as
        | HTMLElement
        | null
      const projectsSection = sequence.querySelector('[data-section="projects"]') as
        | HTMLElement
        | null
      const blogsSection = sequence.querySelector('[data-section="blogs"]') as
        | HTMLElement
        | null

      let timeline: gsap.core.Timeline | null = null

      const buildTimeline = () => {
        const panelWidth = heroPanel.offsetWidth || window.innerWidth
        const panelHeight = heroPanel.offsetHeight || window.innerHeight
        const aboutScroll = panelHeight * ABOUT_SCROLL_MULTIPLIER
        const projectsScroll = projectsSection
          ? Math.max(0, projectsSection.scrollHeight - panelHeight)
          : 0
        const blogsScroll = blogsSection
          ? Math.max(0, blogsSection.scrollHeight - panelHeight)
          : 0

        const totalScroll =
          panelWidth * (panels.length - 1) + aboutScroll + projectsScroll + blogsScroll

        if (timeline) {
          timeline.scrollTrigger?.kill()
          timeline.kill()
        }

        gsap.set(horizontalTrack, {
          x: 0,
          width: panelWidth * panels.length,
          display: 'flex',
          willChange: 'transform',
        })

        gsap.set(panels, {
          width: panelWidth,
          flexShrink: 0,
        })

        if (projectsSection) {
          gsap.set(projectsSection, { y: 0 })
        }

        if (blogsSection) {
          gsap.set(blogsSection, { y: 0 })
        }

        if (aboutContent) {
          gsap.set(aboutContent, { opacity: 0, y: 60 })
        }

        timeline = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: sequence,
            start: 'top top',
            end: `+=${totalScroll}`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        })

        timeline.to(horizontalTrack, {
          x: -panelWidth,
          duration: panelWidth,
        })

        if (aboutContent) {
          timeline.to(aboutContent, {
            opacity: 1,
            y: 0,
            duration: aboutScroll,
          })
        } else {
          timeline.to({}, { duration: aboutScroll })
        }

        timeline.to(horizontalTrack, {
          x: -panelWidth * 2,
          duration: panelWidth,
        })

        if (projectsSection && projectsScroll > 0) {
          timeline.to(projectsSection, {
            y: -projectsScroll,
            duration: projectsScroll,
          })
        }

        timeline.to(horizontalTrack, {
          x: -panelWidth * 3,
          duration: panelWidth,
        })

        if (blogsSection && blogsScroll > 0) {
          timeline.to(blogsSection, {
            y: -blogsScroll,
            duration: blogsScroll,
          })
        }
      }

      buildTimeline()

      const handleResize = () => {
        buildTimeline()
        ScrollTrigger.refresh()
      }

      window.addEventListener('resize', handleResize)

      const resizeObserver = new ResizeObserver(() => {
        buildTimeline()
        ScrollTrigger.refresh()
      })

      if (projectsSection) {
        resizeObserver.observe(projectsSection)
      }

      if (blogsSection) {
        resizeObserver.observe(blogsSection)
      }

      return () => {
        window.removeEventListener('resize', handleResize)
        resizeObserver.disconnect()
        timeline?.scrollTrigger?.kill()
        timeline?.kill()
      }
    }, sequenceRef)

    return () => {
      ctx.revert()
    }
  }, [enableChoreography])

  const rootClassName = enableChoreography
    ? styles.homeExperience
    : `${styles.homeExperience} ${styles['homeExperience--vertical']}`

  return (
    <div className={rootClassName}>
      <div className={styles.homeExperience__sequence} ref={sequenceRef}>
        <div className={styles.homeExperience__horizontalTrack} ref={horizontalTrackRef}>
          <div className={styles.homeExperience__panel} ref={heroRef}>
            <Hero />
          </div>
          <div className={styles.homeExperience__panel} ref={aboutRef}>
            <About />
          </div>
          <div className={styles.homeExperience__panel} ref={projectsRef}>
            <Projects />
          </div>
          <div className={styles.homeExperience__panel} ref={blogsRef}>
            <Blogs />
          </div>
        </div>
      </div>
      <CTA />
    </div>
  )
}
