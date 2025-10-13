import { MinusNumberIcon, PlusNumberIcon } from '@/assets/Icons'
import React, { useState, useEffect, useCallback } from 'react'

export interface NumberStepperProps {
  value?: number // controlled value
  defaultValue?: number // uncontrolled initial value
  min?: number
  max?: number
  step?: number
  onChange?: (v: number) => void
  className?: string
}

// A small, accessible number stepper using Tailwind + Heroicons
export default function NumberStepper({
  value: controlledValue,
  defaultValue = 1,
  min = 0,
  max = 999,
  step = 1,
  onChange,
  className = ''
}: NumberStepperProps) {
  const isControlled = typeof controlledValue === 'number'
  const [internalValue, setInternalValue] = useState<number>(defaultValue)
  const value = isControlled ? (controlledValue as number) : internalValue

  useEffect(() => {
    // clamp uncontrolled initial value to bounds
    if (!isControlled) setInternalValue((v) => Math.min(max, Math.max(min, v)))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const setValue = useCallback(
    (next: number) => {
      const clamped = Math.min(max, Math.max(min, next))
      if (!isControlled) setInternalValue(clamped)
      onChange?.(clamped)
    },
    [isControlled, min, max, onChange]
  )

  const decrement = () => setValue(value - step)
  const increment = () => setValue(value + step)

  const handleKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      increment()
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      decrement()
    } else if (e.key === 'Home') {
      e.preventDefault()
      setValue(min)
    } else if (e.key === 'End') {
      e.preventDefault()
      setValue(max)
    }
  }

  return (
    <div
      className={`flex items-center justify-between ${className} w-28 sm:w-32 md:w-36`}
      role="spinbutton"
      aria-valuenow={value}
      aria-valuemin={min}
      aria-valuemax={max}
      tabIndex={0}
      onKeyDown={handleKey}
    >
      <button
        type="button"
        onClick={decrement}
        disabled={value <= min}
        className={`relative z-0 inline-flex items-center justify-center rounded-full border px-1 py-1 text-xs min-h-[2rem] transition-colors disabled:opacity-40 disabled:pointer-events-none focus:outline-none cursor-pointer`}
      >
        <MinusNumberIcon className="w-5 h-5" aria-hidden />
      </button>

      <div className="flex-1 text-center select-none text-sm font-medium">
        {value}
      </div>

      <button
        type="button"
        onClick={increment}
        disabled={value >= max}
        className={`relative z-0 inline-flex items-center justify-center rounded-full border px-1 py-1 text-xs min-h-[2rem] transition-colors disabled:opacity-40 disabled:pointer-events-none focus:outline-none cursor-pointer`}
      >
        <PlusNumberIcon className="w-5 h-5" aria-hidden />
      </button>
    </div>
  )
}
