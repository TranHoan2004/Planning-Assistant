import { Favourite } from '@/types/Favourite/favourite.type'
import { FAVOURITE_API_URL } from '@/utils/constraints'
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
  if (!uid) {
    return NextResponse.json(
      { status: 'error', error: 'User ID not provided' },
      { status: 400 }
    )
  }

  try {
    const response = await fetch(`${FAVOURITE_API_URL}/${uid}?type=place`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      return NextResponse.json(
        { status: 'error', error: 'Get favourite places failed' },
        { status: response.status }
      )
    }

    const data = await response.json()

    return NextResponse.json(
      {
        status: 'success',
        data: {
          places: data.data.data
        }
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
