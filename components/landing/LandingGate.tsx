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
  const [showLanding, setShowLanding] = useState(true)

  useEffect(() => {
    const body = document.body
    if (!body) return

    if (showLanding) {
      body.dataset.landing = 'active'
      window.dispatchEvent(new CustomEvent('landing:start'))
    } else {
      delete body.dataset.landing
      window.dispatchEvent(new CustomEvent('landing:complete'))
    }

    return () => {
      delete body.dataset.landing
    }
  }, [showLanding])

  useEffect(() => {
    if (forceShow) {
      setShowLanding(true)
    }
  }, [forceShow])

  // Handle landing completion
  const handleComplete = useCallback(() => {
    // Mark as seen in sessionStorage
    sessionStorage.setItem(storageKey, '1')
    // Hide landing and show children
    setShowLanding(false)
  }, [storageKey])

  // Show landing only - don't render children yet
  if (showLanding) {
    return <Landing onComplete={handleComplete} />
  }

  // Landing complete - show children
  return <>{children}</>
}

export default LandingGate
