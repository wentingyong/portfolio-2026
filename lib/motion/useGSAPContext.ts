import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

/**
 * Hook to create and cleanup GSAP context
 * Ensures all ScrollTriggers are killed on unmount
 */
export function useGSAPContext() {
  const ctxRef = useRef<gsap.Context | null>(null)

  useEffect(() => {
    ctxRef.current = gsap.context(() => {})

    return () => {
      if (ctxRef.current) {
        ctxRef.current.revert()
        ctxRef.current = null
      }
      // Kill all ScrollTriggers as safety measure
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [])

  return ctxRef.current
}
