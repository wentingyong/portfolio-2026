import { gsap } from 'gsap'

type AboutTimelineConfig = {
  masterTl: gsap.core.Timeline
  aboutPanel: HTMLElement
  aboutScroll: number
  reducedMotion: boolean
  /**
   * Optional explicit start time inside the master timeline.
   * If omitted, the About sequence starts at the current end of masterTl.
   */
  startAt?: number
}

const STRUCTURE_CLIP_START = 'polygon(49% 49%, 51% 49%, 51% 51%, 49% 51%)'
const GRID_CLIP_START = 'polygon(49% 49%, 51% 49%, 51% 51%, 49% 51%)'
const CLIP_FULL = 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)'
const GRID_FILTER_START = 'brightness(1.12) contrast(1.06)'
const GRID_FILTER_END = 'brightness(1) contrast(1)'

export function buildAboutSectionTimeline({
  masterTl,
  aboutPanel,
  aboutScroll,
  reducedMotion,
  startAt,
}: AboutTimelineConfig): boolean {
  const screenWrap = aboutPanel.querySelector<HTMLElement>('[data-about-screen]')
  const structureLayer =
    aboutPanel.querySelector<HTMLElement>('[data-tunnel-structure]')
  const gridLayer = aboutPanel.querySelector<HTMLElement>('[data-tunnel-grid]')
  const gridImg = gridLayer?.querySelector<HTMLImageElement>('img') ?? null

  const missing: string[] = []
  if (!screenWrap) missing.push('[data-about-screen]')
  if (!structureLayer) missing.push('[data-tunnel-structure]')
  if (!gridLayer) missing.push('[data-tunnel-grid]')

  if (missing.length > 0) {
    console.warn(
      `[AboutTimeline] Missing required elements: ${missing.join(', ')}`,
    )
    return false
  }

  if (reducedMotion) {
    // Reduced motion: force final state immediately.
    gsap.set(screenWrap, { opacity: 1, scale: 1, willChange: 'auto' })
    gsap.set(structureLayer, {
      opacity: 1,
      clipPath: CLIP_FULL,
      webkitClipPath: CLIP_FULL,
    })
    gsap.set(gridLayer, {
      opacity: 1,
      clipPath: CLIP_FULL,
      webkitClipPath: CLIP_FULL,
    })
    if (gridImg) {
      gsap.set(gridImg, { filter: GRID_FILTER_END, willChange: 'auto' })
    } else {
      gsap.set(gridLayer, { filter: GRID_FILTER_END })
    }
    return true
  }

  // Initial states to avoid flashes before scroll starts.
  gsap.set(structureLayer, {
    opacity: 0,
    clipPath: STRUCTURE_CLIP_START,
    webkitClipPath: STRUCTURE_CLIP_START,
    willChange: 'opacity, clip-path',
  })
  gsap.set(gridLayer, {
    opacity: 0,
    clipPath: GRID_CLIP_START,
    webkitClipPath: GRID_CLIP_START,
    willChange: 'opacity, clip-path',
  })
  if (gridImg) {
    gsap.set(gridImg, {
      filter: GRID_FILTER_START,
      willChange: 'filter',
    })
  }
  gsap.set(screenWrap, {
    opacity: 0,
    scale: 0.92,
    transformOrigin: '50% 50%',
    willChange: 'transform, opacity',
  })

  const total = Math.max(aboutScroll, 1)
  const startTime = startAt ?? masterTl.duration()

  /**
   * Timeline tuning (0 → 1 = start → end of About scroll segment).
   * Adjust these values to retime the sequence without changing GSAP code.
   * Example: make structure slower by increasing structure.end to 0.5.
   */
  const phases = {
  screen:   { start: 0.00, end: 0.15 }, 
  structure:{ start: 0.00, end: 0.55 }, 
  grid:     { start: 0.4, end: 0.95 },
  }

  const toDuration = (phase: { start: number; end: number }) =>
    Math.max(0.001, (phase.end - phase.start) * total)
  const at = (progress: number) => progress * total

  const aboutTl = gsap.timeline({ defaults: { ease: 'none' } })

  // Structure reveal: center → full.
  aboutTl.to(
    structureLayer,
    {
      opacity: 1,
      clipPath: CLIP_FULL,
      webkitClipPath: CLIP_FULL,
      duration: toDuration(phases.structure),
    },
    at(phases.structure.start),
  )

  // Grid reveal: vertical line → full. (If you want a box reveal, swap GRID_CLIP_START to STRUCTURE_CLIP_START.)
  aboutTl.to(
    gridLayer,
    {
      opacity: 1,
      clipPath: CLIP_FULL,
      webkitClipPath: CLIP_FULL,
      duration: toDuration(phases.grid),
    },
    at(phases.grid.start),
  )
  if (gridImg) {
    aboutTl.to(
      gridImg,
      { filter: GRID_FILTER_END, duration: toDuration(phases.grid) },
      at(phases.grid.start),
    )
  } else {
    aboutTl.to(
      gridLayer,
      { filter: GRID_FILTER_END, duration: toDuration(phases.grid) },
      at(phases.grid.start),
    )
  }

  // Screen reveal: last.
  aboutTl.to(
    screenWrap,
    { opacity: 1, scale: 1, duration: toDuration(phases.screen) },
    at(phases.screen.start),
  )

  aboutTl.set(
    [structureLayer, gridLayer, screenWrap],
    { willChange: 'auto' },
    total,
  )
  if (gridImg) {
    aboutTl.set(gridImg, { willChange: 'auto' }, total)
  }

  masterTl.add(aboutTl, startTime)
  return true
}
