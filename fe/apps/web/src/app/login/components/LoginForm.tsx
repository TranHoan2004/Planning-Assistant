'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '@heroui/input'
import PasswordInput from '@/components/ui/PasswordInput'
import { useRouter, useSearchParams } from 'next/navigation'
import { useDispatch } from 'react-redux'
import { setCurrentUser } from '@/state/auth-slice'
import CustomButton from '@/components/ui/CustomButton'
import { useTranslations } from 'next-intl'
import OAuthLoginButton from '@/components/ui/OAuthLoginButton'

type LoginFormData = {
  email: string
  password: string
}

const LoginForm = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const dispatch = useDispatch()
  const t = useTranslations('LoginPage')

  const loginFormSchema = z.object({
    email: z.email(t('error.invalidEmail')),
    password: z.string().min(8, t('error.invalidPassword', { passwordMin: 8 }))
  })

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const callbackUrl = searchParams.get('callbackUrl') || '/'

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (response.ok) {
        const { result } = await response.json()
        dispatch(setCurrentUser({ id: result.id, email: result.email }))
        router.push(callbackUrl)
      }
    } catch (error) {
      console.error('Login error:', error)
    }
  }

  return (
    <>
      <OAuthLoginButton provider="google" callbackUrl={callbackUrl} />
      <div className="flex items-center gap-4 text-sm">
        <div className="flex-1 h-px bg-gray-200"></div>
        <div className="text-foreground-600">{t('or-continue')}</div>
        <div className="flex-1 h-px bg-gray-200"></div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          {...register('email')}
          variant="bordered"
          type="email"
          placeholder={t('form.emailPlaceholder')}
          label={t('form.email')}
          isInvalid={!!errors.email}
          errorMessage={errors.email?.message}
        />

        <PasswordInput
          {...register('password')}
          placeholder={t('form.passwordPlaceholder')}
          label={t('form.password')}
          isInvalid={!!errors.password}
          errorMessage={errors.password?.message}
        />

        <CustomButton
          type="submit"
          label={
            isSubmitting ? t('form.loginButtonLoading') : t('form.loginButton')
          }
          disabled={isSubmitting}
        />

        <p className="text-center text-sm text-gray-600">
          {t('form.registerText')}{' '}
          <a
            href={`/register${callbackUrl !== '/' ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ''}`}
            className="text-gray-800 underline hover:text-gray-600"
          >
            {t('form.registerLink')}
          </a>
        </p>

        <p className="text-center text-sm">
          <a
            href="/forgot-password"
            className="text-gray-800 underline hover:text-gray-600"
          >
            {t('form.forgotPassword')}
          </a>
        </p>
      </form>
    </>
  )
}

export default LoginForm
