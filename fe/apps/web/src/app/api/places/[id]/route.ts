import { NextRequest, NextResponse } from 'next/server'
import { getPlaceDetails } from '@/services/googlemaps.service'
import { getLocale } from 'next-intl/server'

export const GET = async (request: NextRequest) => {
  const locale = await getLocale()
  const id = request.nextUrl.pathname.split('/').pop()
  if (!id) {
    return NextResponse.json({ error: 'Invalid place ID' }, { status: 400 })
  }

  try {
    const placeDetails = await getPlaceDetails({
      placeId: id,
      languageCode: locale,
      regionCode: 'vn'
    })
    return NextResponse.json(placeDetails)
  } catch (error) {
    console.error('Error fetching place details:', error)
    return NextResponse.json(
      { error: 'Failed to fetch place details' },
      { status: 500 }
    )
  }
}
