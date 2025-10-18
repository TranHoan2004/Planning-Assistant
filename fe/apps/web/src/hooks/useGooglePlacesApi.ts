import { PlaceDetailsResponse } from '@/types/places.type'
import { useMap, useMapsLibrary } from '@vis.gl/react-google-maps'
import { useLocale } from 'next-intl'
import { useEffect, useMemo, useState } from 'react'

const usePlacesService = () => {
  const map = useMap()
  const placesLibrary = useMapsLibrary('places')
  const [placesService, setPlacesService] =
    useState<google.maps.places.PlacesService | null>(null)

  useEffect(() => {
    if (!placesLibrary || !map) return

    setPlacesService(new placesLibrary.PlacesService(map))
  }, [placesLibrary, map])

  return placesService
}

const usePlaceDetail = (placeId: string) => {
  const placesLibrary = useMapsLibrary('places')
  const language = useLocale()

  const [placeDetail, setPlaceDetail] = useState<PlaceDetailsResponse | null>(
    null
  )
  const place = useMemo(
    () =>
      placesLibrary &&
      new placesLibrary.Place({
        id: placeId,
        requestedLanguage: language,
        requestedRegion: 'VN'
      }),
    [placesLibrary, placeId, language]
  )

  useEffect(() => {
    if (!place) return

    const getPlaceDetails = async () => {
      await place.fetchFields({
        fields: [
          'id',
          'displayName',
          'formattedAddress',
          'location',
          'rating',
          'userRatingCount',
          'businessStatus',
          'types',
          'regularOpeningHours',
          'googleMapsURI',
          'photos'
        ]
      })

      setPlaceDetail({
        id: place.id,
        displayName: {
          languageCode: place.displayNameLanguageCode,
          text: place.displayName
        },
        formattedAddress: place.formattedAddress,
        location: {
          latitude: place.location?.lat(),
          longitude: place.location?.lng()
        },
        rating: place.rating,
        userRatingCount: place.userRatingCount,
        businessStatus: place.businessStatus,
        types: place.types,
        photos: place.photos,
        openingHours: place.regularOpeningHours,
        googleMapsUri: place.googleMapsURI
      })
    }

    getPlaceDetails()
  }, [place])

  return placeDetail
}

export { usePlacesService, usePlaceDetail }
