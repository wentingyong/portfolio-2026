'use client'

import { useCallback, useState, useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from '@/lib/hooks/useReducedMotion'
import { useIsMobile } from '@/lib/hooks/useIsMobile'
import { useActiveSection } from '@/hooks/useActiveSection'
import { NAV_PAGES } from '@/lib/navigation'
import { MenuToggle } from './MenuToggle/MenuToggle'
import { MenuPanel } from './MenuPanel/MenuPanel'
import { PosBar } from './PosBar/PosBar'

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollToPlugin, ScrollTrigger)
}

const MENU_ITEMS = NAV_PAGES.map((item) => ({
  id: item.id,
  index: item.navIndex,
  label: item.navLabel,
  href: item.route,
}))

const ABOUT_SCROLL_MULTIPLIER = 1

// Calculate scroll positions for each section based on timeline structure
function calculateSectionScrollPositions() {
  const horizontalTrigger = ScrollTrigger.getAll().find((st) => st.vars.pin)
  if (!horizontalTrigger) return null

  const triggerStart = horizontalTrigger.start
  const triggerEnd = horizontalTrigger.end

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
  const blogsScroll = blogsSection ? Math.max(0, blogsSection.scrollHeight - panelHeight) : 0

  const aboutScroll = panelHeight * ABOUT_SCROLL_MULTIPLIER

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
    panelWidth,
    aboutScroll,
    projectsScroll,
    blogsScroll,
  }
}

export function Nav() {
  const [menuOpen, setMenuOpen] = useState(false)
  const reducedMotion = useReducedMotion()
  const isMobile = useIsMobile()
  const { activePage, activeSectionId, isHomeRoute } = useActiveSection(NAV_PAGES)
  const isScrollingRef = useRef(false)
  const panelRef = useRef<HTMLElement | null>(null)
  const [isLandingActive, setIsLandingActive] = useState(isHomeRoute)

  const handleToggle = useCallback(() => {
    setMenuOpen((prev) => !prev)
  }, [])

  const handleCloseMenu = useCallback(() => {
    setMenuOpen(false)
  }, [])

  // Close menu when clicking outside panel
  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (!menuOpen) return
      const target = event.target as HTMLElement
      if (panelRef.current && !panelRef.current.contains(target)) {
        // Check if click is not on the toggle button
        const toggleButton = target.closest('[aria-controls="crt-menu-panel"]')
        if (!toggleButton) {
          handleCloseMenu()
        }
      }
    },
    [menuOpen, handleCloseMenu],
  )

  // Add click outside listener
  useEffect(() => {
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [menuOpen, handleClickOutside])

  useEffect(() => {
    if (!isHomeRoute) {
      setIsLandingActive(false)
      return
    }

    const handleLandingStart = () => {
      setMenuOpen(false)
      setIsLandingActive(true)
    }

    const handleLandingComplete = () => {
      setIsLandingActive(false)
    }

    window.addEventListener('landing:start', handleLandingStart)
    window.addEventListener('landing:complete', handleLandingComplete)

    return () => {
      window.removeEventListener('landing:start', handleLandingStart)
      window.removeEventListener('landing:complete', handleLandingComplete)
    }
  }, [isHomeRoute])

  const handleSectionNavigate = useCallback(
    (id: string) => {
      if (typeof window === 'undefined') return

      const sectionEl = document.querySelector(`[data-section="${id}"]`) as HTMLElement | null
      if (!sectionEl) return

      const shouldUseTimeline = isHomeRoute && !isMobile && id !== 'cta'
      const info = shouldUseTimeline ? calculateSectionScrollPositions() : null

      if (shouldUseTimeline && info) {
        // Use calculated position for horizontal scroll sections
        const targetScroll = info.positions[id]

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
            },
          })
          return
        }
      }

      // Fallback for CTA or non-horizontal layouts
      if (reducedMotion) {
        sectionEl.scrollIntoView({ behavior: 'auto', block: 'start' })
      } else {
        isScrollingRef.current = true
        gsap.to(window, {
          scrollTo: {
            y: sectionEl,
            autoKill: false,
          },
          duration: 0.8,
          ease: 'power2.inOut',
          onComplete: () => {
            isScrollingRef.current = false
          },
        })
      }
    },
    [isHomeRoute, isMobile, reducedMotion],
  )

  const navIsHidden = isHomeRoute && isLandingActive
  const navStyle = navIsHidden
    ? { visibility: 'hidden', pointerEvents: 'none' as const }
    : undefined

  return (
    <div aria-hidden={navIsHidden} style={navStyle}>
      <MenuToggle isOpen={menuOpen} onToggle={handleToggle} />
      <MenuPanel ref={panelRef} isOpen={menuOpen} navItems={MENU_ITEMS} activeId={activePage.id} />
      <PosBar
        pageIndex={activePage.navIndex}
        pageLabel={activePage.navLabel}
        sections={activePage.sectionItems}
        activeSectionId={activeSectionId}
        onNavigate={handleSectionNavigate}
      />
    </div>
  )
}
