import { getHotelDetails } from '@/services/booking.com.service'
import { getLocale } from 'next-intl/server'
import { NextRequest, NextResponse } from 'next/server'

export const GET = async (request: NextRequest) => {
  const locale = await getLocale()
  const id = request.nextUrl.pathname.split('/').pop()
  if (!id) {
    return NextResponse.json({ error: 'Invalid hotel ID' }, { status: 400 })
  }

  const today = new Date()
  const arrivalDate = new Date(today)
  arrivalDate.setDate(today.getDate() + 1)
  const departureDate = new Date(today)
  departureDate.setDate(today.getDate() + 3)

  const formatDate = (date: Date): string =>
    date.toISOString().split('T')[0] ?? ''

  try {
    const hotelDetails = await getHotelDetails({
      hotel_id: id,
      arrival_date: formatDate(arrivalDate),
      departure_date: formatDate(departureDate),
      languagecode: 'vi',
      currency_code: 'VND'
    })

    return NextResponse.json(hotelDetails)
  } catch (error) {
    console.error('Error fetching hotel details:', error)
    return NextResponse.json(
      { error: 'Failed to fetch hotel details' },
      { status: 500 }
    )
  }
}
