import { gsap } from 'gsap'

type HeroTransitionConfig = {
  masterTl: gsap.core.Timeline
  heroPanel: HTMLElement
  sequence: HTMLElement
  horizontalTrack: HTMLElement
  panelWidth: number
  reducedMotion: boolean
}

export const buildHeroToAboutTransitionTimeline = ({
  masterTl,
  heroPanel,
  sequence,
  horizontalTrack,
  panelWidth,
  reducedMotion,
}: HeroTransitionConfig) => {
  const heroComposeLayer = heroPanel.querySelector('[data-hero-compose]') as
    | HTMLElement
    | null
  const heroComposeStack = heroPanel.querySelector('[data-hero-compose-stack]') as
    | HTMLElement
    | null
  const heroEyes = heroPanel.querySelector('[data-hero-eyes]') as HTMLElement | null
  const heroEyesOrigin = heroPanel.querySelector('[data-hero-eyes-origin]') as
    | HTMLElement
    | null
  const heroMouthOrigin = heroPanel.querySelector('[data-hero-mouth-origin]') as
    | HTMLElement
    | null
  const heroRest = heroPanel.querySelector('[data-hero-rest]') as HTMLElement | null
  const portalLineDom = sequence.querySelector('[data-portal-line]') as HTMLElement | null
  const heroFadeTargets = Array.from(
    heroPanel.querySelectorAll('[data-hero-fade]'),
  ) as HTMLElement[]

  const missingElements: string[] = []
  if (!heroComposeLayer) missingElements.push('[data-hero-compose]')
  if (!heroComposeStack) missingElements.push('[data-hero-compose-stack]')
  if (!heroEyes) missingElements.push('[data-hero-eyes]')
  if (!heroRest) missingElements.push('[data-hero-rest]')

  if (missingElements.length > 0) {
    console.warn(
      `[HeroAboutTransition] Missing required elements: ${missingElements.join(', ')}`,
    )
  }

  // #region agent log
  fetch('http://127.0.0.1:7243/ingest/cb40a583-a5f3-45b5-a756-fe8737ba0159',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'debug-1',hypothesisId:'H1',location:'hero.anim.ts:53',message:'entry element snapshot',data:{missing:missingElements,eyes:heroEyes?{opacity:getComputedStyle(heroEyes).opacity,visibility:getComputedStyle(heroEyes).visibility,w:heroEyes.getBoundingClientRect().width,h:heroEyes.getBoundingClientRect().height}:null,eyesOrigin:heroEyesOrigin?{opacity:getComputedStyle(heroEyesOrigin).opacity,visibility:getComputedStyle(heroEyesOrigin).visibility,w:heroEyesOrigin.getBoundingClientRect().width,h:heroEyesOrigin.getBoundingClientRect().height}:null,compose:heroComposeLayer?{opacity:getComputedStyle(heroComposeLayer).opacity,visibility:getComputedStyle(heroComposeLayer).visibility}:null},timestamp:Date.now()})}).catch(()=>{});
  // #endregion

  const transitionDuration = panelWidth
  const phase1 = transitionDuration * 0.35
  const phase2 = transitionDuration * 0.2
  const phase3 = transitionDuration * 0.2
  const phase4 = transitionDuration * 0.15
  const phase5 = transitionDuration * 0.1
  const t1 = phase1
  const t2 = phase1 + phase2
  const t3 = phase1 + phase2 + phase3
  const t4 = phase1 + phase2 + phase3 + phase4
  const clearDuration = phase1 * 0.2
  const moveDuration = phase1 * 0.5
  const clearEnd = clearDuration
  const moveStart = clearEnd

  const transitionTl = gsap.timeline({
    defaults: { ease: 'none' },
  })

  const masterStart = masterTl.duration()
  const addMasterLabel = (name: string, time: number) => {
    masterTl.addLabel(name, masterStart + time)
  }

  transitionTl.addLabel('hero_hold_start', 0)
  transitionTl.addLabel('hero_collapse', t1)
  transitionTl.addLabel('jump_to_about', t2)
  transitionTl.addLabel('about_boot', t3)

  addMasterLabel('hero_hold_start', 0)
  addMasterLabel('hero_collapse', t1)
  addMasterLabel('jump_to_about', t2)
  addMasterLabel('about_boot', t3)

  transitionTl.set(
    horizontalTrack,
    {
      x: 0,
    },
    0,
  )

  if (
    !heroComposeLayer ||
    !heroComposeStack ||
    !heroEyes ||
    !heroRest
  ) {
    transitionTl.to(
      horizontalTrack,
      { x: -panelWidth, duration: transitionDuration },
      0,
    )
    masterTl.add(transitionTl)
    return false
  }

  gsap.set(heroComposeLayer, { autoAlpha: 0 })
  gsap.set(heroComposeStack, {
    x: 0,
    y: 0,
    scaleY: 1,
    autoAlpha: 1,
    clipPath: 'inset(0% 0% 0% 0%)',
    transformOrigin: 'center',
  })
  gsap.set(heroEyes, { x: 0, y: 0 })
  gsap.set(heroRest, { autoAlpha: 1, pointerEvents: 'auto' })
  gsap.set(heroFadeTargets, { opacity: 1 })
  if (heroEyesOrigin) {
    gsap.set(heroEyesOrigin, { autoAlpha: 1 })
  }
  if (heroMouthOrigin) {
    gsap.set(heroMouthOrigin, { opacity: 1 })
  }
  if (portalLineDom) {
    gsap.set(portalLineDom, { autoAlpha: 0, scaleX: 0.2 })
  }

  // #region agent log
  fetch('http://127.0.0.1:7243/ingest/cb40a583-a5f3-45b5-a756-fe8737ba0159',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'debug-1',hypothesisId:'H1',location:'hero.anim.ts:133',message:'post-init visibility',data:{eyes:heroEyes?{opacity:getComputedStyle(heroEyes).opacity,visibility:getComputedStyle(heroEyes).visibility,transform:getComputedStyle(heroEyes).transform}:null,eyesOrigin:heroEyesOrigin?{opacity:getComputedStyle(heroEyesOrigin).opacity,visibility:getComputedStyle(heroEyesOrigin).visibility}:null,compose:heroComposeLayer?{opacity:getComputedStyle(heroComposeLayer).opacity,visibility:getComputedStyle(heroComposeLayer).visibility}:null,rest:heroRest?{opacity:getComputedStyle(heroRest).opacity,visibility:getComputedStyle(heroRest).visibility}:null},timestamp:Date.now()})}).catch(()=>{});
  // #endregion

  if (reducedMotion) {
    // Reduced motion: simple crossfade while the track slides.
    transitionTl.to(
      horizontalTrack,
      { x: -panelWidth, duration: transitionDuration },
      0,
    )
    transitionTl.to(
      heroRest,
      { autoAlpha: 0, duration: transitionDuration * 0.6 },
      0,
    )
    transitionTl.to(
      heroComposeLayer,
      { autoAlpha: 0, duration: transitionDuration * 0.5 },
      0,
    )
    masterTl.add(transitionTl)
    return true
  }

  const holdDuration = t2
  const postJumpDuration = Math.max(0.001, transitionDuration - holdDuration)

  // Hold the track in place during phases A+B.
  transitionTl.to(
    horizontalTrack,
    { x: 0, duration: holdDuration, overwrite: 'auto' },
    0,
  )

  const lineClip =
    'inset(calc(50% - (var(--hero-collapse-line) / 2)) 0 calc(50% - (var(--hero-collapse-line) / 2)) 0)'

  const getCenter = (rect: DOMRect) => ({
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
  })

  const eyesOriginRect = heroEyesOrigin?.getBoundingClientRect()
  if (eyesOriginRect) {
    gsap.set(heroEyes, { width: eyesOriginRect.width })
  }
  const eyesTargetRect = heroEyes.getBoundingClientRect()

  const eyesOffsetX = eyesOriginRect
    ? getCenter(eyesOriginRect).x - getCenter(eyesTargetRect).x
    : 0
  const eyesOffsetY = eyesOriginRect
    ? getCenter(eyesOriginRect).y - getCenter(eyesTargetRect).y
    : 0
  const moveEyesViaOrigin = Boolean(heroEyesOrigin && eyesOriginRect)

  // #region agent log
  fetch('http://127.0.0.1:7243/ingest/cb40a583-a5f3-45b5-a756-fe8737ba0159',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'debug-1',hypothesisId:'H2',location:'hero.anim.ts:198',message:'offsets computed',data:{eyesOffsetX,eyesOffsetY,eyesTarget:{w:eyesTargetRect.width,h:eyesTargetRect.height},eyesOrigin:eyesOriginRect?{w:eyesOriginRect.width,h:eyesOriginRect.height}:null},timestamp:Date.now()})}).catch(()=>{});
  // #endregion
  if (moveEyesViaOrigin && heroEyesOrigin) {
    gsap.set(heroEyesOrigin, { x: 0, y: 0 })
  } else {
    gsap.set(heroEyes, { x: eyesOffsetX, y: eyesOffsetY })
  }

  // Phase A: dim everything except eyes.
  transitionTl.to(
    heroFadeTargets,
    {
      opacity: 0.2,
      duration: clearDuration,
      ease: 'power1.out',
    },
    0,
  )
  if (heroMouthOrigin) {
    transitionTl.to(
      heroMouthOrigin,
      {
        opacity: 0.2,
        duration: clearDuration,
        ease: 'power1.out',
      },
      0,
    )
  }

  // Phase B: move eyes into compose position (screen center).
  if (moveEyesViaOrigin && heroEyesOrigin) {
    transitionTl.to(
      heroEyesOrigin,
      {
        x: -eyesOffsetX,
        y: -eyesOffsetY,
        duration: moveDuration,
        ease: 'power2.out',
      },
      moveStart,
    )
    transitionTl.set(heroComposeLayer, { autoAlpha: 1 }, moveStart + moveDuration)
    transitionTl.set(heroEyesOrigin, { autoAlpha: 0 }, moveStart + moveDuration)
    transitionTl.set(heroEyesOrigin, { x: 0, y: 0 }, moveStart + moveDuration)
  } else {
    transitionTl.set(heroComposeLayer, { autoAlpha: 1 }, moveStart)
    if (heroEyesOrigin) {
      transitionTl.set(heroEyesOrigin, { autoAlpha: 0 }, moveStart)
    }
  }
  // #region agent log
  transitionTl.add(() => {fetch('http://127.0.0.1:7243/ingest/cb40a583-a5f3-45b5-a756-fe8737ba0159',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'debug-1',hypothesisId:'H1',location:'hero.anim.ts:231',message:'move start visibility',data:{eyes:heroEyes?{opacity:getComputedStyle(heroEyes).opacity,visibility:getComputedStyle(heroEyes).visibility}:null,eyesOrigin:heroEyesOrigin?{opacity:getComputedStyle(heroEyesOrigin).opacity,visibility:getComputedStyle(heroEyesOrigin).visibility}:null,compose:heroComposeLayer?{opacity:getComputedStyle(heroComposeLayer).opacity,visibility:getComputedStyle(heroComposeLayer).visibility}:null},timestamp:Date.now()})}).catch(()=>{});}, moveStart)
  // #endregion
  if (!moveEyesViaOrigin) {
    transitionTl.to(
      heroEyes,
      { x: 0, y: 0, duration: moveDuration, ease: 'power2.out' },
      moveStart,
    )
  }
  // #region agent log
  transitionTl.add(() => {fetch('http://127.0.0.1:7243/ingest/cb40a583-a5f3-45b5-a756-fe8737ba0159',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'debug-1',hypothesisId:'H2',location:'hero.anim.ts:239',message:'move end state',data:{eyes:heroEyes?{x:gsap.getProperty(heroEyes,'x'),y:gsap.getProperty(heroEyes,'y'),opacity:getComputedStyle(heroEyes).opacity,transform:getComputedStyle(heroEyes).transform}:null,compose:heroComposeLayer?{opacity:getComputedStyle(heroComposeLayer).opacity}:null},timestamp:Date.now()})}).catch(()=>{});}, moveStart + moveDuration)
  // #endregion
  transitionTl.to(
    heroFadeTargets,
    { opacity: 0, duration: moveDuration * 0.8, ease: 'power1.out' },
    moveStart,
  )
  if (heroMouthOrigin) {
    transitionTl.to(
      heroMouthOrigin,
      { opacity: 0, duration: moveDuration * 0.8, ease: 'power1.out' },
      moveStart,
    )
  }
  transitionTl.set(
    heroRest,
    {
      autoAlpha: 0,
      pointerEvents: 'none',
    },
    moveStart + moveDuration,
  )

  // Phase C: collapse to scanline with CRT spike.
  // #region agent log
  transitionTl.add(() => {fetch('http://127.0.0.1:7243/ingest/cb40a583-a5f3-45b5-a756-fe8737ba0159',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'debug-1',hypothesisId:'H4',location:'hero.anim.ts:248',message:'collapse start snapshot',data:{clipPath:getComputedStyle(heroComposeStack).clipPath,transform:getComputedStyle(heroComposeStack).transform,opacity:getComputedStyle(heroComposeStack).opacity,height:heroComposeStack.getBoundingClientRect().height},timestamp:Date.now()})}).catch(()=>{});}, t1)
  // #endregion
  transitionTl.to(
    heroComposeStack,
    {
      clipPath: lineClip,
      scaleY: 0.35,
      duration: phase2,
      ease: 'power2.inOut',
    },
    t1,
  )
  transitionTl.to(
    heroComposeStack,
    {
      autoAlpha: 0,
      duration: phase2 * 0.2,
      ease: 'power2.in',
    },
    t1 + phase2 * 0.8,
  )
  // #region agent log
  transitionTl.add(() => {fetch('http://127.0.0.1:7243/ingest/cb40a583-a5f3-45b5-a756-fe8737ba0159',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'debug-1',hypothesisId:'H4',location:'hero.anim.ts:271',message:'collapse end snapshot',data:{clipPath:getComputedStyle(heroComposeStack).clipPath,transform:getComputedStyle(heroComposeStack).transform,opacity:getComputedStyle(heroComposeStack).opacity,height:heroComposeStack.getBoundingClientRect().height},timestamp:Date.now()})}).catch(()=>{});}, t1 + phase2 * 0.9)
  // #endregion
  transitionTl.set(heroComposeLayer, { autoAlpha: 0 }, t1 + phase2)
  // Phase D: masked jump to About + tunnel reveal.
  transitionTl.add(() => {
    gsap.set(horizontalTrack, { x: -panelWidth })
  }, t2)
  transitionTl.to(
    horizontalTrack,
    { x: -panelWidth, duration: postJumpDuration, overwrite: 'auto' },
    t2,
  )
  if (portalLineDom) {
    transitionTl.to(
      portalLineDom,
      { autoAlpha: 0, duration: phase3 * 0.6, ease: 'power1.out' },
      t2 + phase3 * 0.4,
    )
  }


  masterTl.add(transitionTl)
  return true
}
