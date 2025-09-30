'use client'

import React from 'react'
import { Input } from '@heroui/react'
import CustomButton from '@/components/ui/CustomButton'
import { Step } from '@/app/forgot-password/components/ForgotPasswordFlow'
import { callToast } from '@/app/forgot-password/components/CallToast'

interface VerifyEmailProps {
  setStep: React.Dispatch<React.SetStateAction<Step>>
  setEmail: React.Dispatch<React.SetStateAction<string>>
  email: string
}

const VerifyEmail = ({ setStep, setEmail, email }: VerifyEmailProps) => {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      })

      const data = await res.json()
      const status = String(data.code)

      switch (status) {
        case 'REG_002':
          callToast({
            message: 'Email is not found. Please enter your email again',
            color: 'warning'
          })
          break
        case '200':
          callToast({
            message: 'Please check your email to get 6-digit OTP code',
            title: 'Email verify success',
            color: 'success'
          })
          setTimeout(() => {
            setStep('otp')
          }, 3000)
          break
        default:
          throw new Error('Error happened when verifying email')
      }
    } catch (error) {
      callToast({
        message: (error as Error).message,
        title: 'Verify email failed',
        color: 'danger'
      })
    }
  }

  return (
    <>
      <div className="w-full text-center space-y-2">
        <h2 className="text-5xl font-[700]">Have you forgot password?</h2>
        <p className="text-gray-500 text-md mt-4">
          Enter your email to reset your password.
        </p>
      </div>
      <div className="w-full bg-white rounded-3xl shadow-md border border-gray-200 p-6 space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            required
            placeholder="abc@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full"
            label="Email"
          />
          <CustomButton type="submit" label={'Verify your email'} />
        </form>
      </div>
    </>
  )
}

export default VerifyEmail
