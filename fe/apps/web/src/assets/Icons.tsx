import * as React from 'react'

import { IconSvgProps } from '@/types'

export const Logo: React.FC<IconSvgProps> = ({
  size = 36,
  width,
  height,
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="42"
    viewBox="0 0 32 42"
    fill="none"
  >
    <g filter="url(#filter0_d_574_2131)">
      <path
        d="M20.8185 28.9165C22.1484 28.4604 23.2641 30.0036 22.4142 31.1235L18.7326 35.9751C17.5491 37.5347 15.2128 37.5612 13.9943 36.0288L10.2922 31.3716C9.33714 30.1702 10.5121 28.4578 11.9767 28.9165C12.0031 28.9234 14.6803 29.6187 16.466 29.6187C18.2525 29.6186 20.796 28.9227 20.8185 28.9165ZM19.7892 31.9692C20.2931 31.3581 19.6912 30.4663 18.9357 30.7046C18.913 30.7103 17.4439 31.0796 16.4113 31.0796C15.3706 31.0795 13.8078 30.7046 13.8078 30.7046C12.978 30.4658 12.3466 31.4536 12.9113 32.1069L15.0051 34.5288C15.7198 35.3557 17.0066 35.3414 17.7023 34.4985L19.7892 31.9692Z"
        fill="url(#paint0_linear_574_2131)"
      />
      <path
        d="M16 4C22.6274 4.00006 28 9.46759 28 16.2119C27.9998 22.9561 22.6273 28.4238 16 28.4238C9.37268 28.4238 4.00015 22.9561 4 16.2119C4 9.46756 9.37259 4 16 4ZM14.7139 6.42578C10.5566 6.42586 7.18678 9.65988 7.18652 13.6494C7.18652 17.6392 10.5564 20.8739 14.7139 20.874C18.8714 20.874 22.2422 17.6392 22.2422 13.6494C22.2419 9.65984 18.8712 6.42578 14.7139 6.42578Z"
        fill="url(#paint1_linear_574_2131)"
      />
    </g>
    <ellipse
      cx="10.9501"
      cy="10.5538"
      rx="1.32844"
      ry="1.37603"
      fill="url(#paint2_linear_574_2131)"
    />
    <ellipse
      cx="14.4926"
      cy="11.4711"
      rx="1.32844"
      ry="1.37603"
      fill="url(#paint3_linear_574_2131)"
    />
    <path
      d="M15.064 12.5382C15.0469 12.6636 14.7385 12.7221 14.3753 12.6688C14.0121 12.6155 13.7315 12.4706 13.7487 12.3452C13.7658 12.2198 14.0187 12.4089 14.3819 12.4622C14.7452 12.5155 15.0812 12.4128 15.064 12.5382Z"
      fill="white"
    />
    <path
      d="M11.4108 11.4849C11.3936 11.6103 11.0853 11.6687 10.7221 11.6154C10.3588 11.5621 10.0783 11.4173 10.0955 11.2919C10.1126 11.1665 10.3655 11.3555 10.7287 11.4088C11.0919 11.4621 11.4279 11.3595 11.4108 11.4849Z"
      fill="white"
    />
    <defs>
      <filter
        id="filter0_d_574_2131"
        x="0"
        y="0"
        width="32"
        height="41.1616"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset />
        <feGaussianBlur stdDeviation="2" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow_574_2131"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow_574_2131"
          result="shape"
        />
      </filter>
      <linearGradient
        id="paint0_linear_574_2131"
        x1="16.3286"
        y1="28.8345"
        x2="16.3286"
        y2="37.1617"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#F65565" />
        <stop offset="1" stopColor="#FFB26A" />
      </linearGradient>
      <linearGradient
        id="paint1_linear_574_2131"
        x1="16"
        y1="4"
        x2="16"
        y2="28.4238"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#F65565" />
        <stop offset="1" stopColor="#FFB26A" />
      </linearGradient>
      <linearGradient
        id="paint2_linear_574_2131"
        x1="10.9501"
        y1="9.17773"
        x2="10.9501"
        y2="11.9298"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#F65565" />
        <stop offset="1" stopColor="#FFB26A" />
      </linearGradient>
      <linearGradient
        id="paint3_linear_574_2131"
        x1="14.4926"
        y1="10.0951"
        x2="14.4926"
        y2="12.8471"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#F65565" />
        <stop offset="1" stopColor="#FFB26A" />
      </linearGradient>
    </defs>
  </svg>
)

export const DiscordIcon: React.FC<IconSvgProps> = ({
  size = 24,
  width,
  height,
  ...props
}) => {
  return (
    <svg
      height={size || height}
      viewBox="0 0 24 24"
      width={size || width}
      {...props}
    >
      <path
        d="M14.82 4.26a10.14 10.14 0 0 0-.53 1.1 14.66 14.66 0 0 0-4.58 0 10.14 10.14 0 0 0-.53-1.1 16 16 0 0 0-4.13 1.3 17.33 17.33 0 0 0-3 11.59 16.6 16.6 0 0 0 5.07 2.59A12.89 12.89 0 0 0 8.23 18a9.65 9.65 0 0 1-1.71-.83 3.39 3.39 0 0 0 .42-.33 11.66 11.66 0 0 0 10.12 0q.21.18.42.33a10.84 10.84 0 0 1-1.71.84 12.41 12.41 0 0 0 1.08 1.78 16.44 16.44 0 0 0 5.06-2.59 17.22 17.22 0 0 0-3-11.59 16.09 16.09 0 0 0-4.09-1.35zM8.68 14.81a1.94 1.94 0 0 1-1.8-2 1.93 1.93 0 0 1 1.8-2 1.93 1.93 0 0 1 1.8 2 1.93 1.93 0 0 1-1.8 2zm6.64 0a1.94 1.94 0 0 1-1.8-2 1.93 1.93 0 0 1 1.8-2 1.92 1.92 0 0 1 1.8 2 1.92 1.92 0 0 1-1.8 2z"
        fill="currentColor"
      />
    </svg>
  )
}

export const TwitterIcon: React.FC<IconSvgProps> = ({
  size = 24,
  width,
  height,
  ...props
}) => {
  return (
    <svg
      height={size || height}
      viewBox="0 0 24 24"
      width={size || width}
      {...props}
    >
      <path
        d="M19.633 7.997c.013.175.013.349.013.523 0 5.325-4.053 11.461-11.46 11.461-2.282 0-4.402-.661-6.186-1.809.324.037.636.05.973.05a8.07 8.07 0 0 0 5.001-1.721 4.036 4.036 0 0 1-3.767-2.793c.249.037.499.062.761.062.361 0 .724-.05 1.061-.137a4.027 4.027 0 0 1-3.23-3.953v-.05c.537.299 1.16.486 1.82.511a4.022 4.022 0 0 1-1.796-3.354c0-.748.199-1.434.548-2.032a11.457 11.457 0 0 0 8.306 4.215c-.062-.3-.1-.611-.1-.923a4.026 4.026 0 0 1 4.028-4.028c1.16 0 2.207.486 2.943 1.272a7.957 7.957 0 0 0 2.556-.973 4.02 4.02 0 0 1-1.771 2.22 8.073 8.073 0 0 0 2.319-.624 8.645 8.645 0 0 1-2.019 2.083z"
        fill="currentColor"
      />
    </svg>
  )
}

export const GithubIcon: React.FC<IconSvgProps> = ({
  size = 24,
  width,
  height,
  ...props
}) => {
  return (
    <svg
      height={size || height}
      viewBox="0 0 24 24"
      width={size || width}
      {...props}
    >
      <path
        clipRule="evenodd"
        d="M12.026 2c-5.509 0-9.974 4.465-9.974 9.974 0 4.406 2.857 8.145 6.821 9.465.499.09.679-.217.679-.481 0-.237-.008-.865-.011-1.696-2.775.602-3.361-1.338-3.361-1.338-.452-1.152-1.107-1.459-1.107-1.459-.905-.619.069-.605.069-.605 1.002.07 1.527 1.028 1.527 1.028.89 1.524 2.336 1.084 2.902.829.091-.645.351-1.085.635-1.334-2.214-.251-4.542-1.107-4.542-4.93 0-1.087.389-1.979 1.024-2.675-.101-.253-.446-1.268.099-2.64 0 0 .837-.269 2.742 1.021a9.582 9.582 0 0 1 2.496-.336 9.554 9.554 0 0 1 2.496.336c1.906-1.291 2.742-1.021 2.742-1.021.545 1.372.203 2.387.099 2.64.64.696 1.024 1.587 1.024 2.675 0 3.833-2.33 4.675-4.552 4.922.355.308.675.916.675 1.846 0 1.334-.012 2.41-.012 2.737 0 .267.178.577.687.479C19.146 20.115 22 16.379 22 11.974 22 6.465 17.535 2 12.026 2z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  )
}

export const MoonFilledIcon = ({
  size = 24,
  width,
  height,
  ...props
}: IconSvgProps) => (
  <svg
    aria-hidden="true"
    focusable="false"
    height={size || height}
    role="presentation"
    viewBox="0 0 24 24"
    width={size || width}
    {...props}
  >
    <path
      d="M21.53 15.93c-.16-.27-.61-.69-1.73-.49a8.46 8.46 0 01-1.88.13 8.409 8.409 0 01-5.91-2.82 8.068 8.068 0 01-1.44-8.66c.44-1.01.13-1.54-.09-1.76s-.77-.55-1.83-.11a10.318 10.318 0 00-6.32 10.21 10.475 10.475 0 007.04 8.99 10 10 0 002.89.55c.16.01.32.02.48.02a10.5 10.5 0 008.47-4.27c.67-.93.49-1.519.32-1.79z"
      fill="currentColor"
    />
  </svg>
)

export const SunFilledIcon = ({
  size = 24,
  width,
  height,
  ...props
}: IconSvgProps) => (
  <svg
    aria-hidden="true"
    focusable="false"
    height={size || height}
    role="presentation"
    viewBox="0 0 24 24"
    width={size || width}
    {...props}
  >
    <g fill="currentColor">
      <path d="M19 12a7 7 0 11-7-7 7 7 0 017 7z" />
      <path d="M12 22.96a.969.969 0 01-1-.96v-.08a1 1 0 012 0 1.038 1.038 0 01-1 1.04zm7.14-2.82a1.024 1.024 0 01-.71-.29l-.13-.13a1 1 0 011.41-1.41l.13.13a1 1 0 010 1.41.984.984 0 01-.7.29zm-14.28 0a1.024 1.024 0 01-.71-.29 1 1 0 010-1.41l.13-.13a1 1 0 011.41 1.41l-.13.13a1 1 0 01-.7.29zM22 13h-.08a1 1 0 010-2 1.038 1.038 0 011.04 1 .969.969 0 01-.96 1zM2.08 13H2a1 1 0 010-2 1.038 1.038 0 011.04 1 .969.969 0 01-.96 1zm16.93-7.01a1.024 1.024 0 01-.71-.29 1 1 0 010-1.41l.13-.13a1 1 0 011.41 1.41l-.13.13a.984.984 0 01-.7.29zm-14.02 0a1.024 1.024 0 01-.71-.29l-.13-.14a1 1 0 011.41-1.41l.13.13a1 1 0 010 1.41.97.97 0 01-.7.3zM12 3.04a.969.969 0 01-1-.96V2a1 1 0 012 0 1.038 1.038 0 01-1 1.04z" />
    </g>
  </svg>
)

export const HeartFilledIcon = ({
  size = 24,
  width,
  height,
  ...props
}: IconSvgProps) => (
  <svg
    aria-hidden="true"
    focusable="false"
    height={size || height}
    role="presentation"
    viewBox="0 0 24 24"
    width={size || width}
    {...props}
  >
    <path
      d="M12.62 20.81c-.34.12-.9.12-1.24 0C8.48 19.82 2 15.69 2 8.69 2 5.6 4.49 3.1 7.56 3.1c1.82 0 3.43.88 4.44 2.24a5.53 5.53 0 0 1 4.44-2.24C19.51 3.1 22 5.6 22 8.69c0 7-6.48 11.13-9.38 12.12Z"
      fill="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
    />
  </svg>
)

export const SearchIcon = (props: IconSvgProps) => (
  <svg
    aria-hidden="true"
    fill="none"
    focusable="false"
    height="1em"
    role="presentation"
    viewBox="0 0 24 24"
    width="1em"
    {...props}
  >
    <path
      d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
    <path
      d="M22 22L20 20"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
  </svg>
)

export const WeatherIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="85"
      height="75"
      viewBox="150 155 130 130"
      fill="none"
      preserveAspectRatio="xMidYMid meet"
      style={{ display: 'block' }}
    >
      <circle cx="211.751" cy="213.91" r="23.9102" fill="#FFE600" />
      <defs>
        <linearGradient
          id="paint0_linear_clean"
          x1="205.375"
          y1="219.808"
          x2="222.59"
          y2="198.448"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#EE9D3E" />
          <stop offset="1" stopColor="#ECA14A" stopOpacity="0" />
        </linearGradient>
      </defs>
      <circle
        cx="211.751"
        cy="213.91"
        r="23.9102"
        fill="url(#paint0_linear_clean)"
      />
      <path
        d="M156.945 240.972C160.462 248.984 171.497 264.996 203.301 264.996C235.104 264.996 240.942 247.327 239.886 238.493L239.82 238.478C238.982 228.112 230.303 219.96 219.721 219.96C217.523 219.96 215.406 220.312 213.426 220.962C209.492 209.004 198.234 200.371 184.96 200.371C168.413 200.371 155 213.785 155 230.331C155 234.079 155.688 237.666 156.945 240.972Z"
        fill="#F6F6F6"
      />
      <ellipse
        cx="226.745"
        cy="231.993"
        rx="7.26488"
        ry="5.34776"
        transform="rotate(28.8951 226.745 231.993)"
        fill="white"
        fill-opacity="0.87"
      />
      <ellipse
        cx="191.6"
        cy="211.828"
        rx="7.26488"
        ry="5.34776"
        transform="rotate(28.8951 191.6 211.828)"
        fill="white"
        fill-opacity="0.87"
      />
    </svg>
  )
}

