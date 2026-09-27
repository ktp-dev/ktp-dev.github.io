import { splitApplyCopyLinks } from '@/lib/apply-copy-links'

const linkClass = 'font-semibold text-[#315CA9]'

export function ApplyCopyText({
  text,
  className = 'whitespace-pre-wrap text-base sm:text-lg leading-relaxed',
}: {
  text: string
  className?: string
}) {
  const parts = splitApplyCopyLinks(text)

  return (
    <p className={className}>
      {parts.map((part, index) =>
        part.type === 'link' ? (
          <a
            key={`${part.href}-${index}`}
            href={part.href}
            className={linkClass}
            {...(part.href.startsWith('mailto:')
              ? {}
              : { target: '_blank', rel: 'noopener noreferrer' })}
          >
            {part.value}
          </a>
        ) : (
          <span key={index}>{part.value}</span>
        )
      )}
    </p>
  )
}
