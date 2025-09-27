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

const loginFormSchema = z.object({
  email: z.email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters')
})

type LoginFormData = z.infer<typeof loginFormSchema>

const LoginForm = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const dispatch = useDispatch()
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
        headers: {
          'Content-Type': 'application/json'
        },
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        {...register('email')}
        variant="bordered"
        type="email"
        placeholder="Enter your email"
        label="Email"
        isInvalid={!!errors.email}
        errorMessage={errors.email?.message}
      />

      <PasswordInput
        {...register('password')}
        placeholder="Enter your password"
        label="Password"
        isInvalid={!!errors.password}
        errorMessage={errors.password?.message}
      />

      <CustomButton
        type='submit'
        label={isSubmitting ? 'Signing in...' : 'Continue'}
        disabled={isSubmitting}
      />

      <p className="text-center text-sm text-gray-600">
        Don&#39;t have an account?{' '}
        <a
          href={
            `/register` +
            (callbackUrl !== '/'
              ? `?callbackUrl=${encodeURIComponent(callbackUrl)}`
              : '')
          }
          className="text-gray-800 underline hover:text-gray-600"
        >
          Create your account
        </a>
      </p>
      <p className="text-center text-sm">
        <a
          href="/forgot-password"
          className="text-gray-800 underline hover:text-gray-600"
        >
          Forgot password?
        </a>
      </p>
    </form>
  )
}

export default LoginForm
