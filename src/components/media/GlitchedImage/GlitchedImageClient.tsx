'use client'

import dynamic from 'next/dynamic'

export const GlitchedImage = dynamic(() => import('./GlitchedImage'), {
  ssr: false,
  loading: () => null,
})

export type { GlitchedImageHandle, GlitchedImageProps } from './GlitchedImage'
