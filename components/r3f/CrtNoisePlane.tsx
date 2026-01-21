'use client'

import { useMemo } from 'react'
import {
  DataTexture,
  NearestFilter,
  RepeatWrapping,
  RGBAFormat,
  UnsignedByteType,
} from 'three'
import { useThree } from './r3f'

const NOISE_SIZE = 128

interface CrtNoisePlaneProps {
  opacity?: number
}

export function CrtNoisePlane({ opacity = 0.04 }: CrtNoisePlaneProps) {
  const { viewport } = useThree()

  const texture = useMemo(() => {
    const size = NOISE_SIZE
    const data = new Uint8Array(size * size * 4)
    for (let i = 0; i < data.length; i += 4) {
      const r = Math.floor(Math.random() * 256)
      const g = Math.floor(Math.random() * 256)
      const b = Math.floor(Math.random() * 256)
      data[i] = r
      data[i + 1] = g
      data[i + 2] = b
      data[i + 3] = 255
    }

    const texture = new DataTexture(data, size, size, RGBAFormat, UnsignedByteType)
    texture.needsUpdate = true
    texture.magFilter = NearestFilter
    texture.minFilter = NearestFilter
    texture.wrapS = RepeatWrapping
    texture.wrapT = RepeatWrapping
    texture.repeat.set(4, 4)
    return texture
  }, [])

  return (
    <mesh scale={[viewport.width, viewport.height, 1]} position={[0, 0, 0]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial
        map={texture}
        transparent
        opacity={opacity}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  )
}
