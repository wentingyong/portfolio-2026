import type { Metadata } from 'next'
import { Antonio, Space_Mono } from 'next/font/google'
import { CrtDomOverlayLayer } from '../components/r3f/CrtDomOverlayLayer'
import { CrtDomWarp } from '../components/r3f/CrtDomWarp'
import { VisualStageClient } from '../components/r3f/VisualStageClient'
import { Nav } from '@/components/shell/Nav'
// import { SiteShell } from '@/components/shell/SiteShell'
import '@/styles/globals.scss'

const antonio = Antonio({
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  variable: '--font-display',
  display: 'swap',
})

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-mono',
  display: 'swap',
})

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
    <html lang="en" className={`${antonio.variable} ${spaceMono.variable}`}>
      <body>
        <VisualStageClient />
        {/* <SiteShell>{children}</SiteShell> */}
        <CrtDomWarp />
        <Nav />
        {children}
        <CrtDomOverlayLayer />
      </body>
    </html>
  )
}
