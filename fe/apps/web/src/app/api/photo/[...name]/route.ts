import { NextRequest, NextResponse } from 'next/server'
import { getPlacePhoto } from '@/services/googlemaps.service'

export const GET = async (
  request: NextRequest,
  { params }: { params: Promise<{ name: string[] }> }
) => {
  const name = (await params).name

  console.log('name', name)
  const photoName = name.join('/')
  const maxWidth = request.nextUrl.searchParams.get('maxWidth')
  const maxHeight = request.nextUrl.searchParams.get('maxHeight')

  if (!photoName) {
    return NextResponse.json({ error: 'Invalid photo name' }, { status: 400 })
  }

  try {
    const photo = await getPlacePhoto({
      name: photoName,
      maxWidth: Number(maxWidth),
      maxHeight: Number(maxHeight)
    })
    return NextResponse.json(photo)
  } catch (error) {
    console.error('Error fetching place photo:', error)
    return NextResponse.json(
      { error: 'Failed to fetch place photo' },
      { status: 500 }
    )
  }
}
