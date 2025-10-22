import { getHotelDetails, getHotelPhotos } from '@/services/booking.com.service'
import { getLocale } from 'next-intl/server'
import { NextRequest, NextResponse } from 'next/server'

export const GET = async (request: NextRequest) => {
  const locale = await getLocale()
  const id = request.nextUrl.pathname.split('/').pop()
  if (!id) {
    return NextResponse.json({ error: 'Invalid hotel ID' }, { status: 400 })
  }

  try {
    const hotelPhotos = await getHotelPhotos(id)

    return NextResponse.json(hotelPhotos)
  } catch (error) {
    console.error('Error fetching hotel details:', error)
    return NextResponse.json(
      { error: 'Failed to fetch hotel details' },
      { status: 500 }
    )
  }
}
