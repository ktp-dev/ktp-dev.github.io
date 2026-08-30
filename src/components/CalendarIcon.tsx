import React from 'react'

const CalendarIcon = ({
  size = 24,
  color = '#000000',
}: {
  size?: number
  color?: string
}) => (
  <svg
    width={size}
    height={size}
    strokeWidth="1.5"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    color={color}
  >
    <path
      d="M15 4V2M15 4V6M15 4H10.5M3 10V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V10H3Z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3 10V6C3 4.89543 3.89543 4 5 4H7"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M7 2V6" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path
      d="M21 10V6C21 4.89543 20.1046 4 19 4H18.5"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export default CalendarIcon
