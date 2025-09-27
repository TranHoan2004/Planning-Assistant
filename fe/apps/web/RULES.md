# Rules for working with Nextjs App Router

Luôn ưu tiên **không sử dụng** 'use client' directive trong page.tsx của app trừ khi page component không thể composable.

Các component tương tác với Browser Native API, hoặc cần interactive với user thì nên **tách riêng** thành client component (sử dụng 'use client' directive ở line đầu tiên của file)

layout.tsx **luôn là server component** để Nextjs chỉ render những component thay đổi giữa các page share chung layout (render {children} được pass là props của layout) tránh việc render lại full layout

Tránh việc lưu state của component vào thẳng page.tsx

- Bad practice:

```typescript
'use client'

import { useState, useEffect, Suspense } from 'react'
import { Image } from '@heroui/image'
import LoginForm from './components/LoginForm'
import { Link } from '@heroui/react'

const prompts = [
  'Ask PlanGo to make a completed initerary',
  'Ask PlanGo what should i go today',
  'Ask PlanGo to book a hotel, flight ticket'
]

export default function LoginPage() {
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0)
  const [displayText, setDisplayText] = useState('')
  const [isTyping, setIsTyping] = useState(true)

  useEffect(() => {
    const currentPrompt = prompts[currentPromptIndex]
    let timeoutId: string | number | NodeJS.Timeout | undefined

    if (isTyping && currentPrompt) {
      if (displayText.length < currentPrompt.length) {
        timeoutId = setTimeout(() => {
          setDisplayText(currentPrompt.slice(0, displayText.length + 1))
        }, 60)
      } else {
        timeoutId = setTimeout(() => {
          setIsTyping(false)
        }, 2000)
      }
    } else {
      if (displayText.length > 0) {
        timeoutId = setTimeout(() => {
          setDisplayText(displayText.slice(0, -1))
        }, 40)
      } else {
        setCurrentPromptIndex((prev) => (prev + 1) % prompts.length)
        setIsTyping(true)
      }
    }

    return () => clearTimeout(timeoutId)
  }, [displayText, isTyping, currentPromptIndex])

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="grid h-full min-h-screen lg:grid-cols-2">
        {/* Left Side */}
        <div className="flex flex-col justify-between px-4 py-4 min-h-screen">
          <div className="flex justify-center">
            <div className="w-full max-w-[250px] text-center">
              <center>
                <Link href="/" className="cursor-pointer">
                  <Image
                    src="/logo.png"
                    alt="logo"
                    className="w-30 h-30 object-contain"
                  />{' '}
                </Link>
              </center>
            </div>
          </div>

          <div className="flex justify-center flex-1 items-center">
            <div className="w-full max-w-[450px] space-y-8">
              <div className="w-full text-center space-y-2">
                <h2 className="text-6xl font-[700]">
                  Plan Less
                  <br />
                  Travel More
                </h2>
                <p className="text-gray-500 text-md mt-4">
                  The AI for planning and booking.{' '}
                  <Link href="/" className="text-orange-600">
                    Try it now !
                  </Link>
                </p>
              </div>
              <div className="w-full bg-white rounded-3xl shadow-md border border-gray-200 p-6 space-y-4">
                <Suspense>
                  <LoginForm />
                </Suspense>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="w-full max-w-[350px] text-center">
              <p className="text-gray-400 text-sm">@plango</p>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="hidden lg:flex items-center justify-center m-4 bg-gradient-to-br from-[#F65555] to-[#FFB26A] rounded-xl">
          <div className="w-full max-w-md">
            <div className="flex items-center gap-4 rounded-2xl bg-white/90 backdrop-blur-sm px-6 py-4 shadow-2xl">
              <div className="flex-1">
                <p className="text-medium text-gray-800">
                  <span className="relative inline-block min-w-[200px]">
                    {displayText}
                    <span
                      className={`absolute inline-block h-[1.4em] w-[2px] bg-blue-600 ${
                        isTyping || displayText.length === 0
                          ? 'opacity-100'
                          : 'opacity-0'
                      }`}
                      style={{
                        animation: 'blink 1s infinite'
                      }}
                      aria-hidden="true"
                    ></span>
                  </span>
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-900 hover:bg-gray-800 transition-colors cursor-pointer">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-white"
                >
                  <path d="M12 19V5M5 12l7-7 7 7"></path>
                </svg>
              </div>
            </div>
          </div>

          <style jsx>{`
            @keyframes blink {
              0%,
              50% {
                opacity: 1;
              }
              51%,
              100% {
                opacity: 0;
              }
            }
          `}</style>
        </div>
      </div>
    </div>
  )
}
```

