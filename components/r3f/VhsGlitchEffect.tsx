'use client'

import { forwardRef, useEffect, useImperativeHandle, useMemo } from 'react'
import { BlendFunction, Effect } from 'postprocessing'
import { Uniform } from 'three'

const FRAGMENT_SHADER = `
uniform float uTime;
uniform float uIntensity;
uniform float uRgbShift;
uniform float uScanline;
uniform float uNoise;

float rand(vec2 co) {
  return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
  vec4 base = texture2D(inputBuffer, uv);

  float wave = sin((uv.y + uTime * 0.04) * 140.0 + uTime * 3.0);
  float shift = uRgbShift * (0.6 + 0.4 * wave);
  vec2 offset = vec2(shift, 0.0);

  vec3 shifted = vec3(
    texture2D(inputBuffer, uv + offset).r,
    base.g,
    texture2D(inputBuffer, uv - offset).b
  );

  float scan = sin((uv.y + uTime * 0.02) * 900.0);
  float scanMask = 1.0 - uScanline * (0.35 + 0.35 * scan);
  shifted *= scanMask;

  if (uNoise > 0.0) {
    float n = rand(uv * 1000.0 + uTime * 10.0) - 0.5;
    shifted += n * uNoise;
  }

  shifted = clamp(shifted, 0.0, 1.0);

  float intensity = clamp(uIntensity, 0.0, 1.0);
  vec3 finalColor = mix(base.rgb, shifted, intensity);
  outputColor = vec4(finalColor, base.a);
}
`

const clamp01 = (value: number) => Math.min(1, Math.max(0, value))

class VhsGlitchEffectImpl extends Effect {
  private intensityUniform: Uniform
  private rgbShiftUniform: Uniform
  private scanlineUniform: Uniform
  private noiseUniform: Uniform
  private timeUniform: Uniform

  constructor() {
    const uniforms = new Map<string, Uniform>([
      ['uTime', new Uniform(0)],
      ['uIntensity', new Uniform(0)],
      ['uRgbShift', new Uniform(0)],
      ['uScanline', new Uniform(0)],
      ['uNoise', new Uniform(0)],
    ])

    super('VhsGlitchEffect', FRAGMENT_SHADER, {
      blendFunction: BlendFunction.NORMAL,
      uniforms,
    })

    this.timeUniform = uniforms.get('uTime') as Uniform
    this.intensityUniform = uniforms.get('uIntensity') as Uniform
    this.rgbShiftUniform = uniforms.get('uRgbShift') as Uniform
    this.scanlineUniform = uniforms.get('uScanline') as Uniform
    this.noiseUniform = uniforms.get('uNoise') as Uniform
  }

  setIntensity(value: number) {
    this.intensityUniform.value = clamp01(value)
  }

  setRgbShift(value: number) {
    this.rgbShiftUniform.value = Math.max(0, value)
  }

  setScanline(value: number) {
    this.scanlineUniform.value = Math.max(0, value)
  }

  setNoise(value: number) {
    this.noiseUniform.value = Math.max(0, value)
  }

  setTime(value: number) {
    this.timeUniform.value = value
  }
}

export type VhsGlitchEffectHandle = {
  setIntensity: (value: number) => void
  setRgbShift: (value: number) => void
  setScanline: (value: number) => void
  setNoise: (value: number) => void
  setTime: (value: number) => void
}

interface VhsGlitchEffectProps {
  intensity?: number
  rgbShift?: number
  scanline?: number
  noise?: number
  time?: number
}

export const VhsGlitchEffect = forwardRef<VhsGlitchEffectHandle, VhsGlitchEffectProps>(
  function VhsGlitchEffect(
    { intensity = 0, rgbShift = 0, scanline = 0, noise = 0, time = 0 },
    ref,
  ) {
    const effect = useMemo(() => new VhsGlitchEffectImpl(), [])

    useImperativeHandle(
      ref,
      () => ({
        setIntensity: (value: number) => effect.setIntensity(value),
        setRgbShift: (value: number) => effect.setRgbShift(value),
        setScanline: (value: number) => effect.setScanline(value),
        setNoise: (value: number) => effect.setNoise(value),
        setTime: (value: number) => effect.setTime(value),
      }),
      [effect],
    )

    useEffect(() => {
      effect.setIntensity(intensity)
    }, [effect, intensity])

    useEffect(() => {
      effect.setRgbShift(rgbShift)
    }, [effect, rgbShift])

    useEffect(() => {
      effect.setScanline(scanline)
    }, [effect, scanline])

    useEffect(() => {
      effect.setNoise(noise)
    }, [effect, noise])

    useEffect(() => {
      effect.setTime(time)
    }, [effect, time])

    return <primitive object={effect} />
  },
)
