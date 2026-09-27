'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBriefcase,
  faUserGroup,
  faNetworkWired,
  faPencil,
} from '@fortawesome/free-solid-svg-icons'

const icons = [
  { icon: faPencil, label: 'Academic Excellence' },
  { icon: faNetworkWired, label: 'Professional Network' },
  { icon: faUserGroup, label: 'Brotherhood & Community' },
  { icon: faBriefcase, label: 'Career Development' },
] as const

export default function NationalsIconBar() {
  return (
    <div className="relative z-10 my-12 flex justify-center gap-16 lg:justify-start">
      {icons.map(({ icon, label }) => (
        <div key={label} className="group relative">
          <FontAwesomeIcon
            icon={icon}
            size="2x"
            className="cursor-pointer text-black transition-colors duration-300 hover:text-[#315CA9]"
          />
          <div className="pointer-events-none absolute left-1/2 top-full z-20 mt-2 -translate-x-1/2 whitespace-nowrap rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-800 opacity-0 shadow-lg transition-opacity duration-300 group-hover:opacity-100">
            {label}
          </div>
        </div>
      ))}
    </div>
  )
}
