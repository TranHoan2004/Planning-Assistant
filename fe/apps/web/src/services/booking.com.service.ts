import { HotelBookingComRequest } from '@/types/hotelbookingcom.type'
import 'server-only'

const apiKey = process.env.RAPIDAPI_KEY!

const baseUrl = 'https://booking-com15.p.rapidapi.com/api/v1'

const baseHeaders = {
  'x-rapidapi-host': 'booking-com15.p.rapidapi.com',
  'x-rapidapi-key': apiKey
}

export const getHotelDetails = async (params: HotelBookingComRequest) => {
  const url = new URL(`${baseUrl}/hotels/getHotelDetails`)

  url.searchParams.append('hotel_id', params.hotel_id)
  url.searchParams.append('arrival_date', params.arrival_date)
  url.searchParams.append('departure_date', params.departure_date)
  // url.searchParams.append('units', 'metric')
  // url.searchParams.append('temperature_unit', 'c')

  if (params.adults !== undefined) {
    url.searchParams.append('adults', params.adults.toString())
  }
  if (params.children_age) {
    url.searchParams.append('children_age', params.children_age)
  }
  if (params.room_qty !== undefined) {
    url.searchParams.append('room_qty', params.room_qty.toString())
  }
  if (params.languagecode) {
    url.searchParams.append('languagecode', params.languagecode)
  }
  if (params.currency_code) {
    url.searchParams.append('currency_code', params.currency_code)
  }

  const response = await fetch(url.toString(), {
    headers: baseHeaders
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch hotel details: ${response.statusText}`)
  }

  return response.json()
}

export const getHotelPhotos = async (hotelId: string) => {
  const url = new URL(`${baseUrl}/hotels/getHotelPhotos`)

  url.searchParams.append('hotel_id', hotelId)

  const response = await fetch(url.toString(), {
    headers: baseHeaders
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch hotel photos: ${response.statusText}`)
  }

  return response.json()
}

export const getHotelFacilities = async (hotelId: string) => {
  const url = new URL(`${baseUrl}/hotels/getHotelFacilities`)

  url.searchParams.append('hotel_id', hotelId)

  const response = await fetch(url.toString(), {
    headers: baseHeaders
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch hotel facilities: ${response.statusText}`)
  }

  return response.json()
}
