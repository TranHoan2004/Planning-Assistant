import { NextRequest, NextResponse } from 'next/server'
import {
  getSixDigitsOtpCode,
  resetPassword,
  verifyEmail
} from '@/services/auth.service'

export const POST = async (request: NextRequest) => {
  const body = await request.json()
  try {
    const status = await verifyEmail(body.email)

    return NextResponse.json({ code: status }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    )
  }
}

export const PATCH = async (request: NextRequest) => {
  const body = await request.json()
  try {
    const status = await resetPassword(body.email, body.password)

    return NextResponse.json({ code: status }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    )
  }
}

export const GET = async (request: NextRequest) => {
  const email = request.nextUrl.searchParams.get('email')
  try {
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const data = await getSixDigitsOtpCode(email)

    return NextResponse.json({ otp: data }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    )
  }
}
