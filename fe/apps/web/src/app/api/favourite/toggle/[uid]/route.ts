import { FAVOURITE_API_URL } from '@/utils/constraints'
import { NextRequest, NextResponse } from 'next/server'

export const POST = async (request: NextRequest) => {
  const accessToken = request.headers.get('Authorization')?.split('Bearer ')[1]

  if (!accessToken) {
    return NextResponse.json(
      { status: 'error', error: 'Access token not found' },
      { status: 401 }
    )
  }

  const uid = request.nextUrl.pathname.split('/').pop()
  if (!uid) {
    return NextResponse.json(
      { status: 'error', error: 'User ID not provided' },
      { status: 400 }
    )
  }

  const body = await request.json()
  const { place_id, place_type, latitude, longitude } = body

  try {
    const response = await fetch(`${FAVOURITE_API_URL}/toggle/${uid}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        place_id,
        place_type,
        latitude,
        longitude
      })
    })

    if (!response.ok) {
      return NextResponse.json(
        {
          status: 'error',
          error:
            'Toggle favourite for' + place_type + ': ' + place_id + ' failed'
        },
        { status: response.status }
      )
    }

    const data = await response.json()

    return NextResponse.json(
      {
        status: 'success',
        data: data
      },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { status: 'error', error: (error as Error).message },
      { status: 500 }
    )
  }
}
