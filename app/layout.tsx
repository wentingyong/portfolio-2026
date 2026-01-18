import type { Metadata } from 'next'
// import { SiteShell } from '@/components/shell/SiteShell'
import '@/styles/globals.scss'

export const metadata: Metadata = {
  title: 'Portfolio 2026',
  description: 'A physical digital space portfolio',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {/* <SiteShell>{children}</SiteShell> */}
        {children}
      </body>
    </html>
  )
}
