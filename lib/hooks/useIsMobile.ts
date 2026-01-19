import { useEffect, useState } from 'react'

/**
 * Hook to detect mobile/touch devices
 * Desktop = enable horizontal/pin choreography
 * Mobile = fall back to vertical layout
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const checkMobile = () => {
      // Treat small screens as mobile; only treat touch devices as mobile when pointer is coarse.
      const isSmallScreen = window.innerWidth < 1024
      const hasCoarsePointer =
        window.matchMedia?.('(pointer: coarse)').matches ||
        window.matchMedia?.('(hover: none)').matches ||
        navigator.maxTouchPoints > 0
      setIsMobile(isSmallScreen || hasCoarsePointer)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return isMobile
}
