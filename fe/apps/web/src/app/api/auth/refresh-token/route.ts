import { AUTH_API_URL } from '@/utils/constraints'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const POST = async () => {
  const cookieStore = await cookies()
  const refreshToken = cookieStore.get('refresh_token')?.value

  try {
    if (!refreshToken) {
      throw new Error('Unauthenticated')
    }

    const response = await fetch(`${AUTH_API_URL}/api/auth/refreshToken`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ refreshToken })
    })

    const data = await response.json()
    cookieStore.set('access_token', data.result.accessToken)

    return NextResponse.json(
      { accessToken: data.result.accessToken },
      { status: 200 }
    )
  } catch {
    return NextResponse.json(
      {
        status: 'error',
        error: 'Unauthenticated'
      },
      {
        status: 401
      }
    )
  }
}
