import { withAuth } from '@/middlewares/auth-middleware'
import { AUTH_API_URL } from '@/utils/constraints'
import { NextRequest, NextResponse } from 'next/server'

export const GET = withAuth(async (request: NextRequest) => {
  const response = await fetch(`${AUTH_API_URL}/api/auth/me`, {
    headers: {
      Authorization: request.headers.get('Authorization')!,
      'Content-Type': 'application/json'
    }
  })

  if (!response.ok) {
    return NextResponse.json(
      { status: 'error', error: 'Unauthorized' },
      { status: 401 }
    )
  }

  const data = await response.json()

  return NextResponse.json(data)
})
