import { useQuery } from '@tanstack/react-query'
import { PlaceDetailsResponse } from '@/types/places.type'
import { clientApi } from '@/utils/client-api'

const fetchPlaceDetails = async (placeId: string) => {
  try {
    const response = await clientApi.get(`/api/places/${placeId}`)
    return response.data
  } catch (err) {
    throw err
  }
}

const usePlaceDetails = (placeId: string) => {
  const { data, isPending, error } = useQuery({
    queryKey: ['place-details', placeId],
    queryFn: () => fetchPlaceDetails(placeId)
  })

  return {
    placeDetails: data as PlaceDetailsResponse,
    isPending,
    error
  }
}

const fetchPlacePhoto = async (
  photoName: string,
  maxWidth?: number,
  maxHeight?: number
) => {
  try {
    const response = await clientApi.get(`/api/photo/${photoName}`, {
      params: {
        maxWidth,
        maxHeight
      }
    })
    return response.data
  } catch (err) {
    throw err
  }
}

const usePlacePhoto = (
  photoName: string,
  maxWidth?: number,
  maxHeight?: number
) => {
  const { data, isPending, error } = useQuery({
    queryKey: ['place-photo', photoName],
    queryFn: () => fetchPlacePhoto(photoName, maxWidth, maxHeight),
    refetchOnWindowFocus: false,
  })
  return {
    placePhoto: data,
    isPending,
    error
  }
}

export { usePlaceDetails, usePlacePhoto }
