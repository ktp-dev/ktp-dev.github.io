'use client'

import dynamic from 'next/dynamic'
import { useMediaQuery } from '@/hooks/useMediaQuery'

const KTPUSMap = dynamic(() => import('@/app/nationals/KTPUSMap'), {
  ssr: false,
  loading: () => (
    <div className="flex h-[500px] w-full items-center justify-center overflow-hidden rounded-2xl border border-neutral-200 bg-gray-100">
      <div className="text-gray-500">Loading map...</div>
    </div>
  ),
})

/** Leaflet only loads when this renders — gated to lg+ so mobile never fetches the map chunk. */
export default function NationalsMap() {
  const isLg = useMediaQuery('(min-width: 1024px)')
  if (!isLg) return null
  return <KTPUSMap />
}
