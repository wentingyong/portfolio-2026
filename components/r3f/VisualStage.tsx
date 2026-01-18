'use client'

import { Canvas } from '@react-three/fiber'
import { useEffect, useState } from 'react'
import styles from './VisualStage.module.scss'

export function VisualStage() {
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  if (reducedMotion) {
    return null
  }

  return (
    <div className={styles.visualStage}>
      <Canvas
        camera={{ position: [0, 0, 1] }}
        gl={{ antialias: false, alpha: true }}
      >
        {/* Placeholder: Effects will be added in next phase */}
        <mesh>
          <planeGeometry args={[2, 2]} />
          <meshBasicMaterial color="#ff6600" opacity={0.1} transparent />
        </mesh>
      </Canvas>
    </div>
  )
}
