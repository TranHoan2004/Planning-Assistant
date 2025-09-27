import { NextRequest, NextResponse } from 'next/server'
import { register } from '@/services/auth.service'

export const POST = async (request: NextRequest) => {
  const body = await request.json()

  try {
    const data = await register(body)

    if (data.status === 'error') {
      return NextResponse.json({ error: data.message }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 })
  }
}
