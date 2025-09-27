import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const GET = async () => {
  const cookieStore = await cookies()

  const accessToken = cookieStore.get('access_token')?.value

  if (!accessToken) {
    return NextResponse.json(
      { status: 'error', error: 'Access token not found' },
      { status: 401 }
    )
  }

  return NextResponse.json(
    { accessToken },
    {
      status: 200
    }
  )
}
