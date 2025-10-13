'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '@heroui/input'
import PasswordInput from '@/components/ui/PasswordInput'
import { useRouter, useSearchParams } from 'next/navigation'
import { Link } from '@heroui/react'
import { callToast } from '@/app/forgot-password/components/CallToast'
import { useTranslations } from 'next-intl'

type RegisterFormData = {
  email: string
  password: string
  confirmPassword: string
}

const RegisterForm = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const t = useTranslations('RegisterPage')

  const registerFormSchema = z
    .object({
      email: z.email(t('error.invalidEmail')),
      password: z
        .string()
        .min(8, t('error.passwordLength', { passwordMin: 8 }))
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])(?=.{8,})/,
          t('error.passwordComplexity')
        ),
      confirmPassword: z.string()
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t('error.passwordMismatch'),
      path: ['confirmPassword']
    })

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: ''
    }
  })

  const callbackUrl = searchParams.get('callbackUrl') || '/'

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Registration failed')
      }

      callToast({
        title: 'Registration Successful',
        message: 'Now you can login in the login page.',
        color: 'success'
      })
      setTimeout(() => {
        router.push(
          `/login` +
            (callbackUrl !== '/'
              ? `?callbackUrl=${encodeURIComponent(callbackUrl)}`
              : '')
        )
      }, 3000)
    } catch (error) {
      console.error('Registration error:', error)
      setError('root', {
        type: 'manual',
        message:
          error instanceof Error
            ? error.message
            : 'Registration failed. Please try again.'
      })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        {...register('email')}
        variant="bordered"
        type="email"
        placeholder={t('form.emailPlaceholder')}
        className={`w-full ${errors.email ? 'border-red-500' : ''}`}
        label={t('form.email')}
        isInvalid={!!errors.email}
        errorMessage={errors.email?.message}
        autoComplete="email"
      />

      <PasswordInput
        {...register('password')}
        placeholder={t('form.passwordPlaceholder')}
        label={t('form.password')}
        isInvalid={!!errors.password}
        errorMessage={errors.password?.message}
        autoComplete="new-password"
      />

      <PasswordInput
        {...register('confirmPassword')}
        placeholder={t('form.confirmPasswordPlaceholder')}
        label={t('form.confirmPassword')}
        isInvalid={!!errors.confirmPassword}
        errorMessage={errors.confirmPassword?.message}
        autoComplete="new-password"
      />

      <p className="mt-1 text-xs text-gray-500">
        {t('form.passwordRule', { passwordMin: 8 })}
      </p>

      {errors.root && (
        <div className="text-red-500 text-sm text-center">
          {errors.root.message}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-gradient-to-r from-[#F65555] to-[#FFB26A] text-white font-medium py-2 px-4 rounded-xl hover:from-[#FFB26A] hover:to-[#F65555] transition disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isSubmitting
          ? t('form.registerButtonLoading')
          : t('form.registerButton')}
      </button>

      <p className="text-center text-sm">
        {t('form.loginText') + ' '}
        <Link className="text-sm cursor-pointer text-orange-500" href="/login">
          {t('form.loginLink')}
        </Link>
      </p>
    </form>
  )
}

export default RegisterForm
