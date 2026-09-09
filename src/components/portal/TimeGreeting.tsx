'use client'

import { useEffect, useState } from 'react'

function greetingForHour(hour: number) {
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

export function TimeGreeting({ name }: { name: string }) {
  const [hello, setHello] = useState('Hello')

  useEffect(() => {
    setHello(greetingForHour(new Date().getHours()))
  }, [])

  return (
    <>
      {hello}, {name}
    </>
  )
}
