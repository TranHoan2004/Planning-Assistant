import {
  getHotelDetails,
  getHotelFacilities
} from '@/services/booking.com.service'
import { getLocale } from 'next-intl/server'
import { NextRequest, NextResponse } from 'next/server'

export const GET = async (request: NextRequest) => {
  const locale = await getLocale()
  const id = request.nextUrl.pathname.split('/').pop()
  if (!id) {
    return NextResponse.json({ error: 'Invalid hotel ID' }, { status: 400 })
  }

  try {
    const hotelFacilities = await getHotelFacilities(id)

    return NextResponse.json(hotelFacilities)
  } catch (error) {
    console.error('Error fetching hotel facilities:', error)
    return NextResponse.json(
      { error: 'Failed to fetch hotel facilities' },
      { status: 500 }
    )
  }
}
