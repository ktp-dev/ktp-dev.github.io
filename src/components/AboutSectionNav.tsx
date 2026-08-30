'use client'

const CATEGORIES = [
  { label: "President's Welcome", id: 'presidents-welcome-section' },
  { label: 'Our Pillars', id: 'our-pillars-section' },
  { label: 'History', id: 'history-section' },
  { label: 'DEI Commitment', id: 'dei-commitment-section' },
] as const

/**
 * Buttons (not hash <a>s) so tap-press scale doesn't cancel scroll on iOS.
 * No selected/active styling — always the gray pill look.
 */
export default function AboutSectionNav() {
  function goTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    window.history.replaceState(null, '', `#${id}`)
  }

  return (
    <nav
      className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:justify-center sm:gap-4 md:gap-6 lg:gap-8"
      aria-label="About sections"
    >
      {CATEGORIES.map((category) => (
        <button
          key={category.id}
          type="button"
          className="tap-press cursor-pointer whitespace-nowrap rounded-[40px] bg-gray-200/60 px-3 py-2 text-center text-xs font-semibold text-gray-700 transition-all duration-300 hover:scale-105 hover:bg-gray-300/80 hover:shadow-md sm:px-4 sm:text-sm md:text-base"
          onClick={() => goTo(category.id)}
          onTouchEnd={(event) => {
            // Scale-on-press can cancel the synthetic click on iOS — activate on touchend.
            event.preventDefault()
            goTo(category.id)
          }}
        >
          {category.label}
        </button>
      ))}
    </nav>
  )
}
