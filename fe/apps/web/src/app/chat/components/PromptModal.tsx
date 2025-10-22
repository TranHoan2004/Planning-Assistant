'use client'

import { Modal, ModalBody, ModalContent } from '@heroui/modal'
import { Input } from '@heroui/input'
import { Button } from '@heroui/button'
import { Switch } from '@heroui/switch'
import { Slider } from '@heroui/slider'
import { Select, SelectItem } from '@heroui/select'
import NumberStepper from './NumberStepper'
import {
  DateValue,
  Divider,
  Popover,
  PopoverContent,
  PopoverTrigger,
  RangeCalendar,
  RangeValue
} from '@heroui/react'
import { useState, useMemo } from 'react'
import { useChatContext } from '@/contexts/chat-context'

interface PromptModalProps {
  isOpen?: boolean
  onClose: () => void
}

const PromptModal = ({ isOpen, onClose }: PromptModalProps) => {
  const { setInitBasicParams, initBasicParams } = useChatContext()

  const [isOpenCalendar, setIsOpenCalendar] = useState(false)
  const [dateRange, setDateRange] = useState<RangeValue<DateValue> | null>(null)
  const [budgetRange, setBudgetRange] = useState<number[]>([1000000, 50000000])
  const [adults, setAdults] = useState(2)
  const [children, setChildren] = useState(0)
  const [babies, setBabies] = useState(0)
  const [withPets, setWithPets] = useState(false)

  const formatDateRange = (range: RangeValue<DateValue>) => {
    if (!range) return 'Chọn'
    const start = `${range.start.day}/${range.start.month}/${range.start.year}`
    const end = `${range.end.day}/${range.end.month}/${range.end.year}`
    return `${start} - ${end}`
  }

  const formatDateToISO = (dateValue: DateValue) => {
    return `${dateValue.year}-${String(dateValue.month).padStart(2, '0')}-${String(dateValue.day).padStart(2, '0')}`
  }

  const isFormValid = useMemo(() => {
    return (
      initBasicParams.to.trim() !== '' &&
      dateRange !== null &&
      dateRange.start !== undefined &&
      dateRange.end !== undefined
    )
  }, [initBasicParams.to, dateRange])

  const handlePlanGo = () => {
    // if (!isFormValid) return

    // Update all params in context
    setInitBasicParams({
      ...initBasicParams,
      checkInDate: dateRange ? formatDateToISO(dateRange.start) : '',
      checkOutDate: dateRange ? formatDateToISO(dateRange.end) : '',
      minBudget: budgetRange[0] ? budgetRange[0] : 1000000,
      maxBudget: budgetRange[1] ? budgetRange[1] : 50000000,
      currency: 'VND'
    })

    onClose()
  }

  // Prevent closing
  const handleCloseAttempt = () => {
    if (isFormValid) {
      onClose()
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      size="2xl"
      onClose={onClose}
      // isDismissable={isFormValid}
      // hideCloseButton={!isFormValid}
      classNames={{
        base: 'bg-white',
        closeButton: 'hover:bg-gray-100'
      }}
    >
      <ModalContent>
        {() => (
          <>
            <ModalBody className="p-6 gap-4">
              {/* Header with location selector */}
              <div className="flex items-center gap-2 pb-2">
                <span className="text-sm text-gray-600">Xuất phát từ</span>
                <Select
                  selectedKeys={[initBasicParams.from || 'hanoi']}
                  onSelectionChange={(keys) => {
                    const selected = Array.from(keys)[0] as string
                    setInitBasicParams({ ...initBasicParams, from: selected })
                  }}
                  className="w-32"
                  size="sm"
                  variant="flat"
                  classNames={{
                    trigger: 'bg-transparent hover:bg-gray-50 min-h-unit-8 h-8'
                  }}
                >
                  <SelectItem key="hanoi">Hà Nội</SelectItem>
                  <SelectItem key="hcm">TP.HCM</SelectItem>
                </Select>
              </div>

              {/* Destination and Time inputs */}
              <div className="flex gap-4">
                <div className="w-full">
                  <label className="text-sm font-medium mb-1.5 block">
                    <div className="flex items-center gap-1.5">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="13"
                        height="15"
                        viewBox="0 0 13 15"
                        fill="none"
                      >
                        <path
                          d="M10.0202 3.00992C11.9889 4.94406 11.9889 8.03944 10.0464 9.94798L6.50217 13.4304L2.95666 9.94798C2.49555 9.49791 2.12916 8.96031 1.87901 8.36677C1.62886 7.77324 1.5 7.13574 1.5 6.49175C1.5 5.84776 1.62886 5.21026 1.87901 4.61673C2.12916 4.02319 2.49555 3.48559 2.95666 3.03552L2.9829 3.00992C3.92048 2.08622 5.18439 1.56836 6.50123 1.56836C7.81808 1.56836 9.08261 2.08622 10.0202 3.00992ZM10.0202 3.00992C9.99394 2.9837 9.99394 2.9837 10.0202 3.00992ZM7.75026 5.9386C7.75026 6.26976 7.61856 6.58736 7.38415 6.82152C7.14974 7.05569 6.83181 7.18724 6.5003 7.18724C6.16879 7.18724 5.85085 7.05569 5.61644 6.82152C5.38203 6.58736 5.25033 6.26976 5.25033 5.9386C5.25033 5.60744 5.38203 5.28985 5.61644 5.05568C5.85085 4.82152 6.16879 4.68997 6.5003 4.68997C6.83181 4.68997 7.14974 4.82152 7.38415 5.05568C7.61856 5.28985 7.75026 5.60744 7.75026 5.9386Z"
                          stroke="black"
                          strokeWidth="1.25"
                          strokeMiterlimit="10"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      Điểm đến <span className="text-red-500">*</span>
                    </div>
                  </label>
                  <Input
                    placeholder="Country / City / ..."
                    value={initBasicParams.to}
                    onChange={(e) =>
                      setInitBasicParams({
                        ...initBasicParams,
                        to: e.target.value
                      })
                    }
                    variant="flat"
                    classNames={{
                      label: 'text-sm font-medium',
                      input: 'text-sm',
                      inputWrapper:
                        'bg-transparent shadow-none border-none p-0 pl-4 h-auto min-h-0 data-[hover=true]:bg-transparent group-data-[focus=true]:bg-transparent',
                      innerWrapper: 'p-0 gap-2'
                    }}
                  />
                </div>

                <div className="w-full">
                  <label className="text-sm font-medium mb-1.5 block">
                    <div className="flex items-center gap-1.5">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="15"
                        viewBox="0 0 14 15"
                        fill="none"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M3.625 0.416016C3.79076 0.416016 3.94973 0.481864 4.06694 0.599074C4.18415 0.716284 4.25 0.875255 4.25 1.04102V1.66602H9.66667V1.04102C9.66667 0.875255 9.73251 0.716284 9.84972 0.599074C9.96694 0.481864 10.1259 0.416016 10.2917 0.416016C10.4574 0.416016 10.6164 0.481864 10.7336 0.599074C10.8508 0.716284 10.9167 0.875255 10.9167 1.04102V1.67268C11.0433 1.67602 11.1614 1.68213 11.2708 1.69102C11.5875 1.71602 11.8842 1.77268 12.165 1.91602C12.5963 2.13574 12.9469 2.48639 13.1667 2.91768C13.31 3.19852 13.3667 3.49518 13.3917 3.81185C13.4167 4.11602 13.4167 4.48685 13.4167 4.93268V11.316C13.4167 11.7618 13.4167 12.1327 13.3917 12.4368C13.3667 12.7535 13.31 13.0502 13.1667 13.331C12.9472 13.7622 12.5968 14.1128 12.1658 14.3327C11.8842 14.476 11.5875 14.5327 11.2708 14.5577C10.9667 14.5827 10.5958 14.5827 10.1508 14.5827H3.76667C3.32083 14.5827 2.95 14.5827 2.64583 14.5577C2.32917 14.5327 2.0325 14.476 1.75167 14.3327C1.32063 14.1134 0.970009 13.7634 0.75 13.3327C0.606667 13.051 0.55 12.7543 0.525 12.4377C0.5 12.1335 0.5 11.7627 0.5 11.3177V4.93268C0.5 4.48685 0.5 4.11602 0.525 3.81185C0.55 3.49518 0.606667 3.19852 0.75 2.91768C0.969726 2.48639 1.32037 2.13574 1.75167 1.91602C2.0325 1.77268 2.32917 1.71602 2.64583 1.69102C2.75528 1.68213 2.87333 1.67602 3 1.67268V1.04102C3 0.958939 3.01617 0.877667 3.04758 0.801838C3.07898 0.72601 3.12502 0.65711 3.18306 0.599074C3.24109 0.541037 3.30999 0.495 3.38582 0.463591C3.46165 0.432182 3.54292 0.416016 3.625 0.416016ZM12.1667 6.24935H1.75V11.291C1.75 11.7677 1.75 12.0885 1.77083 12.3343C1.79 12.5743 1.825 12.6885 1.86333 12.7635C1.96333 12.9602 2.1225 13.1193 2.31917 13.2193C2.39417 13.2577 2.50833 13.2927 2.7475 13.3118C2.99417 13.3318 3.31417 13.3327 3.79167 13.3327H10.125C10.6017 13.3327 10.9225 13.3327 11.1683 13.3118C11.4083 13.2927 11.5225 13.2577 11.5975 13.2193C11.7938 13.1194 11.9534 12.9598 12.0533 12.7635C12.0917 12.6885 12.1267 12.5743 12.1458 12.3343C12.1658 12.0885 12.1667 11.7677 12.1667 11.291V6.24935ZM5.70833 3.54102C5.54257 3.54102 5.3836 3.60686 5.26639 3.72407C5.14918 3.84128 5.08333 4.00026 5.08333 4.16602C5.08333 4.33178 5.14918 4.49075 5.26639 4.60796C5.3836 4.72517 5.54257 4.79102 5.70833 4.79102H8.20833C8.37409 4.79102 8.53306 4.72517 8.65027 4.60796C8.76748 4.49075 8.83333 4.33178 8.83333 4.16602C8.83333 4.00026 8.76748 3.84128 8.65027 3.72407C8.53306 3.60686 8.37409 3.54102 8.20833 3.54102H5.70833Z"
                          fill="black"
                        />
                      </svg>
                      Thời điểm <span className="text-red-500">*</span>
                    </div>
                  </label>
                  <Popover
                    isOpen={isOpenCalendar}
                    onOpenChange={setIsOpenCalendar}
                    placement="bottom-start"
                  >
                    <PopoverTrigger>
                      <button className="text-sm text-left w-full cursor-pointer hover:opacity-80 transition-opacity">
                        {formatDateRange(dateRange as RangeValue<DateValue>)}
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0">
                      <RangeCalendar
                        visibleMonths={2}
                        value={dateRange}
                        onChange={(range) => {
                          setDateRange(range)
                          if (range?.end) {
                            setIsOpenCalendar(false)
                          }
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* Budget section */}
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium flex items-center gap-1.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="19"
                      height="19"
                      viewBox="0 0 19 19"
                      fill="none"
                    >
                      <path
                        d="M2.47667 17.19C3.4525 18.1667 5.02417 18.1667 8.16667 18.1667H11.5C14.6425 18.1667 16.2142 18.1667 17.19 17.19C18.1658 16.2133 18.1667 14.6425 18.1667 11.5C18.1667 10.525 18.1667 9.70167 18.1375 9M17.19 5.81C16.2142 4.83333 14.6425 4.83333 11.5 4.83333H8.16667C5.02417 4.83333 3.4525 4.83333 2.47667 5.81C1.50083 6.78667 1.5 8.3575 1.5 11.5C1.5 12.475 1.5 13.2983 1.52917 14M9.83333 1.5C11.405 1.5 12.19 1.5 12.6783 1.98833C13.1667 2.47667 13.1667 3.26167 13.1667 4.83333M6.98833 1.98833C6.5 2.47667 6.5 3.26167 6.5 4.83333"
                        stroke="black"
                        strokeWidth="1.25"
                        strokeLinecap="round"
                      />
                      <path
                        d="M9.83317 14.2768C10.754 14.2768 11.4998 13.6552 11.4998 12.8885C11.4998 12.1218 10.754 11.4993 9.83317 11.4993C8.91234 11.4993 8.1665 10.8777 8.1665 10.1102C8.1665 9.34352 8.91234 8.72185 9.83317 8.72185M9.83317 14.2768C8.91234 14.2768 8.1665 13.6552 8.1665 12.8885M9.83317 14.2768V14.8327M9.83317 8.72185V8.16602M9.83317 8.72185C10.754 8.72185 11.4998 9.34352 11.4998 10.1102"
                        stroke="black"
                        strokeWidth="1.25"
                        strokeLinecap="round"
                      />
                    </svg>
                    Ngân sách dự tính <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      className="w-8 h-8 min-w-unit-8 bg-black hover:!bg-black/80"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="15"
                        height="13"
                        viewBox="0 0 15 13"
                        fill="none"
                      >
                        <path
                          d="M0.836914 3.16602H8.33691M11.6702 3.16602H14.1702M6.67025 9.83268H14.1702M0.836914 9.83268H3.33691"
                          stroke="white"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M5.00358 11.4993C5.92406 11.4993 6.67025 10.7532 6.67025 9.83268C6.67025 8.91221 5.92406 8.16602 5.00358 8.16602C4.08311 8.16602 3.33691 8.91221 3.33691 9.83268C3.33691 10.7532 4.08311 11.4993 5.00358 11.4993Z"
                          stroke="white"
                          strokeWidth="1.25"
                        />
                        <path
                          d="M10.0036 4.83333C10.9241 4.83333 11.6702 4.08714 11.6702 3.16667C11.6702 2.24619 10.9241 1.5 10.0036 1.5C9.08311 1.5 8.33691 2.24619 8.33691 3.16667C8.33691 4.08714 9.08311 4.83333 10.0036 4.83333Z"
                          stroke="white"
                          strokeWidth="1.25"
                        />
                      </svg>
                    </Button>
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      className="w-8 h-8 min-w-unit-8"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="15"
                        viewBox="0 0 18 15"
                        fill="none"
                      >
                        <path
                          d="M2.16862 14.1673C1.71029 14.1673 1.31806 14.0043 0.991953 13.6782C0.665842 13.352 0.502509 12.9595 0.501953 12.5007V2.50065C0.501953 2.04232 0.665287 1.6501 0.991953 1.32398C1.31862 0.997873 1.71084 0.83454 2.16862 0.833984H15.502C15.9603 0.833984 16.3528 0.997318 16.6795 1.32398C17.0061 1.65065 17.1692 2.04287 17.1686 2.50065V12.5007C17.1686 12.959 17.0056 13.3515 16.6795 13.6782C16.3533 14.0048 15.9608 14.1679 15.502 14.1673H2.16862ZM2.16862 12.5007H15.502V2.50065H2.16862V12.5007ZM8.00195 11.6673H9.66862L9.91862 10.4173C10.0853 10.3479 10.2417 10.2751 10.3878 10.199C10.5339 10.1229 10.6831 10.029 10.8353 9.91732L12.0436 10.2923L12.877 8.87565L11.9186 8.04232C11.9464 7.86176 11.9603 7.68121 11.9603 7.50065C11.9603 7.3201 11.9464 7.13954 11.9186 6.95898L12.877 6.12565L12.0436 4.70898L10.8353 5.08398C10.6825 4.97287 10.5333 4.87898 10.3878 4.80232C10.2422 4.72565 10.0858 4.65287 9.91862 4.58398L9.66862 3.33398H8.00195L7.75195 4.58398C7.58529 4.65343 7.42917 4.72648 7.28362 4.80315C7.13806 4.87982 6.98862 4.97343 6.83529 5.08398L5.62695 4.70898L4.79362 6.12565L5.75195 6.95898C5.72418 7.13954 5.71029 7.3201 5.71029 7.50065C5.71029 7.68121 5.72418 7.86176 5.75195 8.04232L4.79362 8.87565L5.62695 10.2923L6.83529 9.91732C6.98806 10.0284 7.13751 10.1223 7.28362 10.199C7.42973 10.2757 7.58584 10.3484 7.75195 10.4173L8.00195 11.6673ZM8.83529 9.16732C8.37695 9.16732 7.98473 9.00426 7.65862 8.67815C7.33251 8.35204 7.16918 7.95954 7.16862 7.50065C7.16806 7.04176 7.3314 6.64954 7.65862 6.32398C7.98584 5.99843 8.37806 5.8351 8.83529 5.83398C9.29251 5.83287 9.68501 5.99621 10.0128 6.32398C10.3406 6.65176 10.5036 7.04398 10.502 7.50065C10.5003 7.95732 10.3372 8.34982 10.0128 8.67815C9.68834 9.00648 9.29584 9.16954 8.83529 9.16732Z"
                          fill="black"
                        />
                      </svg>
                    </Button>
                  </div>
                </div>

                <div className="flex items-center gap-4 px-2">
                  <span className="text-sm text-gray-700 min-w-fit">
                    đ1,000,000
                  </span>
                  <Slider
                    classNames={{
                      track: 'bg-gray-300',
                      filler: 'bg-black'
                    }}
                    color="foreground"
                    value={budgetRange}
                    onChange={(value) => setBudgetRange(value as number[])}
                    maxValue={50000000}
                    minValue={1000000}
                    step={500000}
                    formatOptions={{
                      style: 'currency',
                      currency: 'VND'
                    }}
                    showTooltip={true}
                  />
                  <span className="text-sm text-gray-700 min-w-fit">
                    đ50,000,000
                  </span>
                </div>
              </div>

              {/* Members section */}
              <div className="flex flex-col gap-3 mt-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium flex items-center gap-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="7"
                      height="15"
                      viewBox="0 0 7 15"
                      fill="none"
                    >
                      <path
                        d="M3.5 0.125C2.669 0.125 2 0.723045 2 1.46591C2 2.20877 2.669 2.80682 3.5 2.80682C4.331 2.80682 5 2.20877 5 1.46591C5 0.723045 4.331 0.125 3.5 0.125ZM1.25 4.14773C0.8345 4.14773 0.5 4.44675 0.5 4.81818V7.5C0.5 7.87143 0.8345 8.17045 1.25 8.17045H2V14.2045C2 14.576 2.3345 14.875 2.75 14.875H4.25C4.6655 14.875 5 14.576 5 14.2045V8.17045H5.75C6.1655 8.17045 6.5 7.87143 6.5 7.5V4.81818C6.5 4.44675 6.1655 4.14773 5.75 4.14773H1.25Z"
                        fill="black"
                      />
                    </svg>
                    Thành viên
                  </label>
                  <span className="text-xs text-gray-500">Optional</span>
                </div>

                <div className="flex flex-col gap-3 px-8 pt-5">
                  {/* Người lớn */}
                  <div className="flex items-center justify-between px-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">Người lớn</span>
                      <span className="text-xs text-gray-500">
                        Trên 13 tuổi
                      </span>
                    </div>
                    <NumberStepper
                      value={adults}
                      onChange={setAdults}
                      min={1}
                      max={10}
                    />
                  </div>

                  <Divider />

                  {/* Trẻ em */}
                  <div className="flex items-center justify-between px-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">Trẻ em</span>
                      <span className="text-xs text-gray-500">
                        Dưới 13 tuổi
                      </span>
                    </div>
                    <NumberStepper
                      value={children}
                      onChange={setChildren}
                      min={0}
                      max={10}
                    />
                  </div>

                  <Divider />

                  {/* Trẻ sơ sinh */}
                  <div className="flex items-center justify-between px-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">Trẻ sơ sinh</span>
                      <span className="text-xs text-gray-500">Dưới 3 tuổi</span>
                    </div>
                    <NumberStepper
                      value={babies}
                      onChange={setBabies}
                      min={0}
                      max={5}
                    />
                  </div>
                  <Divider />

                  {/* Pet toggle */}
                  <div className="flex items-center justify-between px-4">
                    <span className="text-sm text-gray-600 italic font-light">
                      Bạn có dự định đi cùng thú cưng không?
                    </span>
                    <Switch
                      color="danger"
                      size="sm"
                      isSelected={withPets}
                      onValueChange={setWithPets}
                    />
                  </div>
                </div>
              </div>

              {/* Action button */}
              <Button
                size="lg"
                radius="full"
                className="w-full bg-black text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                onPress={handlePlanGo}
                isDisabled={!isFormValid}
              >
                Plan, Gooo !
              </Button>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}

export default PromptModal
