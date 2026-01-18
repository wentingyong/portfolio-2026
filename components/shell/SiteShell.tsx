'use client'

// import { VisualStage } from '@/components/r3f/VisualStage'
import styles from './SiteShell.module.scss'

interface SiteShellProps {
  children: React.ReactNode
}

export function SiteShell({ children }: SiteShellProps) {
  return (
    <div className={styles.siteShell}>
      {/* <VisualStage /> */}
      <div className={styles.content}>{children}</div>
    </div>
  )
}
