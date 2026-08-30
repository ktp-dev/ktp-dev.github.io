'use client'

import dynamic from 'next/dynamic'
import { useMediaQuery } from '@/hooks/useMediaQuery'

const NationalsIconBar = dynamic(() => import('./NationalsIconBar'), {
  ssr: false,
})

/** FontAwesome icon bar only loads on md+ (hidden on phones anyway). */
export default function NationalsIconBarGate() {
  const isMd = useMediaQuery('(min-width: 768px)')
  if (!isMd) return null
  return <NationalsIconBar />
}
