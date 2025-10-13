import 'server-only'
import {
  PlaceDetailsOptions,
  PlaceDetailsResponse,
  PlacePhotoOptions
} from '@/types/places.type'

const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!

const defaultFields = [
  'id',
  'displayName',
  'formattedAddress',
  'location',
  'rating',
  'userRatingCount',
  'businessStatus',
  'types',
  'googleMapsUri',
  'photos'
]

export const getPlaceDetails = async (options: PlaceDetailsOptions) => {
  const { placeId, fields, languageCode, regionCode } = options
  const fieldMask =
    fields && fields.length > 0 ? fields.join(',') : defaultFields.join(',')
  const urlString = `https://places.googleapis.com/v1/places/${placeId}`

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-Goog-Api-Key': apiKey,
    'X-Goog-FieldMask': fieldMask
  }

  const url = new URL(urlString)
  if (languageCode) {
    url.searchParams.append('languageCode', languageCode)
  }
  if (regionCode) {
    url.searchParams.append('regionCode', regionCode)
  }

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(
        `Google Places API error: ${response.status} - ${errorData.error?.message || response.statusText}`
      )
    }

    const data: PlaceDetailsResponse = await response.json()
    return data
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch place details: ${error.message}`)
    }
    throw error
  }
}

export const getPlacePhoto = async (options: PlacePhotoOptions) => {
  const { name, maxWidth, maxHeight } = options

  if (!name) {
    throw new Error('Required photo name')
  }

  const url = new URL(`https://places.googleapis.com/v1/${name}/media`)

  if (maxWidth) {
    url.searchParams.append('maxWidthPx', maxWidth.toString())
  } else if (maxHeight) {
    url.searchParams.append('maxHeightPx', maxHeight.toString())
  } else {
    url.searchParams.append('maxWidthPx', '800')
  }

  url.searchParams.append('key', apiKey)

  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  }

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch place photo: ${response.statusText}`)
    }

    return { photoUri: response.url }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch place details: ${error.message}`)
    }
    throw error
  }
}
