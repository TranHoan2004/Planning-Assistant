'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '@heroui/input'
import PasswordInput from '@/components/ui/PasswordInput'
import { useRouter, useSearchParams } from 'next/navigation'
import { Link } from '@heroui/react'

const registerFormSchema = z
  .object({
    email: z.email('Please enter a valid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])(?=.{8,})/,
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
      ),
    confirmPassword: z.string()
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword']
  })

type RegisterFormData = z.infer<typeof registerFormSchema>

const RegisterForm = () => {
  const router = useRouter()
  const searchParams = useSearchParams()

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

      router.push(
        `/login` +
          (callbackUrl !== '/'
            ? `?callbackUrl=${encodeURIComponent(callbackUrl)}`
            : '')
      )
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
        placeholder="Enter your email"
        className={`w-full ${errors.email ? 'border-red-500' : ''}`}
        label="Email"
        isInvalid={!!errors.email}
        errorMessage={errors.email?.message}
        autoComplete="email"
      />

      <PasswordInput
        {...register('password')}
        placeholder="Create a password"
        label="Password"
        isInvalid={!!errors.password}
        errorMessage={errors.password?.message}
        autoComplete="new-password"
      />

      <PasswordInput
        {...register('confirmPassword')}
        placeholder="Confirm your password"
        label="Confirm Password"
        isInvalid={!!errors.confirmPassword}
        errorMessage={errors.confirmPassword?.message}
        autoComplete="new-password"
      />

      <p className="mt-1 text-xs text-gray-500">
        Must be at least 8 characters with uppercase, lowercase, number, and
        special character
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
        {isSubmitting ? 'Creating account...' : 'Create Account'}
      </button>

      <p className="text-center text-sm">
        Already have an account?{' '}
        <Link className="text-sm cursor-pointer" href="/login">
          Login now
        </Link>
      </p>
    </form>
  )
}

export default RegisterForm
