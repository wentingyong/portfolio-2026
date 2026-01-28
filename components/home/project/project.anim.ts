import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { typeCrt } from '@/components/shared/crtTypewriter/crtTypewriter'

const MOTION_QUERY = '(prefers-reduced-motion: reduce)'
const reducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia(MOTION_QUERY).matches

type FrameParts = {
  frame: SVGGraphicsElement[]
  dots: SVGGraphicsElement[]
  ticks: SVGGraphicsElement[]
  strokes: SVGGeometryElement[]
}

const strokeLengths = new WeakMap<SVGGeometryElement, number>()

const isGeometryElement = (
  el: SVGGraphicsElement,
): el is SVGGeometryElement => 'getTotalLength' in el

const hasStroke = (el: SVGGraphicsElement) => {
  const stroke = el.getAttribute('stroke')
  return Boolean(stroke && stroke !== 'none')
}

const getStrokeLength = (el: SVGGeometryElement) => {
  const cached = strokeLengths.get(el)
  if (cached) return cached
  const length = Math.max(0, el.getTotalLength())
  strokeLengths.set(el, length)
  return length
}

const collectFrameParts = (frameEl: Element | null): FrameParts | null => {
  if (!frameEl) return null
  const frame = Array.from(
    frameEl.querySelectorAll('[data-part="frame"]'),
  ) as SVGGraphicsElement[]
  const dots = Array.from(
    frameEl.querySelectorAll('[data-part="dots"]'),
  ) as SVGGraphicsElement[]
  const ticks = Array.from(
    frameEl.querySelectorAll('[data-part="ticks"]'),
  ) as SVGGraphicsElement[]

  const strokes = frame.filter(
    (el): el is SVGGeometryElement => isGeometryElement(el) && hasStroke(el),
  )

  return {
    frame,
    dots,
    ticks,
    strokes,
  }
}

const resetFrameParts = (parts: FrameParts | null) => {
  if (!parts) return
  const { frame, dots, ticks, strokes } = parts
  gsap.set(frame, { opacity: 0 })
  gsap.set(dots, { opacity: 0, scale: 0.7, transformOrigin: '50% 50%' })
  gsap.set(ticks, { opacity: 0, scale: 0.85, transformOrigin: '50% 50%' })
  strokes.forEach((el) => {
    const length = getStrokeLength(el)
    gsap.set(el, { strokeDasharray: length, strokeDashoffset: length })
  })
}

const revealFrameInstant = (parts: FrameParts | null) => {
  if (!parts) return
  const { frame, dots, ticks, strokes } = parts
  gsap.set([...frame, ...dots, ...ticks], { opacity: 1, scale: 1 })
  strokes.forEach((el) => {
    gsap.set(el, { strokeDashoffset: 0 })
  })
}

const drawFrame = (
  tl: gsap.core.Timeline,
  parts: FrameParts | null,
  drawDuration = 1,
  position?: gsap.Position,
) => {
  if (!parts) return
  const { frame, dots, ticks, strokes } = parts
  const start = position ?? '>'

  tl.to(frame, { opacity: 1, duration: 0.01 }, start)

  if (strokes.length > 0) {
    tl.to(
      strokes,
      { strokeDashoffset: 0, duration: drawDuration, ease: 'power2.out' },
      '<',
    )
  }

  if (dots.length > 0) {
    tl.to(
      dots,
      { opacity: 1, scale: 1, duration: 0.25, stagger: 0.02 },
      '>-0.1',
    )
  }

  if (ticks.length > 0) {
    tl.to(
      ticks,
      { opacity: 1, scale: 1, duration: 0.2, stagger: 0.015 },
      '<',
    )
  }
}

const queueType = (
  tl: gsap.core.Timeline,
  el: HTMLElement | null,
  position?: gsap.Position,
) => {
  if (!el) return
  const start = position ?? '>'
  tl.set(el, { autoAlpha: 1 }, start)
  tl.add(typeCrt(el), start)
}