export const PlusIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="15"
      viewBox="0 0 16 15"
      fill="none"
    >
      <path
        d="M9.11025 1.09882C9.11025 0.525606 8.647 0.0625 8.0736 0.0625C7.50021 0.0625 7.03696 0.525606 7.03696 1.09882V6.28042H1.85372C1.28033 6.28042 0.817078 6.74353 0.817078 7.31675C0.817078 7.88996 1.28033 8.35307 1.85372 8.35307H7.03696V13.5347C7.03696 14.1079 7.50021 14.571 8.0736 14.571C8.647 14.571 9.11025 14.1079 9.11025 13.5347V8.35307H14.2935C14.8669 8.35307 15.3301 7.88996 15.3301 7.31675C15.3301 6.74353 14.8669 6.28042 14.2935 6.28042H9.11025V1.09882Z"
        fill="#17FEBC"
      />
    </svg>
  )
}

export const AttachmentIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
    >
      <path
        d="M4.67314 6.13514C4.67314 4.99195 5.60288 4.0625 6.74643 4.0625H17.1129C18.2564 4.0625 19.1862 4.99195 19.1862 6.13514V14.4257C19.1862 15.5689 18.2564 16.4984 17.1129 16.4984H6.74643C5.60288 16.4984 4.67314 15.5689 4.67314 14.4257V6.13514ZM2.34069 7.17146C2.77154 7.17146 3.11817 7.51798 3.11817 7.9487V17.5347C3.11817 17.8197 3.35142 18.0528 3.63649 18.0528H15.2988C15.7296 18.0528 16.0763 18.3994 16.0763 18.8301C16.0763 19.2608 15.7296 19.6073 15.2988 19.6073H3.63649C2.49294 19.6073 1.5632 18.6779 1.5632 17.5347V7.9487C1.5632 7.51798 1.90983 7.17146 2.34069 7.17146ZM7.78308 8.20778C8.35648 8.20778 8.81973 7.74468 8.81973 7.17146C8.81973 6.59825 8.35648 6.13514 7.78308 6.13514C7.20968 6.13514 6.74643 6.59825 6.74643 7.17146C6.74643 7.74468 7.20968 8.20778 7.78308 8.20778ZM14.1487 8.58021C14.0062 8.35028 13.7568 8.20778 13.4846 8.20778C13.2125 8.20778 12.9631 8.35028 12.8205 8.58021L10.9967 11.5629L10.203 10.5719C10.054 10.3873 9.8337 10.2804 9.59721 10.2804C9.36073 10.2804 9.1372 10.3873 8.99142 10.5719L6.91813 13.1627C6.73024 13.3959 6.6946 13.7165 6.82418 13.9853C6.95376 14.2541 7.22588 14.4257 7.52392 14.4257H16.3354C16.6173 14.4257 16.8764 14.2735 17.0125 14.0274C17.1485 13.7812 17.1453 13.4833 16.9963 13.2404L14.1455 8.57697L14.1487 8.58021Z"
        fill="#17FEBC"
      />
    </svg>
  )
}

