import React from 'react'
import { Button } from '@repo/ui/button'

interface Props extends Omit<React.ComponentProps<typeof Button>, 'children'> {
  type: 'button' | 'submit' | 'reset'
  label?: string
  className?: string
  children?: React.ReactNode
}

const CustomButton = ({
  type,
  label,
  className,
  children,
  ...props
}: Props) => {
  return (
    <Button
      type={type}
      className={`w-full bg-gradient-to-r from-[#F65555] to-[#FFB26A] text-white font-medium py-2 px-4 rounded-xl
      hover:from-[#FFB26A] hover:to-[#F65555] transition disabled:opacity-70 disabled:cursor-not-allowed ${className}`}
      {...props}
    >
      {children ?? label}
    </Button>
  )
}

export default CustomButton
