'use client'

import '@/components/r3f/reactCompat'

import {
  forwardRef,
  Suspense,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react'
import { EffectComposer } from '@react-three/postprocessing'
import { useTexture } from '@react-three/drei'
import { Color, Mesh, SRGBColorSpace } from 'three'
import { Canvas, useFrame, useThree } from '@/components/r3f/r3f'
import { useReducedMotion } from '@/lib/hooks/useReducedMotion'
import { useImpulseDecay } from '../../../lib/motion/useImpulseDecay'
import {
  VhsGlitchEffect,
  type VhsGlitchEffectHandle,
} from '../../r3f/VhsGlitchEffect'
import styles from './GlitchedImage.module.scss'

type GlitchPreset = 'low' | 'medium' | 'high'
type GlitchTrigger = 'hover' | 'click' | 'manual'

export type GlitchedImageHandle = {
  glitch: (amount?: number) => void
}

export interface GlitchedImageProps {
  src: string
  alt?: string
  className?: string
  trigger?: GlitchTrigger
  preset?: GlitchPreset
  baseline?: number
  maxBoost?: number
  hoverBoost?: number
  animated?: boolean
  swapBaselineBoost?: boolean
  clickImpulse?: boolean
  fill?: boolean
  onReady?: () => void
  debugSolid?: boolean
  debug?: boolean
}

const PRESET_CONFIG: Record<
  GlitchPreset,
  {
    dpr: number
    rgbBase: number
    rgbBoost: number
    scanBase: number
    scanBoost: number
    noiseBase: number
    noiseBoost: number
    speed: number
  }
> = {
  low: {
    dpr: 1,
    rgbBase: 0.003,
    rgbBoost: 0.006,
    scanBase: 0.12,
    scanBoost: 0.35,
    noiseBase: 0.01,
    noiseBoost: 0.03,
    speed: 0.7,
  },
  medium: {
    dpr: 1.25,
    rgbBase: 0.004,
    rgbBoost: 0.012,
    scanBase: 0.18,
    scanBoost: 0.5,
    noiseBase: 0.015,
    noiseBoost: 0.05,
    speed: 0.85,
  },
  high: {
    dpr: 1.5,
    rgbBase: 0.006,
    rgbBoost: 0.018,
    scanBase: 0.22,
    scanBoost: 0.65,
    noiseBase: 0.02,
    noiseBoost: 0.08,
    speed: 0.95,
  },
}

const clamp01 = (value: number) => Math.min(1, Math.max(0, value))
const EPSILON = 0.001

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

type GlitchedImageSceneHandle = {
  glitch: (amount?: number) => void
}

function GlitchedImageDebugScene() {
  const { viewport, invalidate } = useThree()
  const meshRef = useRef<Mesh | null>(null)

  useEffect(() => {
    invalidate()
  }, [invalidate])

  useFrame((_state, delta) => {
    if (!meshRef.current) return
    meshRef.current.rotation.x += delta * 0.6
    meshRef.current.rotation.y += delta * 0.8
  })

  return (
    <mesh
      ref={meshRef}
      scale={[
        viewport.width * 0.6,
        viewport.height * 0.6,
        Math.min(viewport.width, viewport.height) * 0.35,
      ]}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshNormalMaterial />
    </mesh>
  )
}

interface GlitchedImageSceneProps {
  src: string
  preset: GlitchPreset
  baseline: number
  maxBoost: number
  maxImpulse: number
  animated: boolean
  reducedMotion: boolean
  onReady?: () => void
  debugSolid?: boolean
  debug?: boolean
}

const GlitchedImageScene = forwardRef<GlitchedImageSceneHandle, GlitchedImageSceneProps>(
  function GlitchedImageScene(
    {
      src,
      preset,
      baseline,
      maxBoost,
      maxImpulse,
      animated,
      reducedMotion,
      onReady,
      debugSolid,
      debug,
    },
    ref,
  ) {
    const { viewport, invalidate, size } = useThree()
    const texture = useTexture(src)
    const effectRef = useRef<VhsGlitchEffectHandle | null>(null)
    const timeRef = useRef(0)

    const presetConfig = PRESET_CONFIG[preset]
    const motionScale = reducedMotion ? 0.35 : 1
    const baseScale = baseline * motionScale
    const boostScale = maxBoost * motionScale
    const maxImpulseValue = reducedMotion ? Math.min(maxImpulse, 0.35) : maxImpulse
    const decayRate = reducedMotion ? 5.5 : 3.4
    const timeEnabled = animated && !reducedMotion
    const continuous = timeEnabled && baseScale > EPSILON

    const { impulseRef, addImpulse, startDecay } = useImpulseDecay({
      maxImpulse: Math.max(0, maxImpulseValue),
      decayRate,
      minImpulse: EPSILON,
      disabled: !animated || (!continuous && boostScale <= 0),
      continuous,
    })

    useImperativeHandle(
      ref,
      () => ({
        glitch: (amount = 1) => {
          if (!animated) return
          addImpulse(Math.max(0, amount))
        },
      }),
      [addImpulse, animated],
    )

    const planeScale = useMemo(() => {
      const image = texture.image as { width: number; height: number } | undefined
      if (!image) return [viewport.width, viewport.height, 1] as const
      return getCoverScale(viewport.width, viewport.height, image.width, image.height)
    }, [texture.image, viewport.width, viewport.height])

    useEffect(() => {
      texture.colorSpace = SRGBColorSpace
      texture.needsUpdate = true
      invalidate()
    }, [invalidate, texture])

    useEffect(() => {
      invalidate()
    }, [invalidate, size.width, size.height])

    useEffect(() => {
      const image = texture.image as { width?: number; height?: number } | undefined
      if (!image?.width || !image?.height) return
      onReady?.()
    }, [onReady, texture.image])

    const handleTick = useCallback(
      (impulse: number, delta: number) => {
        const effect = effectRef.current
        if (!effect) return

        if (debug) {
          effect.setIntensity(1)
          effect.setRgbShift(0.02)
          effect.setScanline(0.6)
          effect.setNoise(0.08)
          if (timeEnabled) {
            timeRef.current += delta * 1.2
            effect.setTime(timeRef.current)
          } else {
            effect.setTime(0)
          }
          invalidate()
          return
        }

        const normalizedImpulse = Math.max(0, impulse)
        const boostedImpulse = normalizedImpulse * boostScale
        const rgbShift =
          presetConfig.rgbBase * baseScale +
          boostedImpulse * presetConfig.rgbBoost
        const scanline =
          presetConfig.scanBase * baseScale +
          boostedImpulse * presetConfig.scanBoost
        const noise =
          presetConfig.noiseBase * baseScale +
          boostedImpulse * presetConfig.noiseBoost
        const intensity = Math.min(1, baseScale + boostedImpulse)

        effect.setIntensity(intensity)
        effect.setRgbShift(rgbShift)
        effect.setScanline(scanline)
        effect.setNoise(noise)

        if (timeEnabled && (continuous || normalizedImpulse > EPSILON)) {
          timeRef.current += delta * presetConfig.speed
          effect.setTime(timeRef.current)
        }

        invalidate()
      },
      [
        baseScale,
        boostScale,
        debug,
        invalidate,
        presetConfig,
        timeEnabled,
        continuous,
      ],
    )

    useEffect(() => {
      startDecay(handleTick)
    }, [handleTick, startDecay])

    useEffect(() => {
      handleTick(impulseRef.current, 0)
    }, [handleTick, impulseRef])

    useEffect(() => {
      if (timeEnabled) return
      timeRef.current = 0
      effectRef.current?.setTime(0)
      invalidate()
    }, [invalidate, timeEnabled])

    return (
      <>
        <mesh scale={planeScale}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial map={texture} toneMapped={false} transparent />
        </mesh>
        <EffectComposer>
          <VhsGlitchEffect ref={effectRef} />
        </EffectComposer>
      </>
    )
  },
)

export const GlitchedImage = forwardRef<GlitchedImageHandle, GlitchedImageProps>(
  function GlitchedImage(
    {
      src,
      alt,
      className,
      trigger = 'hover',
      preset = 'medium',
      baseline,
      maxBoost,
      hoverBoost,
      animated = true,
      swapBaselineBoost = false,
      clickImpulse = false,
      fill = false,
      onReady,
      debugSolid = false,
      debug = false,
    },
    ref,
  ) {
    const reducedMotion = useReducedMotion()
    const sceneRef = useRef<GlitchedImageSceneHandle | null>(null)
    const effectivePreset: GlitchPreset = reducedMotion ? 'low' : preset
    const presetConfig = PRESET_CONFIG[effectivePreset]
    const dpr = reducedMotion ? 1 : presetConfig.dpr
    const baseValue = clamp01(baseline ?? 0)
    const boostValue = clamp01(maxBoost ?? 1)
    const hoverBoostValue = Math.max(0, hoverBoost ?? 1)
    const maxImpulseValue = Math.max(1, hoverBoostValue)
    const effectiveBaseline = swapBaselineBoost ? boostValue : baseValue
    const effectiveBoost = swapBaselineBoost ? baseValue : boostValue
    const enableHover = trigger === 'hover' && !reducedMotion
    const enableClick =
      trigger === 'click' ||
      (clickImpulse && trigger !== 'manual') ||
      (reducedMotion && trigger === 'hover')

    const glitch = useCallback(
      (amount = 1) => {
        if (!animated) return
        sceneRef.current?.glitch(Math.max(0, amount))
      },
      [animated],
    )

    useImperativeHandle(ref, () => ({ glitch }), [glitch])

    const handlePointerEnter = useCallback(() => {
      if (!enableHover) return
      glitch(hoverBoostValue)
    }, [enableHover, glitch, hoverBoostValue])

    const handlePointerDown = useCallback(() => {
      if (!enableClick) return
      glitch(1)
    }, [enableClick, glitch])

    const rootClassName = [
      styles['glitched-image'],
      fill ? styles['glitched-image--fill'] : null,
      debugSolid ? styles['glitched-image--debugSolid'] : null,
      debug ? styles['glitched-image--debug'] : null,
      className ?? null,
    ]
      .filter(Boolean)
      .join(' ')

    const canvasStyle = debugSolid ? { background: '#ff00cc' } : undefined

    return (
      <div
        className={rootClassName}
        data-glitched-image
        onPointerEnter={handlePointerEnter}
        onPointerDown={handlePointerDown}
      >
        {typeof alt === 'string' ? (
          <img
            src={src}
            alt={alt}
            className={styles['glitched-image__sr-img']}
          />
        ) : null}
        <div
          className={styles['glitched-image__canvas-wrap']}
          aria-hidden="true"
        >
          <Canvas
            className={styles['glitched-image__canvas']}
            style={canvasStyle}
            frameloop={debugSolid ? 'always' : 'demand'}
            dpr={dpr}
            orthographic
            camera={{ position: [0, 0, 1], zoom: 1, near: 0.1, far: 10 }}
            gl={{
              antialias: false,
              alpha: !debugSolid,
              powerPreference: 'high-performance',
            }}
            onCreated={({ invalidate, scene, size }) => {
              if (debugSolid) {
                scene.background = new Color('#ff00cc')
                if (typeof window !== 'undefined') {
                  // eslint-disable-next-line no-console
                  console.info('[GlitchedImage] canvas size', size)
                }
              }
              invalidate()
            }}
          >
            {debugSolid ? (
              <GlitchedImageDebugScene />
            ) : (
              <Suspense fallback={null}>
                <GlitchedImageScene
                  ref={sceneRef}
                  src={src}
                  preset={effectivePreset}
                  baseline={effectiveBaseline}
                  maxBoost={effectiveBoost}
                  maxImpulse={maxImpulseValue}
                  animated={animated}
                  reducedMotion={reducedMotion}
                  onReady={onReady}
                  debugSolid={debugSolid}
                  debug={debug}
                />
              </Suspense>
            )}
          </Canvas>
        </div>
      </div>
    )
  },
)

// Example usage:
// <GlitchedImage src="/images/foo.jpg" trigger="hover" preset="medium" />
// const ref = useRef<GlitchedImageHandle>(null)
// ref.current?.glitch(1)

export default GlitchedImage