Đây là một trang page.tsx vô cùng tệ do nó bị ép là client component trong khi state cần lưu không nằm ở chính bản thân page mà state này là của RightSide trong page.

- Good Practice:

```typescript
page.tsx

import { Suspense } from 'react'
import { Image } from '@heroui/image'
import LoginForm from './components/LoginForm'
import RightSide from './components/RightSide'
import { Link } from '@heroui/link'

export default function LoginPage() {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="grid h-full min-h-screen lg:grid-cols-2">
        {/* Left Side */}
        <div className="flex flex-col justify-between px-4 py-4 min-h-screen">
          <div className="flex justify-center">
            <div className="w-full max-w-[250px] text-center">
              <center>
                <Link href="/" className="cursor-pointer">
                  <Image
                    src="/logo.png"
                    alt="logo"
                    className="w-30 h-30 object-contain"
                  />{' '}
                </Link>
              </center>
            </div>
          </div>

          <div className="flex justify-center flex-1 items-center">
            <div className="w-full max-w-[450px] space-y-8">
              <div className="w-full text-center space-y-2">
                <h2 className="text-6xl font-[700]">
                  Plan Less
                  <br />
                  Travel More
                </h2>
                <p className="text-gray-500 text-md mt-4">
                  The AI for planning and booking.{' '}
                  <Link href="/" className="text-orange-600">
                    Try it now !
                  </Link>
                </p>
              </div>
              <div className="w-full bg-white rounded-3xl shadow-md border border-gray-200 p-6 space-y-4">
                <Suspense>
                  <LoginForm />
                </Suspense>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="w-full max-w-[350px] text-center">
              <p className="text-gray-400 text-sm">@plango</p>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <RightSide />
      </div>
    </div>
  )
}
```

```typescript
RightSide.tsx

'use client'

import { useState, useEffect } from 'react'

const prompts = [
  'Ask PlanGo to make a completed initerary',
  'Ask PlanGo what should i go today',
  'Ask PlanGo to book a hotel, flight ticket'
]

const RightSide = () => {
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0)
  const [displayText, setDisplayText] = useState('')
  const [isTyping, setIsTyping] = useState(true)

  useEffect(() => {
    const currentPrompt = prompts[currentPromptIndex]
    let timeoutId: string | number | NodeJS.Timeout | undefined

    if (isTyping && currentPrompt) {
      if (displayText.length < currentPrompt.length) {
        timeoutId = setTimeout(() => {
          setDisplayText(currentPrompt.slice(0, displayText.length + 1))
        }, 60)
      } else {
        timeoutId = setTimeout(() => {
          setIsTyping(false)
        }, 2000)
      }
    } else {
      if (displayText.length > 0) {
        timeoutId = setTimeout(() => {
          setDisplayText(displayText.slice(0, -1))
        }, 40)
      } else {
        setCurrentPromptIndex((prev) => (prev + 1) % prompts.length)
        setIsTyping(true)
      }
    }

    return () => clearTimeout(timeoutId)
  }, [displayText, isTyping, currentPromptIndex])

  return (
    <div className="hidden lg:flex items-center justify-center m-4 bg-gradient-to-br from-[#F65555] to-[#FFB26A] rounded-xl">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-4 rounded-2xl bg-white/90 backdrop-blur-sm px-6 py-4 shadow-2xl">
          <div className="flex-1">
            <p className="text-medium text-gray-800">
              <span className="relative inline-block min-w-[200px]">
                {displayText}
                <span
                  className={`absolute inline-block h-[1.4em] w-[2px] bg-blue-600 ${
                    isTyping || displayText.length === 0
                      ? 'opacity-100'
                      : 'opacity-0'
                  }`}
                  style={{
                    animation: 'blink 1s infinite'
                  }}
                  aria-hidden="true"
                ></span>
              </span>
            </p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-900 hover:bg-gray-800 transition-colors cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-white"
            >
              <path d="M12 19V5M5 12l7-7 7 7"></path>
            </svg>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blink {
          0%,
          50% {
            opacity: 1;
          }
          51%,
          100% {
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}

export default RightSide
```

Good Practice vì chúng ta đã đạt được mục tiêu là page.tsx vẫn là server component trong khi tách được right side của page ra thành một client component riêng (do sử dụng useState và useEffect hooks)
