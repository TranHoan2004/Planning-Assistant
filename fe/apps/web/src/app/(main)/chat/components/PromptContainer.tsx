'use client'

import React, { memo } from 'react'
import { useEffect, useRef, useState } from 'react'
import { cn } from '@repo/utils/tailwind-utils'
import { Button } from '@heroui/button'
import { IoMdArrowRoundUp } from 'react-icons/io'
import { CiImageOn } from 'react-icons/ci'
import { useTranslations } from 'next-intl'
import { BlinkingIcon, InfoIcon, PromptMapIcon } from '@/assets/Icons'
import {
  Card,
  CardBody,
  Divider,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Popover,
  PopoverContent,
  PopoverTrigger,
  RangeCalendar,
  Select,
  SelectItem,
  Slider,
  Switch,
  Tab,
  Tabs,
  Tooltip,
  useDisclosure
} from '@heroui/react'
import NumberStepper from './NumberStepper'

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
  const [input, setInput] = useState('')
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [selected, setSelected] = useState('desination')

  const t = useTranslations('ChatPage.promptContainer')

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
      handleSubmit?.(input, selectedFiles)
      setInput('')
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

  const handleSubmitClick = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() || selectedFiles.length > 0) {
      handleSubmit?.(input, selectedFiles)
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
        disabled && 'opacity-50',
        className
      )}
    >
      <form onSubmit={handleSubmitClick}>
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
                        <span className="text-xs text-gray-500  px-1">
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
              id="prompt-input"
              placeholder={placeholder || t('placeholderDefault')}
              ref={textAreaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              onPaste={handlePaste}
              className={cn(
                'w-full resize-none border-0 bg-transparent placeholder:text-muted-foreground focus:outline-none max-h-30 overflow-y-auto',
                'no-scrollbar scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100'
              )}
              rows={1}
              style={{ minHeight: '24px', lineHeight: '24px' }}
            />
          </div>

          {/* Left Action Section */}
          <div className="flex items-center  [grid-area:leading] ">
            <div className="flex items-center pl-2">
              {/* File Upload Button */}
              <label htmlFor="file-upload" className="cursor-pointer">
                <CiImageOn className="w-6 h-6" />
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
                  {selectedFiles.length} file
                  {selectedFiles.length > 1 ? 's' : ''} {t('fileCount')}
                </span>
              )}
            </div>

            <div className="flex items-center pl-2">
              {/*Get Input Params Button */}
              <button onClick={onOpen} className="cursor-pointer">
                <PromptMapIcon className="w-8 h-8 " />
              </button>
              <Modal
                isOpen={isOpen}
                size={selected === 'time' ? 'xl' : 'lg'}
                onClose={onClose}
              >
                <ModalContent>
                  {(onClose) => (
                    <>
                      <ModalHeader className="flex mx-auto">
                        <div className="flex w-full flex-col">
                          <Tabs
                            variant="solid"
                            aria-label="Options"
                            selectedKey={selected}
                            onSelectionChange={(key) =>
                              setSelected(key as string)
                            }
                          >
                            <Tab key="desination" title="Địa điểm" />
                            <Tab key="time" title="Thời gian" />
                            <Tab key="members" title="Thành viên" />
                            <Tab key="budget" title="Ngân sách" />
                          </Tabs>
                        </div>
                      </ModalHeader>
                      <ModalBody>
                        {selected === 'desination' && (
                          <>
                            <div className="flex flex-col gap-4 w-full items-center my-4">
                              <Input
                                isClearable
                                size="lg"
                                className="max-w-md"
                                placeholder="Từ"
                                variant="bordered"
                                radius="full"
                                onClear={() => console.log('input cleared')}
                              />
                              <Input
                                isClearable
                                size="lg"
                                className="max-w-md"
                                placeholder="Đến"
                                variant="bordered"
                                radius="full"
                                onClear={() => console.log('input cleared')}
                              />
                            </div>
                          </>
                        )}
                        {selected === 'time' && (
                          <div className="w-full flex justify-center my-8">
                            <RangeCalendar visibleMonths={2} color="danger" />
                          </div>
                        )}
                        {selected === 'members' && (
                          <div className="flex flex-1 flex-col overflow-y-auto overflow-x-hidden gap-4 mx-4 mt-2">
                            <div className="flex items-center justify-between mx-3">
                              <div className="flex flex-col gap-0.5 ">
                                <span className="font-semibold text-base">
                                  Người lớn
                                </span>
                                <span className="text-muted text-xs">
                                  Trên 13 tuổi
                                </span>
                              </div>
                              <NumberStepper
                                defaultValue={2}
                                min={1}
                                max={10}
                              />
                            </div>
                            <Divider />
                            <div className="flex items-center justify-between mx-3">
                              <div className="flex flex-col gap-0.5">
                                <span className="font-semibold text-base">
                                  Trẻ con
                                </span>
                                <span className="text-muted text-xs">
                                  Dưới 13 tuổi
                                </span>
                              </div>
                              <NumberStepper
                                defaultValue={0}
                                min={0}
                                max={10}
                              />
                            </div>
                            <Divider />

                            <div className="flex items-center justify-between mx-3">
                              <div className="flex flex-col gap-0.5">
                                <span className="font-semibold text-base">
                                  Trẻ sơ sinh
                                </span>
                                <span className="text-muted text-xs">
                                  Dưới 3 tuổi
                                </span>
                              </div>
                              <NumberStepper defaultValue={0} min={0} max={5} />
                            </div>
                            <Divider />

                            <div className="flex items-center justify-between mx-3">
                              <div className="flex flex-col gap-0.5">
                                <span className="text-[#00000080] text-base">
                                  <i className="flex gap-1">
                                    Bạn có dự định đi cùng thú cưng không?{' '}
                                    <Tooltip
                                      placement="top-start"
                                      color={'default'}
                                      content={
                                        <div className="px-1 py-2">
                                          <div className="text-tiny">
                                            Plango sẽ giúp bạn lên kế hoạch và
                                            tìm kiếm các khách sạn thân thiện
                                            với thú cưng hơn
                                          </div>
                                        </div>
                                      }
                                    >
                                      <button>
                                        <InfoIcon className="cursor-pointer" />
                                      </button>
                                    </Tooltip>
                                  </i>
                                </span>
                              </div>
                              <Switch color="danger" size="sm" />
                            </div>
                          </div>
                        )}
                        {selected === 'budget' && (
                          <div className="w-full flex my-8 justify-center">
                            <Slider
                              className="max-w-lg"
                              color="foreground"
                              defaultValue={[1000000, 50000000]}
                              formatOptions={{
                                style: 'currency',
                                currency: 'VND'
                              }}
                              label="Ngân sách dự tính"
                              maxValue={50000000}
                              minValue={1000000}
                              step={500000}
                            />
                          </div>
                        )}
                      </ModalBody>
                      <ModalFooter>
                        {/* <Button color="danger" variant="light" onPress={onClose}>
                        Close
                      </Button> */}
                        <Button
                          size="lg"
                          radius="full"
                          color="default"
                          onPress={onClose}
                        >
                          Save
                        </Button>
                      </ModalFooter>
                    </>
                  )}
                </ModalContent>
              </Modal>
            </div>

            <div className="flex items-center pl-2">
              {/* Improve Prompt Button */}
              <Popover
                key={'improvePromptcontent'}
                color="default"
                placement={'top-start'}
                backdrop="opaque"
              >
                <PopoverTrigger>
                  <button className="cursor-pointer">
                    <BlinkingIcon className="w-7 h-7 text-gray-500 hover:text-gray-700 transition-colors" />
                  </button>
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
              disabled={
                disabled || (!input.trim() && selectedFiles.length === 0)
              }
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
