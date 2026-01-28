'use client'

import '@/components/r3f/reactCompat'

import { useFrame, useThree } from '@/components/r3f/r3f'
import type { ThreeEvent } from '@react-three/fiber'
import { gsap } from 'gsap'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  CanvasTexture,
  ClampToEdgeWrapping,
  LinearFilter,
  NearestFilter,
  ShaderMaterial,
  SRGBColorSpace,
  Texture,
  Vector2,
  VideoTexture,
} from 'three'
import {
  interactiveGifFragment,
  interactiveGifVertex,
} from './shaders/interactiveGif.glsl'

export const DEFAULT_GIF_SETTINGS = {
  fps: 24,
  radius: 0.22,
  bulgeStrength: 0.04,
  rippleStrength: 0.006,
  glitchStrength: 0.035,
  velocityThreshold: 0.6,
  settleDuration: 0.22,
} as const

const SMOOTH_SPEED = 12
const MAX_FRAME_STEPS = 5
const DEFAULT_SCROLL_STEP = 60

type GifManifest = {
  fps?: number
  frames?: string[]
}

type FrameSource = CanvasImageSource

export interface InteractiveGifPlaneProps {
  sourceType?: 'frames' | 'video'
  src?: string | null
  manifestUrl?: string
  fps?: number
  radius?: number
  bulgeStrength?: number
  rippleStrength?: number
  glitchStrength?: number
  velocityThreshold?: number
  settleDuration?: number
  reducedMotion?: boolean
  crisp?: boolean
  scrollControlled?: boolean
  scrollStep?: number
  onVideoBlocked?: (play: () => void) => void
  onVideoPlaying?: () => void
}

const getCoverScale = (
  viewportWidth: number,
  viewportHeight: number,
  imageWidth: number,
  imageHeight: number,
) => {
  if (imageWidth <= 0 || imageHeight <= 0) {
    return [viewportWidth, viewportHeight, 1] as const
  }
  const imageAspect = imageWidth / imageHeight
  const viewportAspect = viewportWidth / viewportHeight
  if (imageAspect > viewportAspect) {
    return [viewportHeight * imageAspect, viewportHeight, 1] as const
  }
  return [viewportWidth, viewportWidth / imageAspect, 1] as const
}

