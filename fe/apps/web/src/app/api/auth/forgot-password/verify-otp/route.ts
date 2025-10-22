import { NextRequest, NextResponse } from 'next/server'
import { verifyOtp } from '@/services/auth.service'

export const POST = async (request: NextRequest) => {
  const body = await request.json()
  try {
    const data = await verifyOtp(body.email, body.otp)

    return NextResponse.json({ code: data.code, message: data.message }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    )
  }
}
