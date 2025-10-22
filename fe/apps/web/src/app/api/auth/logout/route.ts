import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { AUTH_API_URL } from '@/utils/constraints'

export const POST = async (request: NextRequest) => {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('access_token')?.value
  const refreshToken = cookieStore.get('refresh_token')?.value

  try {
    const response = await fetch(
      `${AUTH_API_URL}/api/auth/logout?accessToken=${accessToken}&refreshToken=${refreshToken}`,
      {
        method: 'POST'
      }
    )

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