export const SendIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="19"
      viewBox="0 0 14 19"
      fill="none"
    >
      <path
        d="M7.70192 0.791808C7.26583 0.355856 6.55762 0.355856 6.12153 0.791808L0.539591 6.372C0.103502 6.80795 0.103502 7.51593 0.539591 7.95189C0.975681 8.38784 1.68389 8.38784 2.11998 7.95189L5.79708 4.27594V17.2045C5.79708 17.8218 6.29597 18.3206 6.91347 18.3206C7.53097 18.3206 8.02986 17.8218 8.02986 17.2045V4.27594L11.707 7.95189C12.1431 8.38784 12.8513 8.38784 13.2874 7.95189C13.7234 7.51593 13.7234 6.80795 13.2874 6.372L7.70541 0.791808H7.70192Z"
        fill="#17FEBC"
      />
    </svg>
  )
}

export const MenuIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
    />
  </svg>
)

export const PositionIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="18"
    width="18"
    viewBox="0 0 640 640"
  >
    <path d="M128 252.6C128 148.4 214 64 320 64C426 64 512 148.4 512 252.6C512 371.9 391.8 514.9 341.6 569.4C329.8 582.2 310.1 582.2 298.3 569.4C248.1 514.9 127.9 371.9 127.9 252.6zM320 320C355.3 320 384 291.3 384 256C384 220.7 355.3 192 320 192C284.7 192 256 220.7 256 256C256 291.3 284.7 320 320 320z" />
  </svg>
)