export function InteractiveGifPlane({
  sourceType = 'frames',
  src,
  manifestUrl,
  fps,
  radius = DEFAULT_GIF_SETTINGS.radius,
  bulgeStrength = DEFAULT_GIF_SETTINGS.bulgeStrength,
  rippleStrength = DEFAULT_GIF_SETTINGS.rippleStrength,
  glitchStrength = DEFAULT_GIF_SETTINGS.glitchStrength,
  velocityThreshold = DEFAULT_GIF_SETTINGS.velocityThreshold,
  settleDuration = DEFAULT_GIF_SETTINGS.settleDuration,
  reducedMotion = false,
  crisp = true,
  scrollControlled = false,
  scrollStep = DEFAULT_SCROLL_STEP,
  onVideoBlocked,
  onVideoPlaying,
}: InteractiveGifPlaneProps) {
  const { viewport } = useThree()
  const [frameSize, setFrameSize] = useState({ width: 0, height: 0 })

  const materialRef = useRef<ShaderMaterial | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null)
  const textureRef = useRef<Texture | null>(null)
  const framesRef = useRef<FrameSource[]>([])
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const frameStateRef = useRef({ index: 0, accumulator: 0 })
  const timeRef = useRef(0)
  const scrollRef = useRef(0)
  const lastScrollRef = useRef<number | null>(null)

  const mouseRef = useRef({ x: 0.5, y: 0.5 })
  const mouseTargetRef = useRef({ x: 0.5, y: 0.5 })
  const lastMoveRef = useRef({ x: 0.5, y: 0.5, time: 0 })
  const glitchRef = useRef({ value: 0 })

  const fpsRef = useRef(
    typeof fps === 'number' ? fps : DEFAULT_GIF_SETTINGS.fps,
  )
  const isVideo = sourceType === 'video'
  const scrollEnabled = scrollControlled && !isVideo

  useEffect(() => {
    if (typeof fps === 'number') {
      fpsRef.current = fps
    }
  }, [fps])

  const planeScale = useMemo(
    () =>
      getCoverScale(
        viewport.width,
        viewport.height,
        frameSize.width,
        frameSize.height,
      ),
    [viewport.width, viewport.height, frameSize.width, frameSize.height],
  )

  const uniforms = useMemo(
    () => ({
      uTex: { value: null as Texture | null },
      uMouse: { value: new Vector2(0.5, 0.5) },
      uTime: { value: 0 },
      uRadius: { value: radius },
      uBulgeStrength: { value: bulgeStrength },
      uRippleStrength: { value: rippleStrength },
      uGlitch: { value: 0 },
      uGlitchStrength: { value: glitchStrength },
    }),
    [],
  )

  const material = useMemo(() => {
    const mat = new ShaderMaterial({
      uniforms,
      vertexShader: interactiveGifVertex,
      fragmentShader: interactiveGifFragment,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      toneMapped: false,
    })
    materialRef.current = mat
    return mat
  }, [uniforms])

  const updateFilters = useCallback(() => {
    const texture = textureRef.current
    if (!texture) return
    texture.minFilter = crisp ? NearestFilter : LinearFilter
    texture.magFilter = crisp ? NearestFilter : LinearFilter
    texture.needsUpdate = true
  }, [crisp])

  const drawFrame = useCallback((image: FrameSource) => {
    const canvas = canvasRef.current
    const ctx = ctxRef.current
    const texture = textureRef.current
    if (!canvas || !ctx || !texture) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
    texture.needsUpdate = true
  }, [])

  const initTexture = useCallback(
    (width: number, height: number) => {
      if (!canvasRef.current) {
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        canvasRef.current = canvas
        ctxRef.current = canvas.getContext('2d')
      } else if (
        canvasRef.current.width !== width ||
        canvasRef.current.height !== height
      ) {
        canvasRef.current.width = width
        canvasRef.current.height = height
      }

      const ctx = ctxRef.current
      if (ctx) {
        ctx.imageSmoothingEnabled = !crisp
      }

      if (!textureRef.current) {
        const texture = new CanvasTexture(canvasRef.current)
        texture.colorSpace = SRGBColorSpace
        texture.wrapS = ClampToEdgeWrapping
        texture.wrapT = ClampToEdgeWrapping
        texture.generateMipmaps = false
        textureRef.current = texture
      }

      updateFilters()

      if (materialRef.current && textureRef.current) {
        materialRef.current.uniforms.uTex.value = textureRef.current
      }
    },
    [crisp, updateFilters],
  )

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (sourceType !== 'frames') return
    let cancelled = false
    const controller = new AbortController()

    const cleanupFrames = () => {
      framesRef.current.forEach((frame) => {
        const maybeClose = (frame as { close?: () => void }).close
        if (typeof maybeClose === 'function') {
          maybeClose.call(frame)
        }
      })
      framesRef.current = []
    }

    const resetFrameState = () => {
      frameStateRef.current.index = 0
      frameStateRef.current.accumulator = 0
    }

    const disposeTexture = () => {
      if (!textureRef.current) return
      textureRef.current.dispose()
      textureRef.current = null
      if (materialRef.current) {
        materialRef.current.uniforms.uTex.value = null
      }
    }

    const setFirstFrame = (frame: FrameSource) => {
      const width =
        (frame as { width?: number; displayWidth?: number }).width ??
        (frame as { displayWidth?: number }).displayWidth ??
        0
      const height =
        (frame as { height?: number; displayHeight?: number }).height ??
        (frame as { displayHeight?: number }).displayHeight ??
        0
      if (width && height) {
        setFrameSize({ width, height })
        initTexture(width, height)
        drawFrame(frame)
      }
    }

    const loadManifest = async () => {
      if (!manifestUrl) {
        console.warn('[InteractiveGifPlane] Missing manifestUrl for frames source')
        return
      }
      try {
        const response = await fetch(manifestUrl, {
          signal: controller.signal,
        })
        if (!response.ok) throw new Error('manifest fetch failed')
        const data = (await response.json()) as GifManifest
        const frames = Array.isArray(data.frames) ? data.frames : []
        if (frames.length === 0) return

        if (typeof fps !== 'number' && typeof data.fps === 'number') {
          fpsRef.current = data.fps
        }

        const baseUrl = new URL(manifestUrl, window.location.href)
        const images = frames.map((frame) => {
          const img = new Image()
          img.decoding = 'async'
          img.src = new URL(frame, baseUrl).toString()
          return img
        })

        framesRef.current = images
        resetFrameState()

        let loaded = 0
        images.forEach((img) => {
          img.onload = () => {
            loaded += 1
            if (loaded === 1 && !cancelled) {
              const width = img.naturalWidth || img.width
              const height = img.naturalHeight || img.height
              if (width && height) {
                setFrameSize({ width, height })
                initTexture(width, height)
                drawFrame(img)
              }
            }
          }
          img.onerror = () => {
            loaded += 1
          }
        })
      } catch (error) {
        if (!cancelled) {
          console.warn('[InteractiveGifPlane] Failed to load manifest', error)
        }
      }
    }

    cleanupFrames()
    disposeTexture()
    loadManifest()

    return () => {
      cancelled = true
      controller.abort()
      cleanupFrames()
    }
  }, [sourceType, manifestUrl, fps, initTexture, drawFrame])

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (sourceType !== 'video') return

    if (!src) {
      console.warn('[InteractiveGifPlane] Missing video src')
      return
    }

    let cancelled = false
    const video = document.createElement('video')
    videoRef.current = video
    video.src = src
    video.loop = true
    video.muted = true
    video.playsInline = true
    video.preload = 'auto'

    const handleMetadata = () => {
      if (cancelled) return
      const width = video.videoWidth || 0
      const height = video.videoHeight || 0
      if (width && height) {
        setFrameSize({ width, height })
      }
    }

    const attemptPlay = () => {
      const playPromise = video.play()
      if (!playPromise || typeof playPromise.then !== 'function') {
        onVideoPlaying?.()
        return
      }
      playPromise
        .then(() => {
          if (cancelled) return
          onVideoPlaying?.()
        })
        .catch(() => {
          if (cancelled) return
          onVideoBlocked?.(attemptPlay)
        })
    }

    video.addEventListener('loadedmetadata', handleMetadata)

    const texture = new VideoTexture(video)
    texture.colorSpace = SRGBColorSpace
    texture.wrapS = ClampToEdgeWrapping
    texture.wrapT = ClampToEdgeWrapping
    texture.generateMipmaps = false
    textureRef.current = texture

    if (materialRef.current) {
      materialRef.current.uniforms.uTex.value = texture
    }

    updateFilters()
    attemptPlay()

    return () => {
      cancelled = true
      video.pause()
      video.removeEventListener('loadedmetadata', handleMetadata)
      video.removeAttribute('src')
      video.load()
      videoRef.current = null
      texture.dispose()
      if (textureRef.current === texture) {
        textureRef.current = null
      }
      if (materialRef.current) {
        materialRef.current.uniforms.uTex.value = null
      }
    }
  }, [sourceType, src, updateFilters, onVideoBlocked, onVideoPlaying])

  useEffect(() => {
    if (!scrollEnabled) return
    if (typeof window === 'undefined') return
    const element = window

    const handleScroll = () => {
      if (framesRef.current.length === 0) return
      const current = window.scrollY
      const last = lastScrollRef.current ?? current
      const delta = current - last
      lastScrollRef.current = current
      if (!delta) return

      scrollRef.current += delta
      const step = Math.max(1, scrollStep)
      const steps = Math.trunc(scrollRef.current / step)

      if (steps === 0) return
      scrollRef.current -= steps * step

      const total = framesRef.current.length
      const nextIndex = (frameStateRef.current.index - steps) % total
      frameStateRef.current.index = nextIndex < 0 ? nextIndex + total : nextIndex

      const frame = framesRef.current[frameStateRef.current.index]
      if (!frame) return
      if ('complete' in frame && !(frame as HTMLImageElement).complete) return
      drawFrame(frame)
      const safeFps = Math.max(0.001, fpsRef.current)
    }

    lastScrollRef.current = window.scrollY
    element.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      element.removeEventListener('scroll', handleScroll)
      lastScrollRef.current = null
    }
  }, [drawFrame, scrollEnabled, scrollStep])

  useEffect(() => {
    if (!materialRef.current) return
    materialRef.current.uniforms.uRadius.value = radius
  }, [radius])

  useEffect(() => {
    if (!materialRef.current) return
    materialRef.current.uniforms.uBulgeStrength.value = reducedMotion
      ? 0
      : bulgeStrength
  }, [bulgeStrength, reducedMotion])

  useEffect(() => {
    if (!materialRef.current) return
    materialRef.current.uniforms.uRippleStrength.value = reducedMotion
      ? 0
      : rippleStrength
  }, [reducedMotion, rippleStrength])

  useEffect(() => {
    if (!materialRef.current) return
    materialRef.current.uniforms.uGlitchStrength.value = reducedMotion
      ? 0
      : glitchStrength
  }, [glitchStrength, reducedMotion])

  useEffect(() => {
    updateFilters()
  }, [updateFilters])

  useEffect(() => {
    if (!reducedMotion) return
    gsap.killTweensOf(glitchRef.current)
    glitchRef.current.value = 0
  }, [reducedMotion])

  useEffect(() => {
    return () => {
      gsap.killTweensOf(glitchRef.current)
      material.dispose()
      textureRef.current?.dispose()
    }
  }, [material])

  const triggerGlitch = useCallback(
    (amount: number) => {
      if (reducedMotion) return
      const next = Math.min(1, glitchRef.current.value + amount)
      glitchRef.current.value = next
      gsap.killTweensOf(glitchRef.current)
      gsap.to(glitchRef.current, {
        value: 0,
        duration: settleDuration,
        ease: 'power2.out',
      })
    },
    [reducedMotion, settleDuration],
  )

  const handlePointerMove = useCallback(
    (event: ThreeEvent<PointerEvent>) => {
      if (!event.uv) return
      event.stopPropagation()
      const { x, y } = event.uv
      mouseTargetRef.current.x = x
      mouseTargetRef.current.y = y

      const now = event.timeStamp || performance.now()
      const last = lastMoveRef.current
      if (last.time > 0) {
        const dt = (now - last.time) / 1000
        if (dt > 0) {
          const dx = x - last.x
          const dy = y - last.y
          const speed = Math.sqrt(dx * dx + dy * dy) / dt
          if (!reducedMotion && speed > velocityThreshold) {
            const impulse = Math.min(1, (speed - velocityThreshold) / velocityThreshold)
            triggerGlitch(impulse)
          }
        }
      }
      last.x = x
      last.y = y
      last.time = now
    },
    [reducedMotion, triggerGlitch, velocityThreshold],
  )

  const handlePointerOut = useCallback(() => {
    mouseTargetRef.current.x = -10
    mouseTargetRef.current.y = -10
    lastMoveRef.current.time = 0
  }, [])

  useFrame((_state, delta) => {
    const materialInstance = materialRef.current
    const texture = textureRef.current
    const canvas = canvasRef.current
    const ctx = ctxRef.current
    const frames = framesRef.current

    if (!materialInstance) return

    timeRef.current += delta
    materialInstance.uniforms.uTime.value = timeRef.current

    const smoothing = 1 - Math.exp(-SMOOTH_SPEED * delta)
    const currentMouse = mouseRef.current
    const targetMouse = mouseTargetRef.current
    currentMouse.x += (targetMouse.x - currentMouse.x) * smoothing
    currentMouse.y += (targetMouse.y - currentMouse.y) * smoothing
    materialInstance.uniforms.uMouse.value.set(currentMouse.x, currentMouse.y)

    materialInstance.uniforms.uGlitch.value = glitchRef.current.value

    if (isVideo) return

    if (!texture || !canvas || !ctx || frames.length === 0) return

    if (scrollEnabled) return

    const frameDuration = 1 / Math.max(fpsRef.current, 0.001)
    const state = frameStateRef.current
    state.accumulator += delta
    const steps = Math.min(
      Math.floor(state.accumulator / frameDuration),
      MAX_FRAME_STEPS,
    )

    if (steps <= 0) return

    state.accumulator -= steps * frameDuration
    state.index = (state.index + steps) % frames.length

    const frame = frames[state.index]
    if (!frame) return
    if ('complete' in frame && !(frame as HTMLImageElement).complete) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(frame, 0, 0, canvas.width, canvas.height)
    texture.needsUpdate = true
  })

  return (
    <mesh
      scale={planeScale}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerOut}
      onPointerOut={handlePointerOut}
    >
      <planeGeometry args={[1, 1]} />
      <primitive object={material} attach="material" />
    </mesh>
  )
}
