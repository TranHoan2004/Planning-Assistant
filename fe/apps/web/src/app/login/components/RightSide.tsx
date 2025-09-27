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