export const initProjectsAnim = (root: HTMLElement) => {
  if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger)
  }

  const isReducedMotion = reducedMotion()
  const timelines: gsap.core.Timeline[] = []
  const triggers: ScrollTrigger[] = []
  const cleanupFns: Array<() => void> = []

  const header = root.querySelector('[data-projects-header]') as HTMLElement | null
  const headerTitle = header?.querySelector('[data-text="title"]') as HTMLElement | null
  const headerFrame = collectFrameParts(
    header?.querySelector('[data-frame="title"]') ?? null,
  )

  if (headerTitle) {
    gsap.set(headerTitle, { autoAlpha: 0 })
  }
  resetFrameParts(headerFrame)

  if (header) {
    const headerTl = gsap.timeline({
      scrollTrigger: {
        trigger: header,
        start: 'top bottom',
        end: 'bottom top',
        once: true,
        invalidateOnRefresh: true,
      },
    })

    if (isReducedMotion) {
      headerTl.add(() => revealFrameInstant(headerFrame))
    } else {
      drawFrame(headerTl, headerFrame, 1)
    }

    queueType(headerTl, headerTitle, '>-0.05')

    if (headerTl.scrollTrigger) {
      triggers.push(headerTl.scrollTrigger)
    }
    timelines.push(headerTl)
  }

  const cards = Array.from(
    root.querySelectorAll('[data-project-card]'),
  ) as HTMLElement[]

  cards.forEach((card) => {
    const projectFrame = collectFrameParts(
      card.querySelector('[data-frame="project"]'),
    )
    const imageFrame = collectFrameParts(
      card.querySelector('[data-frame="image"]'),
    )

    const title = card.querySelector('[data-text="title"]') as HTMLElement | null
    const titleLine = card.querySelector('[data-title-line]') as HTMLElement | null
    const roles = card.querySelector('[data-text="roles"]') as HTMLElement | null
    const overview = card.querySelector('[data-text="overview"]') as HTMLElement | null
    const viewcase = card.querySelector('[data-text="viewcase"]') as HTMLElement | null

    const textNodes = [title, roles, overview, viewcase].filter(
      Boolean,
    ) as HTMLElement[]
    if (textNodes.length > 0) {
      gsap.set(textNodes, { autoAlpha: 0 })
    }

    if (titleLine) {
      gsap.set(titleLine, { scaleX: 0, transformOrigin: 'left center' })
    }

    resetFrameParts(projectFrame)
    resetFrameParts(imageFrame)

    const cardTl = gsap.timeline({
      scrollTrigger: {
        trigger: card,
        start: 'top 75%',
        end: 'bottom top',
        once: true,
        invalidateOnRefresh: true,
      },
    })

    if (isReducedMotion) {
      cardTl.add(() => revealFrameInstant(projectFrame))
      if (titleLine) {
        gsap.set(titleLine, { scaleX: 1 })
      }
    } else {
      drawFrame(cardTl, projectFrame, 1.1)
      if (titleLine) {
        cardTl.to(titleLine, { scaleX: 1, duration: 0.6, ease: 'power2.out' }, '>-0.1')
      }
    }

    queueType(cardTl, title, '>-0.05')
    queueType(cardTl, roles)
    queueType(cardTl, overview)
    queueType(cardTl, viewcase)

    if (cardTl.scrollTrigger) {
      triggers.push(cardTl.scrollTrigger)
    }
    timelines.push(cardTl)

    const imageWrap = card.querySelector('[data-project-image]') as HTMLElement | null

    if (imageWrap) {
      gsap.set(imageWrap, { autoAlpha: 0 })
    }

    const imageTl = gsap.timeline({ paused: true })

    if (!isReducedMotion) {
      imageTl.add(() => resetFrameParts(imageFrame))
      drawFrame(imageTl, imageFrame, 0.55)
      if (imageWrap) {
        imageTl.to(imageWrap, { autoAlpha: 1, duration: 0.2 }, '>-0.1')
      }
    }

    const showImage = () => {
      if (!imageWrap) return
      if (isReducedMotion) {
        revealFrameInstant(imageFrame)
        gsap.set(imageWrap, { autoAlpha: 1 })
        return
      }
      imageTl.restart()
    }

    const hideImage = () => {
      if (!imageWrap) return
      imageTl.pause(0)
      gsap.set(imageWrap, { autoAlpha: 0 })
      resetFrameParts(imageFrame)
    }

    const handleMouseLeave = () => {
      if (card.matches(':focus-within')) return
      hideImage()
    }

    const handleFocusOut = (event: FocusEvent) => {
      const next = event.relatedTarget as Node | null
      if (next && card.contains(next)) return
      if (card.matches(':hover')) return
      hideImage()
    }

    card.addEventListener('mouseenter', showImage)
    card.addEventListener('mouseleave', handleMouseLeave)
    card.addEventListener('focusin', showImage)
    card.addEventListener('focusout', handleFocusOut)

    cleanupFns.push(() => {
      card.removeEventListener('mouseenter', showImage)
      card.removeEventListener('mouseleave', handleMouseLeave)
      card.removeEventListener('focusin', showImage)
      card.removeEventListener('focusout', handleFocusOut)
      imageTl.kill()
    })
  })

  return () => {
    cleanupFns.forEach((fn) => fn())
    triggers.forEach((trigger) => trigger.kill())
    timelines.forEach((timeline) => {
      timeline.scrollTrigger?.kill()
      timeline.kill()
    })
  }
}
