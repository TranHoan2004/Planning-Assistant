'use client'

import { useState, useEffect } from 'react'
import { Image } from '@heroui/image'
import React, { Suspense } from 'react'
import RegisterForm from './components/RegisterForm'
import { Link } from '@heroui/react'
import { useTranslations } from 'next-intl'

const RegisterPage = () => {
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0)
  const [displayText, setDisplayText] = useState('')
  const [isTyping, setIsTyping] = useState(true)
  const t = useTranslations('RegisterPage')

  const prompts = t.raw('prompts') as string[]

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
                <h2 className="text-6xl font-[700]">{t('slogan')}</h2>
                <p className="text-gray-500 text-md mt-4">
                  {t('subtitle') + ' '}
                  <Link href="/" className="text-orange-600">
                    {t('tryNow')}
                  </Link>
                </p>
              </div>
              <div className="w-full bg-white rounded-3xl shadow-md border border-gray-200 p-6 space-y-4">
                <Suspense>
                  <RegisterForm />
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

export default RegisterPage
