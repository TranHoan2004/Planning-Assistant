export interface PlaceDetailsResponse {
  id: string
  displayName?: {
    text?: string | null
    languageCode?: string | null
  } | null
  formattedAddress?: string | null
  location?: {
    latitude?: number | null
    longitude?: number | null
  } | null
  rating?: number | null
  userRatingCount?: number | null
  businessStatus?: string | null
  priceLevel?: string | null
  websiteUri?: string | null
  internationalPhoneNumber?: string | null
  nationalPhoneNumber?: string | null
  types?: string[] | null
  googleMapsUri?: string | null
  openingHours?: google.maps.places.OpeningHours | null
  photos?: Array<google.maps.places.Photo> | null
  reviews?: Array<google.maps.places.Review> | null
  plusCode?: google.maps.places.PlusCode | null
  viewport?: google.maps.LatLngBounds | null
}

export interface PlaceDetailsOptions {
  placeId: string
  fields?: string[]
  languageCode?: string
  regionCode?: string
  sessionToken?: string
}

export interface PlacePhotoOptions {
  name: string
  maxWidth?: number
  maxHeight?: number
}
