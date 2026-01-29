'use client'

import { ReactNode, useCallback, useEffect, useState } from 'react'
import { Landing } from './Landing'

// ============================================
// Types
// ============================================

interface LandingGateProps {
  children: ReactNode
  /** Force showing the landing even if already seen this session */
  forceShow?: boolean
  /** Custom session storage key */
  storageKey?: string
}

// ============================================
// Constants
// ============================================

const DEFAULT_STORAGE_KEY = 'landing_done'

// ============================================
// Component
// ============================================

/**
 * LandingGate - Shows the Landing experience once per session
 * Children are NOT rendered until landing completes to prevent scrollbar/nav flash
 */
export function LandingGate({
  children,
  forceShow = false,
  storageKey = DEFAULT_STORAGE_KEY,
}: LandingGateProps) {
  const [showLanding, setShowLanding] = useState<boolean | null>(null)

  // Check sessionStorage on mount
  useEffect(() => {
    // Always show landing on page load/refresh
    setShowLanding(true)
  }, [])

  // Handle landing completion
  const handleComplete = useCallback(() => {
    // Mark as seen in sessionStorage
    sessionStorage.setItem(storageKey, '1')
    // Hide landing and show children
    setShowLanding(false)
  }, [storageKey])

  // Still determining initial state - show nothing
  if (showLanding === null) {
    return null
  }

  // Show landing only - don't render children yet
  if (showLanding) {
    return <Landing onComplete={handleComplete} />
  }

  // Landing complete - show children
  return <>{children}</>
}

export default LandingGate
