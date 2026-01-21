'use client'

import dynamic from 'next/dynamic'

const VisualStage = dynamic(
  () => import('./VisualStage').then((mod) => mod.VisualStage),
  { ssr: false, loading: () => null },
)

export function VisualStageClient() {
  return <VisualStage />
}
