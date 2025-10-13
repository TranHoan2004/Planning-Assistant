import React, { useEffect, useRef, useState } from 'react'
import { Link } from '@heroui/react'
import { Input } from '@heroui/input'
import CustomButton from '@/components/ui/CustomButton'
import { IoArrowBack } from 'react-icons/io5'
import { Step } from '@/app/forgot-password/components/ForgotPasswordFlow'
import { callToast } from '@/app/forgot-password/components/CallToast'
import { get } from 'http'
import { getTranslations } from 'next-intl/server'

interface Props {
  setStep: React.Dispatch<React.SetStateAction<Step>>
  email: string
}

export default async function OtpForm({ setStep, email }: Props) {
  const inputs = Array(6).fill(0)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const LENGTH = 6
  const [values, setValues] = useState<string[]>(Array(LENGTH).fill(''))
  const [otp, setOtp] = useState('')
  const t = await getTranslations('ForgotPasswordPage')

  const focus = (i: number) => inputRefs.current[i]?.focus()

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    idx: number
  ) => {
    const value = e.target.value.replace(/[^0-9]/g, '')
    setValues((prev) => {
      const next = [...prev]
      next[idx] = value
      return next
    })
    e.target.value = value
    if (value && idx < 5) {
      inputRefs.current[idx + 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pasted = e.clipboardData
      .getData('text')
      .replace(/\D/g, '')
      .slice(0, LENGTH)
    if (!pasted) return
    const next = Array(LENGTH).fill('')
    for (let i = 0; i < pasted.length; i++) next[i] = pasted[i]
    setValues(next)
    const nextFocus = Math.min(pasted.length, LENGTH - 1)
    focus(nextFocus)
  }

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    idx: number
  ) => {
    if (e.key === 'Backspace' && !e.currentTarget.value && idx > 0) {
      inputRefs.current[idx - 1]?.focus()
    }
  }

  const handleResendOtp = async () => {
    await fetchOtp()
    callToast({
      message: t('otp-sent'),
      color: 'primary'
    })
  }

  const verifyOtp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (otp === values.join('')) {
      callToast({
        message: t('otp-valid'),
        color: 'success'
      })
      setTimeout(() => {
        setStep('reset-password')
      }, 3000)
    } else {
      callToast({
        message: t('otp-invalid'),
        color: 'warning'
      })
      setValues(Array(LENGTH).fill(''))
    }
  }

  const fetchOtp = async () => {
    try {
      const res = await fetch(
        `/api/auth/forgot-password?email=${encodeURIComponent(email)}`,
        {
          method: 'GET'
        }
      )
      const data = await res.json()

      setOtp(String(data.otp))
    } catch (error) {
      callToast({
        title: 'Error',
        message: t('otp-get-error') + (error as Error).message,
        color: 'danger'
      })
    }
  }

  useEffect(() => {
    fetchOtp()
  }, [])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-lg p-8 space-y-6">
        <div className="flex flex-col items-center space-y-3">
          <h2 className="text-3xl font-bold">{t('otp-title')}</h2>
          <p className="text-gray-500 text-center">{t('otp-subtitle')}</p>
        </div>

        <form className="space-y-6" onSubmit={(e) => verifyOtp(e)}>
          <div className="flex justify-center gap-3">
            {inputs.map((_, index) => (
              <Input
                key={index}
                type="text"
                maxLength={1}
                inputMode="numeric"
                pattern="[0-9]*"
                value={values[index]}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={handlePaste}
                ref={(el) => {
                  inputRefs.current[index] = el
                }}
                autoComplete="one-time-code"
                classNames={{
                  input: 'text-center text-2xl p-0',
                  inputWrapper:
                    'w-12 h-12 sm:w-14 sm:h-14 border border-blue-200 rounded-lg shadow-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                }}
              />
            ))}
          </div>

          <div className="flex justify-between items-center">
            <div
              className="text-blue-600 text-sm cursor-pointer"
              onClick={handleResendOtp}
            >
              {t('otp-resend')}
            </div>
            <Link href="/login" className="text-gray-500 text-sm">
              {t('backToLogin')}
            </Link>
          </div>

          <CustomButton type="submit" label="Verify" />
        </form>
      </div>
      <div
        className="flex items-center cursor-pointer text-gray-500 pt-4"
        onClick={() => setStep('verify-email')}
      >
        <IoArrowBack />
        &nbsp;Back
      </div>
    </div>
  )
}
