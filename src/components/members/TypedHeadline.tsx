'use client'

import { ReactTyped } from 'react-typed'

export default function TypedHeadline() {
  return (
    <ReactTyped
      strings={['Developers', 'Leaders', 'Designers', 'Engineers', 'Innovators', 'Problem Solvers']}
      typeSpeed={60}
      backSpeed={50}
      backDelay={1500}
      loop
    />
  )
}
