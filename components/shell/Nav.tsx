'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { gsap } from 'gsap'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from '@/lib/hooks/useReducedMotion'
import styles from './Nav.module.scss'

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollToPlugin, ScrollTrigger)
}

interface NavItem {
  id: string
  label: string
  index: string
}

const navItems: NavItem[] = [
  { id: 'hero', label: 'Home', index: '00' },
  { id: 'about', label: 'About', index: '01' },
  { id: 'projects', label: 'Projects', index: '02' },
  { id: 'blogs', label: 'Blogs', index: '03' },
  { id: 'cta', label: 'Contact', index: '04' },
]

// Calculate scroll positions for each section based on timeline structure
function calculateSectionScrollPositions() {
  const horizontalTrigger = ScrollTrigger.getAll().find(st => st.vars.pin)
  if (!horizontalTrigger) return null

  const triggerStart = horizontalTrigger.start
  const triggerEnd = horizontalTrigger.end
  const totalScrollDistance = triggerEnd - triggerStart

  // Get panel dimensions
  const heroPanel = document.querySelector('[data-section="hero"]')?.closest('[class*="panel"]') as HTMLElement
  if (!heroPanel) return null

  const panelWidth = heroPanel.offsetWidth || window.innerWidth
  const panelHeight = heroPanel.offsetHeight || window.innerHeight

  // Get scrollable content heights
  const projectsSection = document.querySelector('[data-section="projects"]') as HTMLElement
  const blogsSection = document.querySelector('[data-section="blogs"]') as HTMLElement

  const projectsScroll = projectsSection
    ? Math.max(0, projectsSection.scrollHeight - panelHeight)
    : 0
  const blogsScroll = blogsSection
    ? Math.max(0, blogsSection.scrollHeight - panelHeight)
    : 0

  const aboutScroll = panelHeight * 1 // ABOUT_SCROLL_MULTIPLIER = 1

  // Timeline structure:
  // 1. Hero (start) -> About transition: panelWidth
  // 2. About content animation: aboutScroll
  // 3. About -> Projects transition: panelWidth
  // 4. Projects internal scroll: projectsScroll
  // 5. Projects -> Blogs transition: panelWidth
  // 6. Blogs internal scroll: blogsScroll

  const positions: Record<string, number> = {
    hero: triggerStart,
    about: triggerStart + panelWidth,
    projects: triggerStart + panelWidth + aboutScroll + panelWidth,
    blogs: triggerStart + panelWidth + aboutScroll + panelWidth + projectsScroll + panelWidth,
  }

  return {
    positions,
    triggerStart,
    triggerEnd,
    totalScrollDistance,
    panelWidth,
    aboutScroll,
    projectsScroll,
    blogsScroll,
  }
}

// Determine which section is active based on current scroll position
function getActiveSectionFromScroll(
  scrollY: number,
  info = calculateSectionScrollPositions()
): string {
  
  if (!info) {
    // Fallback: check CTA section visibility
    const ctaSection = document.querySelector('[data-section="cta"]') as HTMLElement
    if (ctaSection) {
      const rect = ctaSection.getBoundingClientRect()
      if (rect.top < window.innerHeight * 0.6 && rect.bottom > window.innerHeight * 0.4) {
        return 'cta'
      }
    }
    return 'hero'
  }

  const { positions, triggerStart, triggerEnd, panelWidth, aboutScroll, projectsScroll, blogsScroll } = info

  // Check if we're past the horizontal scroll section (CTA)
  if (scrollY > triggerEnd) {
    return 'cta'
  }

  // Before horizontal scroll starts
  if (scrollY < triggerStart) {
    return 'hero'
  }

  // Calculate ranges for each section
  const heroEnd = positions.about
  const aboutEnd = positions.projects
  const projectsEnd = positions.blogs
  const blogsEnd = triggerEnd

  if (scrollY < heroEnd) {
    return 'hero'
  } else if (scrollY < aboutEnd) {
    return 'about'
  } else if (scrollY < projectsEnd) {
    return 'projects'
  } else if (scrollY <= blogsEnd) {
    return 'blogs'
  }

  return 'cta'
}

function isInHorizontalTransition(
  scrollY: number,
  info: NonNullable<ReturnType<typeof calculateSectionScrollPositions>>
): boolean {
  const { triggerStart, positions, aboutScroll, projectsScroll } = info

  const transitions: Array<[number, number]> = [
    [triggerStart, positions.about],
    [positions.about + aboutScroll, positions.projects],
    [positions.projects + projectsScroll, positions.blogs],
  ]

  return transitions.some(([start, end]) => scrollY > start && scrollY < end)
}

