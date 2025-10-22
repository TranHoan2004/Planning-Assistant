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

const FIELDS = [
  'displayName',
  'formattedAddress',
  'location',
  'types',
  'googleMapsURI',
  'plusCode',
  'viewport',
  'photos'
]
const usePlaceDetail = (placeId: string, options?: { enabled?: boolean }) => {
  const { enabled = true } = options || {}

  const placesLibrary = useMapsLibrary('places')
  const language = useLocale()

  const [placeDetails, setPlaceDetails] = useState<PlaceDetailsResponse | null>(
    null
  )
  const [isPending, setIsPending] = useState(false)
  const [isError, setIsError] = useState(false)

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
    if (!place || !enabled) {
      if (!enabled) {
        setIsPending(false)
      }
      return
    }

    let ignore = false

    setIsPending(true)
    setIsError(false)

    place
      .fetchFields({
        fields: FIELDS
      })
      .then(() => {
        if (!ignore) {
          setPlaceDetails({
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
            types: place.types,
            googleMapsUri: place.googleMapsURI,
            plusCode: place.plusCode,
            viewport: place.viewport,
            photos: place.photos
          })
        }
      })
      .catch((e) => {
        if (!ignore) {
          setIsError(true)
        }
      })
      .finally(() => {
        if (!ignore) {
          setIsPending(false)
        }
      })

    return () => {
      ignore = true
    }
  }, [place, enabled])

  return {
    placeDetails,
    isPending,
    isError
  }
}

export { usePlacesService, usePlaceDetail }
