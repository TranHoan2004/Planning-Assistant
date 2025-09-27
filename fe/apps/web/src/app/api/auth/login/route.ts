import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { login } from '@/services/auth.service'

export const POST = async (request: NextRequest) => {
  const body = await request.json()
  const cookieStore = await cookies()

  try {
    const data = await login(body)

    if (data.status === 'error') {
      return NextResponse.json({ error: data.message }, { status: 400 })
    }

    const {
      accessToken,
      accessTokenExpiresIn,
      refreshToken,
      refreshTokenExpiresIn
    } = data.result

    cookieStore.set('access_token', accessToken, {
      maxAge: accessTokenExpiresIn,
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: 'lax'
    })

    cookieStore.set('refresh_token', refreshToken, {
      maxAge: refreshTokenExpiresIn,
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: 'lax'
    })

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 })
  }
}
