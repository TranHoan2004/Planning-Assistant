import { FAVOURITE_API_URL, USER_PROFILE_API_URL } from '@/utils/constraints'
import { NextRequest, NextResponse } from 'next/server'

export const GET = async (request: NextRequest) => {
  const accessToken = request.headers.get('Authorization')?.split('Bearer ')[1]

  if (!accessToken) {
    return NextResponse.json(
      { status: 'error', error: 'Access token not found' },
      { status: 401 }
    )
  }

  const uid = request.nextUrl.pathname.split('/').pop()

  try {
    const response = await fetch(`${FAVOURITE_API_URL}/count/` + uid, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      return NextResponse.json(
        { status: 'error', error: 'Get count saved failed' },
        { status: response.status }
      )
    }

    const data = await response.json()

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 })
  }
}
