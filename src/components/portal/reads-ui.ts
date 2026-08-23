export const readsPrimaryBtnClass =
  'cursor-pointer rounded-[40px] bg-[#315CA9] px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100'

export const readsFieldClass =
  'w-full rounded-md border border-gray-100 bg-white/80 px-3 py-2 text-sm text-gray-700 outline-none transition-[border-color,box-shadow] duration-200 ease-out focus:border-[#315CA9] focus:shadow-[0_0_0_3px_rgba(49,92,169,0.18)]'

export function readsScoreBtnClass(selected: boolean) {
  return selected
    ? 'cursor-pointer flex h-9 w-9 items-center justify-center rounded-full bg-[#315CA9] text-sm font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-md'
    : 'cursor-pointer flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-gray-700 transition-all duration-300 hover:scale-105 hover:bg-gray-200 hover:shadow-sm'
}
