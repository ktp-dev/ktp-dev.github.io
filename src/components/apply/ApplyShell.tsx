'use client'

import { ApplyToast } from '@/components/apply/ApplyToast'
import { SignedInAccountBar } from '@/components/SignedInAccountBar'
import { APPLY_STEPS, type ApplyStepSlug } from '@/lib/apply-steps'

export const applyCardClass =
  'rounded-2xl border border-gray-100 p-6 sm:p-8 transform transition-all duration-300 ease-in-out'

export const applyCardStyle = {
  backgroundColor: 'rgba(249, 250, 251, 0.95)',
  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)',
}

export function ApplicationHeading({
  title,
  className = 'text-3xl sm:text-4xl md:text-5xl font-black font-inter text-black',
}: {
  title: string
  className?: string
}) {
  const match = title.match(/^(Kappa Theta Pi)\s+(.+)$/i)
  return (
    <h1 className={className} style={{ fontWeight: '900', letterSpacing: '-0.02em' }}>
      {match ? (
        <>
          <span className="block">{match[1]}</span>
          <span className="block">{match[2]}</span>
        </>
      ) : (
        title
      )}
    </h1>
  )
}

export function ApplyShell({
  children,
  current,
  title,
  preview = false,
}: {
  children: React.ReactNode
  current?: ApplyStepSlug
  title?: string
  preview?: boolean
}) {
  const currentIndex = current
    ? APPLY_STEPS.findIndex((step) => step.slug === current)
    : -1

  return (
    <div className="mx-auto flex w-full max-w-3xl lg:max-w-4xl flex-1 flex-col pt-12 sm:pt-16 pb-12">
      <ApplyToast />
      <SignedInAccountBar className="mb-4" align="end" />
      {title ? (
        <ApplicationHeading
          title={title}
          className="mb-8 text-center text-3xl sm:text-4xl md:text-5xl font-black font-inter text-black"
        />
      ) : null}

      {preview ? (
        <p className="mb-6 text-center text-sm font-medium text-[#315CA9]">
          Preview only. Responses are not saved.
        </p>
      ) : null}

      {current ? (
        <ol className="mb-8 flex flex-wrap justify-center gap-2 sm:gap-3 lg:gap-4">
          {APPLY_STEPS.map((step, index) => {
            const reached = index <= currentIndex
            return (
              <li
                key={step.slug}
                aria-current={step.slug === current ? 'step' : undefined}
                className={`cursor-default select-none rounded-[40px] px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold ${
                  reached ? 'bg-[#315CA9] text-white' : 'bg-gray-200/60 text-gray-700'
                }`}
              >
                {index + 1}. {step.label}
              </li>
            )
          })}
        </ol>
      ) : null}

      <div className="flex flex-1 flex-col items-stretch">{children}</div>
    </div>
  )
}
