import CalendarIcon from './CalendarIcon'
import PinIcon from './PinIcon'

interface RushEventProps {
  title: string
  datetime: string
  location: string
  description?: string | null
  buttonLabel?: string | null
  buttonUrl?: string | null
  compact?: boolean
  tone?: 'light' | 'dark'
}

function isSameSitePath(url: string) {
  return url.startsWith('/')
}

export default function RushEvent({
  title,
  datetime,
  location,
  description,
  buttonLabel,
  buttonUrl,
  compact = false,
  tone = 'light',
}: RushEventProps) {
  const isDark = tone === 'dark'
  const iconColor = isDark ? '#ffffff' : '#000000'
  const titleClass = compact
    ? `mb-2 text-lg font-bold ${isDark ? 'text-white' : ''}`
    : `mb-3 text-lg font-bold sm:text-xl ${isDark ? 'text-white' : ''}`
  const metaClass = compact
    ? `ml-1.5 text-sm font-medium ${isDark ? 'text-white' : 'text-gray-700'}`
    : `ml-1 text-[13px] font-semibold sm:text-base ${isDark ? 'text-white' : 'text-black'}`
  const descriptionClass = compact
    ? `mb-3 text-sm ${isDark ? 'text-white' : 'text-gray-600'}`
    : `mb-4 flex items-center ${isDark ? 'text-white' : 'text-gray-600'}`
  const buttonClass = compact
    ? `tap-press mb-3 inline-block cursor-pointer rounded-[40px] px-3 py-1.5 text-sm font-medium text-white transition-all duration-300 hover:scale-105 hover:shadow-md ${
        isDark ? 'bg-[#163556] hover:bg-[#1a3d63]' : 'bg-[#315CA9]'
      }`
    : `tap-press inline-block cursor-pointer rounded-[40px] px-4 py-2 text-sm font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-md sm:text-base ${
        isDark ? 'bg-[#163556] hover:bg-[#1a3d63]' : 'bg-[#315CA9]'
      }`

  const content = (
    <>
      <h2 className={titleClass}>{title}</h2>
      <div className={compact ? 'mb-2 space-y-1' : 'mb-4'}>
        <div className={`flex items-center ${compact ? '' : 'mb-2'}`}>
          <CalendarIcon size={compact ? 18 : 24} color={iconColor} />
          <span className={metaClass}>{datetime}</span>
        </div>
        <div className="flex items-center">
          <PinIcon size={compact ? 18 : 24} color={iconColor} />
          <span className={metaClass}>{location}</span>
        </div>
      </div>
      {description ? <p className={descriptionClass}>{description}</p> : null}
      {buttonLabel && buttonUrl ? (
        isSameSitePath(buttonUrl) ? (
          <a href={buttonUrl} className={buttonClass}>
            {buttonLabel}
          </a>
        ) : (
          <a href={buttonUrl} target="_blank" rel="noopener noreferrer" className={buttonClass}>
            {buttonLabel}
          </a>
        )
      ) : null}
    </>
  )

  if (compact) {
    return <div>{content}</div>
  }

  return (
    <div className="relative mb-10 flex items-center">
      <div className="absolute left-4 top-1/2 -translate-x-1/2 -translate-y-1/2 transform">
        <div
          className={`z-10 h-4 w-4 rounded-full ${isDark ? 'bg-[#163556]' : 'bg-[#315CA9]'}`}
        />
      </div>
      <div className="ml-8 pl-4">{content}</div>
    </div>
  )
}
