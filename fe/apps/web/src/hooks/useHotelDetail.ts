import { useQuery } from '@tanstack/react-query'
import {
  HotelBookingComResponse,
  HotelPhotosResponse
} from '@/types/hotelbookingcom.type'
import { clientApi } from '@/utils/client-api'

const fetchHotelDetails = async (hotelId: string) => {
  try {
    const response = await clientApi.get(`/api/hotels/detail/${hotelId}`)
    return response.data
  } catch (err) {
    throw err
  }
}

const fetchHotelPhotos = async (hotelId: string) => {
  try {
    const response = await clientApi.get(`/api/hotels/photo/${hotelId}`)
    return response.data
  } catch (err) {
    throw err
  }
}

const fetchHotelFacilities = async (hotelId: string) => {
  try {
    const response = await clientApi.get(`/api/hotels/facility/${hotelId}`)
    return response.data
  } catch (err) {
    throw err
  }
}

const useHotelDetails = (hotelId: string) => {
  const { data, isPending, error } = useQuery({
    queryKey: ['hotelDetailsId', hotelId],
    queryFn: () => fetchHotelDetails(hotelId),
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false
  })

  return {
    hotelDetails: data as HotelBookingComResponse,
    isPending,
    error
  }
}

const useHotelPhotos = (hotelId: string) => {
  const { data, isPending, error } = useQuery({
    queryKey: ['hotelPhotoId', hotelId],
    queryFn: () => fetchHotelPhotos(hotelId),
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false
  })

  return {
    hotelPhotosResponse: data as HotelPhotosResponse,
    isPending,
    error
  }
}

const useHotelFacilities = (hotelId: string) => {
  const { data, isPending, error } = useQuery({
    queryKey: ['hotel-facilities', hotelId],
    queryFn: () => fetchHotelFacilities(hotelId)
  })

  return {
    hotelFacilities: data,
    isPending,
    error
  }
}

export { useHotelDetails, useHotelFacilities, useHotelPhotos }
