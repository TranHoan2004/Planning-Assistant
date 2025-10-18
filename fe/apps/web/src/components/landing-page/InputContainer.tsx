'use client'

import React, { useState } from 'react'
import AnimatedPlaceholder from './AnimatedPlaceholder'
import { useRouter } from 'next/navigation'
import { Button } from '@heroui/button'
import Link from 'next/link'
import { FaArrowUp } from 'react-icons/fa6'
import { v4 as uuidv4 } from 'uuid'
import { useTranslations } from 'next-intl'
import { callToast } from '@/app/forgot-password/components/CallToast'

const InputContainer = () => {
  const router = useRouter()
  const [input, setInput] = useState('')
  const t = useTranslations('HomePage')

  const quickActions = t.raw('quick-action') as string[]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    callToast({
      title: 'Wait a minute!',
      message: 'Hang tight! We will navigate you in some seconds.',
      color: 'primary',
      isCircularProgress: true
    })
    router.push(`/chat/${uuidv4()}?query=${encodeURIComponent(input.trim())}`)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e as any)
    }
  }

  return (
    <div className="relative z-40 w-full max-w-[768px]">
      <form className="relative" onSubmit={handleSubmit}>
        <div className="relative flex flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white py-4 pl-4 pr-[52px] shadow-lg">
          <AnimatedPlaceholder isVisible={!input} />
          <textarea
            className="w-full resize-none bg-transparent text-base placeholder:text-gray-500 focus:outline-none"
            rows={4}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        {/* Send Button */}
        <div className="absolute bottom-3 right-3">
          <Button
            isIconOnly
            className="bg-black text-white disabled:bg-gray-200 disabled:text-gray-400 h-9 w-9 rounded-full transition-colors hover:opacity-70"
            type="submit"
            size="sm"
            isDisabled={!input.trim()}
            aria-label="Send prompt"
          >
            <FaArrowUp className="size-4" />
          </Button>
        </div>
      </form>

      {/* Quick Action Buttons */}
      <div className="mt-6 min-h-[96px]">
        <div className="flex flex-wrap justify-center gap-2 max-w-[545px] mx-auto">
          {quickActions.map((text) => (
            <Button
              key={text}
              variant="bordered"
              size="sm"
              className="h-10 px-3 rounded-full border-gray-300 hover:bg-gray-50 transition-colors text-gray-600"
            >
              <Link href={`/chat?query=${encodeURIComponent(text)}`}>
                {text}
              </Link>
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default InputContainer
