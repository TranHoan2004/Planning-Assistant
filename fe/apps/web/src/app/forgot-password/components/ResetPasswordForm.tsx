"use client"

import React, { useState } from 'react'
import PasswordInput from '@/components/ui/PasswordInput'
import CustomButton from '@/components/ui/CustomButton'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { callToast } from '@/app/forgot-password/components/CallToast'
import { useTranslations } from 'next-intl'

interface Props {
  email: string
}

export default function ResetPasswordForm({ email }: Props) {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()
  const t = useTranslations('ForgotPasswordPage')

  const resetPasswordSchema = z
    .object({
      password: z
        .string()
        .min(8, t('passwordLength', { passwordMin: 8 }))
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])(?=.{8,})/,
          t('passwordRules')
        ),
      confirm: z
        .string()
        .min(8, t('passwordLength', { passwordMin: 8 }))
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/,
          t('passwordRules')
        )
    })
    .refine((data) => data.password === data.confirm, {
      message: t('passwordMismatch'),
      path: ['confirm']
    })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = resetPasswordSchema.safeParse({ password, confirm })
    if (!result.success) {
      const firstError =
        result.error.issues[0]?.message || t('savePasswordErrorDefault')
      setError(firstError)
      return
    }
    setError('')
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })

      const status = res.status

      if (status === 200) {
        callToast({
          message: t('resetPasswordSuccess'),
          title: t('resetPasswordSuccessTitle'),
          color: 'success'
        })

        setTimeout(() => {
          router.push('/login')
        }, 3000)
      } else {
        throw new Error('Unexpected error occurred.')
      }
    } catch (error) {
      callToast({
        message: (error as Error).message,
        title: t('resetPasswordUnexpectedError'),
        color: 'danger'
      })
    }
  }

  return (
    <div className="flex flex-col items-center justify-center p-8 max-w-[450px]">
      <h2 className="text-5xl font-[700] mb-2 text-gray-800">
        {t('resetPassword')}
      </h2>
      <p className="text-gray-500 text-md mt-4 mb-6 text-center">
        {t('resetPasswordSubtitle')}
      </p>
      <form
        onSubmit={handleSubmit}
        className="w-full flex flex-col items-center gap-4 rounded-3xl shadow-md border border-gray-200 p-8"
      >
        <PasswordInput
          className="w-full"
          value={password}
          placeholder={t('passwordPlaceholder')}
          label={t('passwordLabel')}
          onChange={(e) => {
            setPassword(e.target.value)
            setError('')
          }}
        />
        <PasswordInput
          className="w-full"
          value={confirm}
          placeholder={t('confirmPasswordPlaceholder')}
          label={t('confirmPasswordLabel')}
          onChange={(e) => {
            setConfirm(e.target.value)
            setError('')
          }}
        />
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <CustomButton
          type="submit"
          className="text-white px-6 py-2 font-semibold w-3/4"
          disabled={!password || !confirm}
        >
          {t('resetPasswordBtn')}
        </CustomButton>
      </form>
    </div>
  )
}
