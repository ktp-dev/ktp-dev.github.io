export const readsPrimaryBtnClass =
  'tap-press tap-press-dark cursor-pointer rounded-[40px] bg-[#163556] px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-[#1a3d63] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100'

export const readsFieldClass =
  'w-full rounded-md border px-3 py-2 text-sm text-slate-100 outline-none transition-[border-color,box-shadow] duration-200 ease-out placeholder:text-slate-400 focus:border-sky-300/60 focus:shadow-[0_0_0_3px_rgba(125,211,252,0.2)]'

export const readsFieldStyle = {
  backgroundColor: 'rgba(255, 255, 255, 0.07)',
  borderColor: 'rgba(255, 255, 255, 0.12)',
} as const

export function readsScoreBtnClass(selected: boolean) {
  return selected
    ? 'tap-press tap-press-dark tap-selected cursor-pointer flex h-9 w-9 items-center justify-center rounded-full bg-[#163556] text-sm font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-[#1a3d63] hover:shadow-md'
    : 'tap-press tap-press-dark cursor-pointer flex h-9 w-9 items-center justify-center rounded-full border text-sm font-semibold text-slate-200 transition-all duration-300 hover:scale-105 hover:shadow-sm'
}

export const readsScoreBtnIdleStyle = {
  backgroundColor: 'rgba(255, 255, 255, 0.06)',
  borderColor: 'rgba(255, 255, 255, 0.18)',
} as const

/** Nested frosty panel used inside dark reads cards (score category rows, etc.) */
export const readsDarkPanelClass = 'rounded-xl border'
export const readsDarkPanelStyle = {
  backgroundColor: 'rgba(255, 255, 255, 0.07)',
  borderColor: 'rgba(255, 255, 255, 0.08)',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.18)',
  backdropFilter: 'blur(6px)',
  WebkitBackdropFilter: 'blur(6px)',
} as const

export const readsLinkClass =
  'tap-text shrink-0 cursor-pointer text-sm font-semibold text-white transition-colors hover:opacity-90'
export const readsMutedClass = 'text-slate-400'
export const readsBodyClass = 'text-slate-200'
export const readsHeadingClass = 'text-white'