export function Nav() {
  const [activeSection, setActiveSection] = useState<string>('hero')
  const reducedMotion = useReducedMotion()
  const scrollListenerRef = useRef<number | null>(null)
  const isScrollingRef = useRef(false)
  const navContainerRef = useRef<HTMLDivElement>(null)
  const navVisibilityRef = useRef<'shown' | 'hidden'>('shown')
  const hasUserScrolledRef = useRef(false)
  const lastScrollYRef = useRef<number | null>(null)

  // Scroll to section handler
  const handleClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault()

    const section = document.querySelector(`[data-section="${sectionId}"]`) as HTMLElement
    if (!section) return

    // Calculate target scroll position
    const info = calculateSectionScrollPositions()
    
    if (info && sectionId !== 'cta') {
      // Use calculated position for horizontal scroll sections
      const targetScroll = info.positions[sectionId]
      
      if (targetScroll !== undefined) {
        isScrollingRef.current = true
        
        gsap.to(window, {
          scrollTo: { 
            y: targetScroll, 
            autoKill: false,
          },
          duration: reducedMotion ? 0 : 0.8,
          ease: 'power2.inOut',
          onComplete: () => {
            isScrollingRef.current = false
            setActiveSection(sectionId)
          },
        })
        return
      }
    }

    // Fallback for CTA or non-horizontal layouts
    if (reducedMotion) {
      section.scrollIntoView({ behavior: 'auto', block: 'start' })
      setActiveSection(sectionId)
    } else {
      isScrollingRef.current = true
      gsap.to(window, {
        scrollTo: { 
          y: section, 
          autoKill: false,
        },
        duration: 0.8,
        ease: 'power2.inOut',
        onComplete: () => {
          isScrollingRef.current = false
          setActiveSection(sectionId)
        },
      })
    }
  }, [reducedMotion])

  // Scroll-spy: detect active section based on scroll position
  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleScroll = () => {
      // Don't update during programmatic scrolling
      if (isScrollingRef.current) return

      // Cancel previous animation frame
      if (scrollListenerRef.current) {
        cancelAnimationFrame(scrollListenerRef.current)
      }

      // Throttle with requestAnimationFrame
      scrollListenerRef.current = requestAnimationFrame(() => {
        const scrollY = window.scrollY
        const info = calculateSectionScrollPositions()
        const newActiveSection = getActiveSectionFromScroll(scrollY, info)

        setActiveSection(prev => {
          if (prev !== newActiveSection) {
            return newActiveSection
          }
          return prev
        })

        const navEl = navContainerRef.current
        if (!navEl) return

        if (reducedMotion || !info) {
          if (navVisibilityRef.current !== 'shown') {
            navVisibilityRef.current = 'shown'
            gsap.set(navEl, { autoAlpha: 1 })
          }
          return
        }

        if (lastScrollYRef.current === null) {
          lastScrollYRef.current = scrollY
        }

        if (Math.abs(scrollY - lastScrollYRef.current) > 0) {
          hasUserScrolledRef.current = true
          lastScrollYRef.current = scrollY
        }

        if (!hasUserScrolledRef.current) {
          if (navVisibilityRef.current !== 'shown') {
            navVisibilityRef.current = 'shown'
            gsap.set(navEl, { autoAlpha: 1 })
          }
          return
        }

        const heroRevealThreshold = info.triggerStart + Math.max(2, info.panelWidth * 0.002)
        if (scrollY <= heroRevealThreshold) {
          if (navVisibilityRef.current !== 'shown') {
            navVisibilityRef.current = 'shown'
            gsap.set(navEl, { autoAlpha: 1 })
          }
          return
        }

        const shouldHide = isInHorizontalTransition(scrollY, info)
        const nextState: 'shown' | 'hidden' = shouldHide ? 'hidden' : 'shown'

        if (navVisibilityRef.current !== nextState) {
          navVisibilityRef.current = nextState
          gsap.to(navEl, {
            autoAlpha: shouldHide ? 0 : 1,
            duration: 0.22,
            ease: 'steps(4)',
            overwrite: true,
          })
        }
      })
    }

    // Initial check
    handleScroll()

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (scrollListenerRef.current) {
        cancelAnimationFrame(scrollListenerRef.current)
      }
    }
  }, [reducedMotion])

  return (
    <nav className={styles.nav} aria-label="Primary">
      <div className={`${styles.nav__container} crt-frame`} ref={navContainerRef}>

        <div className={`${styles.nav__line} crt-frame__line`} aria-hidden="true" />


        {/* Content inside the box */}
        <div className={styles.nav__content}>
          <span className={styles.nav__label}>NAV:</span>
          <ul className={styles.nav__list}>
            {navItems.map((item, index) => {
              const isActive = activeSection === item.id
              const isFirst = index === 0

              return (
                <li key={item.id} className={`${styles.nav__item}`}>
                  
                  <a
                    href={`#${item.id}`}
                    className={`${styles.nav__link} ${isActive ? styles['nav__link--active'] : ''}`}
                    onClick={(e) => handleClick(e, item.id)}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {isActive && (
                      <span className={styles.nav__cursor} aria-hidden="true">
                        ▶
                      </span>
                    )}
                    <span className={`${styles.nav__linkText} ${isActive ? styles['nav__linkText--active'] : ''}`}>
                      {item.index} {item.label.toUpperCase()}
                    </span>
                  </a>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </nav>
  )
}
