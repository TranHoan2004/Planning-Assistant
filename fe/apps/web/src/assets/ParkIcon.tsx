import * as React from 'react'

interface ParkIconProps extends React.SVGProps<SVGSVGElement> {}

const ParkIcon = (props: ParkIconProps) => (
  <svg
    fill="#000000"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g id="SVGRepo_bgCarrier" strokeWidth={0} />
    <g
      id="SVGRepo_tracerCarrier"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <g id="SVGRepo_iconCarrier">
      <path d="M22,21H20V20a1,1,0,0,0,0-2V17a1,1,0,0,0,0-2V14a1,1,0,0,0-2,0v1H12V14a1,1,0,0,0-2,0v1a1,1,0,0,0,0,2v1a1,1,0,0,0,0,2v1H7V12.9A5.009,5.009,0,0,0,11,8V6A5,5,0,0,0,1,6V8a5.009,5.009,0,0,0,4,4.9V21H2a1,1,0,0,0,0,2H22a1,1,0,0,0,0-2ZM3,8V6A3,3,0,0,1,9,6V8A3,3,0,0,1,3,8Zm9,9h6v1H12Zm0,3h6v1H12Z" />
    </g>
  </svg>
)

export default ParkIcon
