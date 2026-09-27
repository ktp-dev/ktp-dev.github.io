'use client'

import Image from 'next/image'
import { useState } from 'react'

type MemberPhotoProps = {
  src: string
  alt: string
  className?: string
  sizes: string
  priority?: boolean
}

export default function MemberPhoto({
  src,
  alt,
  className,
  sizes,
  priority = false,
}: MemberPhotoProps) {
  const [imgSrc, setImgSrc] = useState(src)

  return (
    <Image
      src={imgSrc}
      alt={alt}
      fill
      sizes={sizes}
      className={className}
      priority={priority}
      onError={() => setImgSrc('/images/default.jpg')}
    />
  )
}
