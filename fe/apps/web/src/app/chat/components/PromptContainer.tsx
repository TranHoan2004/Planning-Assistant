'use client'

import React from 'react'
import { useEffect, useRef, useState } from 'react'
import { cn } from '@repo/utils/tailwind-utils'
import { Button } from '@heroui/button'
import { IoMdArrowRoundUp } from 'react-icons/io'
import { CiImageOn } from 'react-icons/ci'

interface PromptContainerProps {
  className?: string
  disabled?: boolean
  placeholder?: string
  handleSubmit?: (value: string, files?: File[]) => void
}

const PromptContainer = ({
  className,
  disabled = false,
  placeholder,
  handleSubmit
}: PromptContainerProps) => {
  const [value, setValue] = useState('')
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null)

  useEffect(() => {
    const textarea = textAreaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`
    }
  }, [value])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit?.(value, selectedFiles)
      setValue('')
      setSelectedFiles([])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files) as File[]
      setSelectedFiles((prev) => [...prev, ...files])
      e.target.value = ''
    }
  }

  const handleDeleteFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handlePaste = (event: React.ClipboardEvent) => {
    const items = event.clipboardData.items
    for (let item of items) {
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile()
        if (file) {
          setSelectedFiles((prev) => [...prev, file])
        }
      }
    }
  }

  const handleSubmitClick = () => {
    if (value.trim() || selectedFiles.length > 0) {
      handleSubmit?.(value, selectedFiles)
      setValue('')
      setSelectedFiles([])
    }
  }

  return (
    <div
      className={cn(
        'w-full max-w-4xl rounded-[20px] transform-none p-3 shadow-md border border-neutral-200',
        disabled && 'opacity-50',
        className
      )}
    >
      <div
        className="grid grid-cols-[auto_1fr_auto]
        [grid-template-areas:'header_header_header'_'primary_primary_primary'_'leading_footer_trailing']
        cursor-text"
      >
        {/* File Preview Section */}
        {selectedFiles.length > 0 && (
          <div className="[grid-area:header] mb-2">
            <div className="flex gap-2 flex-wrap max-h-32 overflow-y-auto p-2">
              {selectedFiles.map((file, index) => (
                <div key={index} className="relative">
                  {file.type.startsWith('image/') ? (
                    <img
                      src={URL.createObjectURL(file)}
                      alt="preview"
                      className="w-20 h-20 rounded-lg object-cover border border-gray-200"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center">
                      <span className="text-xs text-gray-500 text-center px-1">
                        {file.name.split('.').pop()?.toUpperCase()}
                      </span>
                    </div>
                  )}
                  <button
                    onClick={() => handleDeleteFile(index)}
                    className="absolute -top-1 -right-1 w-4 h-4 bg-black text-white rounded-full flex items-center justify-center text-xs transition-transform hover:scale-105 cursor-pointer"
                  >
                    x
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex [grid-area:primary] min-h-14 max-h-32 p-2">
          <textarea
            placeholder={placeholder || 'Ask anything...'}
            ref={textAreaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            className={cn(
              'w-full resize-none border-0 bg-transparent placeholder:text-muted-foreground focus:outline-none',
              'scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent'
            )}
            rows={1}
            style={{ minHeight: '24px', lineHeight: '24px' }}
          />
        </div>

        <div className="flex items-center [grid-area:leading] pl-2">
          {/* File Upload Button */}
          <label htmlFor="file-upload" className="cursor-pointer">
            <CiImageOn className="w-6 h-6 text-gray-500 hover:text-gray-700 transition-colors" />
          </label>
          <input
            id="file-upload"
            type="file"
            accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,.txt"
            style={{ display: 'none' }}
            multiple
            onChange={handleFileChange}
            disabled={disabled}
          />
        </div>

        <div className="flex items-center overflow-x-hidden [grid-area:footer]">
          {/* File count indicator */}
          {selectedFiles.length > 0 && (
            <span className="text-sm text-gray-500">
              {selectedFiles.length} file{selectedFiles.length > 1 ? 's' : ''}{' '}
              selected
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 [grid-area:trailing]">
          <Button
            className="rounded-full bg-black w-fit"
            size="sm"
            isIconOnly
            onPress={handleSubmitClick}
            disabled={disabled || (!value.trim() && selectedFiles.length === 0)}
          >
            <IoMdArrowRoundUp className="text-white size-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default PromptContainer
