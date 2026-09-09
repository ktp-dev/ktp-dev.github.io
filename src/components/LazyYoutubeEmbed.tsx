'use client'

import { useEffect, useRef, useState } from 'react'

function embedIdFromUrl(embedUrl: string) {
  try {
    const path = new URL(embedUrl).pathname
    const match = path.match(/\/embed\/([^/]+)/)
    return match?.[1] ?? null
  } catch {
    return null
  }
}

type LazyYoutubeEmbedProps = {
  embedUrl: string
  title?: string
  className?: string
}

/** Defer YouTube iframe until near viewport (keeps layout; no extra click). */
export default function LazyYoutubeEmbed({
  embedUrl,
  title = 'YouTube video player',
  className = 'rounded-xl w-full h-full',
}: LazyYoutubeEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [shouldLoad, setShouldLoad] = useState(false)
  const videoId = embedIdFromUrl(embedUrl)
  const poster = videoId
    ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
    : null

  useEffect(() => {
    const node = containerRef.current
    if (!node || shouldLoad) return

    if (typeof IntersectionObserver === 'undefined') {
      setShouldLoad(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldLoad(true)
          observer.disconnect()
        }
      },
      { rootMargin: '200px 0px' }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [shouldLoad])

  return (
    <div ref={containerRef} className="relative h-full w-full overflow-hidden rounded-xl bg-gray-100">
      {shouldLoad ? (
        <iframe
          className={className}
          src={embedUrl}
          title={title}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      ) : poster ? (
        <img
          src={poster}
          alt=""
          className="h-full w-full object-cover"
          decoding="async"
          fetchPriority="low"
        />
      ) : null}
    </div>
  )
}
