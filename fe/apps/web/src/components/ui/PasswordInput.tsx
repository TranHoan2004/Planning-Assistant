'use client'

import React, { useState } from 'react'
import { Input, InputProps } from '@heroui/input'
import { IoEyeOff, IoEye } from 'react-icons/io5'

interface PasswordInputProps extends InputProps {
  placeholder: string
  label?: string
}

const PasswordInput = ({
  placeholder,
  label,
  ...props
}: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false)

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <Input
      {...props}
      size="md"
      variant="bordered"
      placeholder={placeholder}
      type={showPassword ? 'text' : 'password'}
      label={label}
      endContent={
        <button
          type="button"
          aria-label="toggle password visibility"
          className="focus:outline-solid outline-transparent"
          onClick={togglePasswordVisibility}
        >
          {showPassword ? (
            <IoEyeOff className="size-6" />
          ) : (
            <IoEye className="size-6" />
          )}
        </button>
      }
    />
  )
}

export default PasswordInput
