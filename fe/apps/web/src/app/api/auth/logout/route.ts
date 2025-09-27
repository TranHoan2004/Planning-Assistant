import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { AUTH_API_URL } from '@/utils/constraints'

export const POST = async (request: NextRequest) => {
  const cookieStore = await cookies()
  const accessToken = request.headers.get('Authorization')?.split('Bearer ')[1]

  if (!accessToken) {
    return NextResponse.json(
      { status: 'error', error: 'Access token not found' },
      { status: 401 }
    )
  }

  try {
    const response = await fetch(`${AUTH_API_URL}/api/auth/logout`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      return NextResponse.json(
        { status: 'error', error: 'Logout failed' },
        { status: response.status }
      )
    }

    cookieStore.delete('access_token')

    cookieStore.delete('refresh_token')

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 })
  }
}
