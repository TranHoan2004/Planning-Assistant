// Only using this service in server side

import { AUTH_API_URL } from '@/utils/constraints'

export interface LoginRequest {
  email: string
  password: string
}

export const login = async (request: LoginRequest) => {
  const response = await fetch(`${AUTH_API_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(request)
  })

  const data = await response.json()
  return data
}

export interface RegisterRequest {
  email: string
  password: string
}

export const register = async (request: RegisterRequest) => {
  const response = await fetch(`${AUTH_API_URL}/api/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(request)
  })

  const data = await response.json()
  return data
}

export const logout = async (accessToken: string) => {
  try {
    await fetch(`${AUTH_API_URL}/api/auth/logout`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
  } catch (error) {
    throw error
  }
}

export const refreshToken = async (refreshToken: string) => {
  const response = await fetch(`${AUTH_API_URL}/api/auth/refreshToken`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ refreshToken })
  })

  if (!response.ok) {
    throw new Error('Unauthenticated')
  }

  const data = await response.json()
  return data
}

export const verifyEmail = async (email: string) => {
  const res = await fetch(`${AUTH_API_URL}/api/auth/verify-email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email })
  })
  const data = await res.json()

  return data.status
}

export const resetPassword = async (email: string, newPassword: string) => {
  const res = await fetch(`${AUTH_API_URL}/api/auth/reset-password`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email,
      password: newPassword
    })
  })

  return res.status
}

export const GetSixDigitsOtpCode = async () => {
  const res = await fetch(`${AUTH_API_URL}/otp`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })

  if (res.ok) {
    return await res.json()
  }
}
