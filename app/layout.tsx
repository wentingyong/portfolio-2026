import type { Metadata } from 'next'
import { Antonio, Space_Mono } from 'next/font/google'
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
        {/* <SiteShell>{children}</SiteShell> */}
        {children}
      </body>
    </html>
  )
}
