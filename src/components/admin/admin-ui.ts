/** Shared dark-mode tokens for /admin (brother-only). Align with portalDark* cards. */

export {
  portalDarkSectionCardClass as adminSectionCardClass,
  portalDarkSectionCardStyle as adminSectionCardStyle,
  portalDarkInnerCardClass as adminInnerCardClass,
  portalDarkInnerCardStyle as adminInnerCardStyle,
} from '@/components/PortalShell'

/** Third-level inset on frosty cards — solid page navy, not another frost layer */
export const adminInsetCardClass = 'rounded-xl border'
export const adminInsetCardStyle = {
  backgroundColor: '#0f172a',
  borderColor: 'rgba(255, 255, 255, 0.1)',
  boxShadow: 'none',
} as const

export const adminPrimaryBtnClass =
  'tap-press tap-press-dark inline-flex h-10 cursor-pointer items-center justify-center rounded-lg bg-[#163556] px-4 text-sm font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-[#1a3d63] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100'

export const adminSecondaryBtnClass =
  'tap-press tap-press-dark inline-flex h-10 cursor-pointer items-center justify-center rounded-lg border border-white/15 bg-transparent px-4 text-sm font-semibold text-white transition-all duration-300 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50'

export const adminDangerBtnClass =
  'tap-press tap-press-dark inline-flex h-10 cursor-pointer items-center justify-center rounded-lg border border-red-400/40 bg-transparent px-4 text-sm font-semibold text-red-300 transition-all duration-300 hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50'

/** Ghost round icon actions — pair with size classes (e.g. h-9 w-9) */
export const adminIconBtnClass =
  'tap-press tap-press-dark flex shrink-0 cursor-pointer items-center justify-center rounded-full text-slate-400 transition-all duration-200 hover:scale-110 hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 disabled:hover:bg-transparent'

export const adminIconDangerBtnClass =
  'tap-press tap-press-dark flex shrink-0 cursor-pointer items-center justify-center rounded-full text-slate-400 transition-all duration-200 hover:scale-110 hover:bg-red-500/10 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 disabled:hover:bg-transparent disabled:hover:text-slate-400'

export const adminFieldClass =
  'box-border h-10 w-full min-w-0 max-w-full rounded-md border px-3 py-2 text-sm text-slate-100 outline-none transition-[border-color,box-shadow,background-color] duration-200 ease-out placeholder:text-slate-500 focus:border-white/30 focus:shadow-[0_0_0_3px_rgba(255,255,255,0.08)] [color-scheme:dark] disabled:cursor-not-allowed disabled:opacity-80'

export const adminFieldStyle = {
  backgroundColor: 'rgba(255, 255, 255, 0.04)',
  borderColor: 'rgba(255, 255, 255, 0.12)',
  colorScheme: 'dark',
} as const

/** Editable / focusable fields — lighter navy than page bg */
export const adminFieldEditStyle = {
  backgroundColor: '#1e293b',
  borderColor: 'rgba(255, 255, 255, 0.16)',
  colorScheme: 'dark',
} as const

export function adminFieldStyleFor(editable: boolean) {
  return editable ? adminFieldEditStyle : adminFieldStyle
}

export const adminLabelClass = 'mb-1 block text-sm font-medium text-slate-300'
export const adminMutedClass = 'text-slate-400'
export const adminBodyClass = 'text-slate-200'
export const adminHeadingClass = 'text-white'
export const adminLinkClass =
  'tap-text cursor-pointer text-sm font-semibold text-white transition-colors hover:opacity-90'

export const adminTableWrapClass =
  'min-w-0 max-w-full overscroll-none rounded-xl border border-white/10 bg-white/[0.04]'
export const adminTableWrapStyle = { overscrollBehavior: 'none' } as const
export const adminTableHeadClass =
  'bg-[#161e2e] text-left text-xs font-semibold uppercase tracking-wide text-slate-400'
export const adminTableRowClass =
  'border-t border-white/10 text-sm text-slate-200 hover:bg-white/[0.04]'
