'use client'

import React, { memo } from 'react'
import { useEffect, useRef, useState } from 'react'
import { cn } from '@repo/utils/tailwind-utils'
import { Button } from '@heroui/button'
import { IoMdArrowRoundUp } from 'react-icons/io'
import { useTranslations } from 'next-intl'
import { BlinkingIcon, PromptMapIcon } from '@/assets/Icons'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  useDisclosure
} from '@heroui/react'
import PromptModal from './PromptModal'
import { useChatContext } from '@/contexts/chat-context'

interface PromptContainerProps {
  input: string
  setInput: (value: string) => void
  className?: string
  disabled?: boolean
  placeholder?: string
  handleSubmit?: (value: string, files?: File[], initBasicParams?: any) => void
}

const PromptContainer = ({
  input,
  setInput,
  className,
  disabled = false,
  placeholder,
  handleSubmit
}: PromptContainerProps) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { initBasicParams } = useChatContext()
  const hasOpenedOnce = useRef(false)
  const [isSendBasicParams, setIsSendBasicParams] = useState(true)

  const t = useTranslations('ChatPage.promptContainer')

  // useEffect(() => {
  //   if (
  //     !hasOpenedOnce.current &&
  //     !initBasicParams.to &&
  //     !initBasicParams.checkInDate
  //   ) {
  //     hasOpenedOnce.current = true
  //     onOpen()
  //   }
  // }, [initBasicParams.to, initBasicParams.checkInDate, onOpen])

  useEffect(() => {
    const textarea = textAreaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`
    }
  }, [input])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (!input.trim()) return
      if (isSendBasicParams) {
        handleSubmit?.(input, selectedFiles, initBasicParams)
        setIsSendBasicParams(false)
      } else {
        handleSubmit?.(input, selectedFiles)
      }
      setInput('')
      setSelectedFiles([])
    }
  }

  const handleSubmitClick = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() || selectedFiles.length > 0) {
      if (isSendBasicParams) {
        handleSubmit?.(input, selectedFiles, initBasicParams)
        setIsSendBasicParams(false)
      } else {
        handleSubmit?.(input, selectedFiles)
      }
      setInput('')
      setSelectedFiles([])
    }
  }

  const improvePromptcontent = (
    <PopoverContent>
      <div className="px-1 py-2">
        <div className="text-medium font-bold pb-2">Prompt mẫu gợi ý</div>
        <div className="text-tiny leading-loose w-[500px]">
          Tôi muốn lên kế hoạch cho một chuyến du lịch từ Hà Nội đến Tokyo tập
          trung vào khám phá, trải nghiệm và thư giãn. Tôi thích trải nghiệm các
          ẩm thực, hoạt động, văn hóa và con người địa phương. <br />
          Trong 5 ngày này tôi muốn ở khách sạn từ 3-5 sao, tối ưu lịch trình để
          có thể đi qua nhiều địa điểm nhất có thể. Trong số đó bắt buộc phải đi
          qua Shibuya, Asakusa/Senso-ji, Tokyo Skytree. Tôi không muốn đến những
          nơi quá đông người hoặc không có nhiều trải nghiệm. <br />
          <b>Lưu ý: </b>Ngày xuất phát có thể nhanh hơn hoặc sớm hơn, linh hoạt
          trong 2 ngày
        </div>
      </div>
    </PopoverContent>
  )

  return (
    <div
      className={cn(
        'w-full max-w-4xl rounded-[20px] transform-none p-3 shadow-md border border-neutral-200',
        'mb-14 md:mb-0',
        className
      )}
    >
      <form onSubmit={handleSubmitClick}>
        <div
          className="grid grid-cols-[auto_1fr_auto]
        [grid-template-areas:'header_header_header'_'primary_primary_primary'_'leading_footer_trailing']
        cursor-text"
        >
          <div className="flex [grid-area:primary] min-h-14 max-h-32 p-2">
            <textarea
              id="prompt-input"
              placeholder={placeholder || t('placeholderDefault')}
              ref={textAreaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className={cn(
                'w-full resize-none border-0 bg-transparent placeholder:text-muted-foreground focus:outline-none max-h-30 overflow-y-auto',
                'no-scrollbar scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 min-h-6 leading-6'
              )}
              rows={1}
            />
          </div>

          {/* Left Action Section */}
          <div className="flex items-center  [grid-area:leading] ">
            <div className="flex items-center pl-2 gap-2">
              {/*Get Input Params Button */}
              <Button
                isIconOnly
                size="sm"
                variant="light"
                radius="full"
                onPress={onOpen}
              >
                <PromptMapIcon className="w-8 h-8 " />
              </Button>
              <PromptModal isOpen={isOpen} onClose={onClose} />

              {/* Improve Prompt Button */}
              <Popover
                key={'improvePromptcontent'}
                color="default"
                placement={'top-start'}
                backdrop="opaque"
              >
                <PopoverTrigger>
                  <Button isIconOnly size="sm" radius="full" variant="light">
                    <BlinkingIcon className="w-7 h-7 text-gray-500 hover:text-gray-700 transition-colors" />
                  </Button>
                </PopoverTrigger>
                {improvePromptcontent}
              </Popover>
            </div>
          </div>

          <div className="flex items-center gap-2 [grid-area:trailing]">
            <Button
              className="rounded-full bg-black w-fit"
              size="sm"
              isIconOnly
              type="submit"
              isDisabled={disabled}
            >
              <IoMdArrowRoundUp className="text-white size-4" />
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default memo(PromptContainer)
