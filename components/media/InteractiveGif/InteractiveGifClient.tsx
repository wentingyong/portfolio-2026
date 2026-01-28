'use client'

import dynamic from 'next/dynamic'

export const InteractiveGif = dynamic(
  () => import('./InteractiveGif').then((mod) => mod.InteractiveGif),
  {
    ssr: false,
    loading: () => null,
  },
)

export type { InteractiveGifProps } from './InteractiveGif'
