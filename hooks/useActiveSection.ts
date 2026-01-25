'use client'

import { useEffect, useMemo, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { usePathname } from 'next/navigation'
import { NAV_PAGES, type NavPageItem } from '@/lib/navigation'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export function useActiveSection(pages: NavPageItem[] = NAV_PAGES) {
  const pathname = usePathname()

  const activePage = useMemo(() => {
    return pages.find((page) => page.route === pathname) ?? pages[0]
  }, [pages, pathname])

  const activePageId = activePage?.id ?? ''
  const activePageRoute = activePage?.route ?? ''
  const sectionCount = activePage?.sectionItems.length ?? 0

  const [activeSectionId, setActiveSectionId] = useState(() => {
    const initialPage = pages.find((page) => page.route === pathname) ?? pages[0]
    return initialPage?.sectionItems[0]?.id ?? ''
  })

  const isHomeRoute = activePage?.route === '/'

  useEffect(() => {
    if (typeof window === 'undefined') return
    const sectionIds = activePage?.sectionItems.map((section) => section.id) ?? []
    const domMatches = sectionIds.filter((id) => document.querySelector(`[data-section="${id}"]`)).length
    const mainEl = document.querySelector('main')
    const bodyEl = document.body
    const mainRect = mainEl?.getBoundingClientRect()
    const bodyRect = bodyEl?.getBoundingClientRect()
    const mainStyle = mainEl ? window.getComputedStyle(mainEl) : null
    const bodyStyle = bodyEl ? window.getComputedStyle(bodyEl) : null
    const mainInfo = mainEl
      ? {
          display: mainStyle?.display,
          visibility: mainStyle?.visibility,
          opacity: mainStyle?.opacity,
          height: Math.round(mainRect?.height ?? 0),
          width: Math.round(mainRect?.width ?? 0),
          scrollHeight: mainEl.scrollHeight,
        }
      : null
    const bodyInfo = bodyEl
      ? {
          display: bodyStyle?.display,
          visibility: bodyStyle?.visibility,
          opacity: bodyStyle?.opacity,
          height: Math.round(bodyRect?.height ?? 0),
          width: Math.round(bodyRect?.width ?? 0),
          scrollHeight: bodyEl.scrollHeight,
        }
      : null
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/cb40a583-a5f3-45b5-a756-fe8737ba0159',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useActiveSection.ts:26',message:'active page snapshot',data:{pathname,activePageId,activePageRoute,sectionIds,domMatches,mainInfo,bodyInfo,isHomeRoute},timestamp:Date.now(),sessionId:'debug-session',runId:'pre-fix',hypothesisId:'H1'})}).catch(()=>{});
    // #endregion
    const docEl = document.documentElement
    const scrollY = window.scrollY
    const viewportHeight = window.innerHeight
    const docHeight = docEl?.scrollHeight ?? 0
    const maxScroll = docHeight - viewportHeight
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/cb40a583-a5f3-45b5-a756-fe8737ba0159',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useActiveSection.ts:35',message:'scroll context',data:{pathname,scrollY,viewportHeight,docHeight,maxScroll,mainRectTop:mainRect?.top,mainRectBottom:mainRect?.bottom,mainTransform:mainStyle?.transform,bodyTransform:bodyStyle?.transform},timestamp:Date.now(),sessionId:'debug-session',runId:'pre-fix',hypothesisId:'H5'})}).catch(()=>{});
    // #endregion
  }, [pathname, activePageId, activePageRoute, sectionCount, isHomeRoute, activePage])

  useEffect(() => {
    if (!activePage) return
    setActiveSectionId((prev) => {
      const exists = activePage.sectionItems.some((section) => section.id === prev)
      const next = exists ? prev : activePage.sectionItems[0]?.id ?? ''
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/cb40a583-a5f3-45b5-a756-fe8737ba0159',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useActiveSection.ts:36',message:'active section reset check',data:{activePageId,prev,next,exists,sectionCount},timestamp:Date.now(),sessionId:'debug-session',runId:'pre-fix',hypothesisId:'H2'})}).catch(()=>{});
      // #endregion
      return next
    })
  }, [activePage])

  useEffect(() => {
    if (!activePage || typeof window === 'undefined') return

    const elements = activePage.sectionItems
      .map((section) => document.querySelector(`[data-section="${section.id}"]`))
      .filter(Boolean) as HTMLElement[]

    if (elements.length === 0) return

    // For home page with horizontal scroll, use scroll position-based detection
    if (isHomeRoute) {
      const calculateSectionScrollPositions = () => {
        const horizontalTrigger = ScrollTrigger.getAll().find((st) => st.vars.pin)
        if (!horizontalTrigger) return null

        const triggerStart = horizontalTrigger.start
        const triggerEnd = horizontalTrigger.end

        const heroPanel = document
          .querySelector('[data-section="hero"]')
          ?.closest('[class*="panel"]') as HTMLElement | null
        if (!heroPanel) return null

        const panelWidth = heroPanel.offsetWidth || window.innerWidth
        const panelHeight = heroPanel.offsetHeight || window.innerHeight

        const projectsSection = document.querySelector('[data-section="projects"]') as HTMLElement | null
        const blogsSection = document.querySelector('[data-section="blogs"]') as HTMLElement | null
        const projectsScroll = projectsSection
          ? Math.max(0, projectsSection.scrollHeight - panelHeight)
          : 0
        const blogsScroll = blogsSection ? Math.max(0, blogsSection.scrollHeight - panelHeight) : 0

        const aboutScroll = panelHeight * 1

        const positions: Record<string, number> = {
          hero: triggerStart,
          about: triggerStart + panelWidth,
          projects: triggerStart + panelWidth + aboutScroll + panelWidth,
          blogs:
            triggerStart + panelWidth + aboutScroll + panelWidth + projectsScroll + panelWidth,
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

      const getActiveSectionFromScroll = (scrollY: number) => {
        const info = calculateSectionScrollPositions()
        if (!info) {
          const ctaSection = document.querySelector('[data-section="cta"]') as HTMLElement | null
          if (ctaSection) {
            const rect = ctaSection.getBoundingClientRect()
            if (rect.top < window.innerHeight * 0.6 && rect.bottom > window.innerHeight * 0.4) {
              return 'cta'
            }
          }
          return 'hero'
        }

        const { positions, triggerStart, triggerEnd } = info

        if (scrollY > triggerEnd) {
          return 'cta'
        }

        if (scrollY < triggerStart) {
          return 'hero'
        }

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

      let rafId: number | null = null
      const handleScroll = () => {
        if (rafId !== null) {
          cancelAnimationFrame(rafId)
        }
        rafId = requestAnimationFrame(() => {
          const scrollY = window.scrollY
          const nextId = getActiveSectionFromScroll(scrollY)
          setActiveSectionId((prev) => (prev === nextId ? prev : nextId))
        })
      }

      handleScroll()

      window.addEventListener('scroll', handleScroll, { passive: true })
      window.addEventListener('resize', handleScroll, { passive: true })
      ScrollTrigger.addEventListener('refresh', handleScroll)

      return () => {
        window.removeEventListener('scroll', handleScroll)
        window.removeEventListener('resize', handleScroll)
        ScrollTrigger.removeEventListener('refresh', handleScroll)
        if (rafId !== null) {
          cancelAnimationFrame(rafId)
        }
      }
    }

    // For other pages, use IntersectionObserver
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting)
        const sorted = (visible.length ? visible : entries).sort(
          (a, b) => b.intersectionRatio - a.intersectionRatio,
        )
        const mostVisible = sorted[0]
        if (!mostVisible) return
        const nextId = mostVisible.target.getAttribute('data-section')
        if (!nextId) return
        // #region agent log
        fetch('http://127.0.0.1:7243/ingest/cb40a583-a5f3-45b5-a756-fe8737ba0159',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useActiveSection.ts:55',message:'intersection update',data:{activePageId,nextId,visibleCount:visible.length,entries:entries.map((entry)=>({id:entry.target.getAttribute('data-section'),ratio:entry.intersectionRatio,intersecting:entry.isIntersecting}))},timestamp:Date.now(),sessionId:'debug-session',runId:'pre-fix',hypothesisId:'H3'})}).catch(()=>{});
        // #endregion
        setActiveSectionId((prev) => (prev === nextId ? prev : nextId))
      },
      {
        threshold: [0.2, 0.45, 0.6, 0.8],
        rootMargin: '-30% 0px -30% 0px',
      },
    )

    const debugObserver = new IntersectionObserver(
      (entries) => {
        const tiny = entries.filter(
          (entry) => entry.intersectionRatio > 0 && entry.intersectionRatio < 0.2,
        )
        if (tiny.length === 0) return
        // #region agent log
        fetch('http://127.0.0.1:7243/ingest/cb40a583-a5f3-45b5-a756-fe8737ba0159',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useActiveSection.ts:69',message:'low intersection ratios',data:{activePageId,entries:tiny.map((entry)=>({id:entry.target.getAttribute('data-section'),ratio:entry.intersectionRatio,top:Math.round(entry.boundingClientRect.top),height:Math.round(entry.boundingClientRect.height)}))},timestamp:Date.now(),sessionId:'debug-session',runId:'pre-fix',hypothesisId:'H3'})}).catch(()=>{});
        // #endregion
      },
      {
        threshold: [0, 0.05, 0.1, 0.15, 0.2],
        rootMargin: '-30% 0px -30% 0px',
      },
    )

    elements.forEach((element) => observer.observe(element))
    elements.forEach((element) => debugObserver.observe(element))

    return () => {
      observer.disconnect()
      debugObserver.disconnect()
    }
  }, [activePage, isHomeRoute, activePageId])

  return {
    activePage,
    activeSectionId,
    isHomeRoute,
  }
}
