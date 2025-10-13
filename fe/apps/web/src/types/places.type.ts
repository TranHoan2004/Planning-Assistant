export interface PlaceDetailsResponse {
  id: string
  displayName?: {
    text: string
    languageCode: string
  }
  formattedAddress?: string
  location?: {
    latitude: number
    longitude: number
  }
  rating?: number
  userRatingCount?: number
  businessStatus?: string
  priceLevel?: string
  websiteUri?: string
  internationalPhoneNumber?: string
  nationalPhoneNumber?: string
  types?: string[]
  googleMapsUri?: string
  openingHours?: {
    openNow: boolean
    periods: Array<{
      open: { day: number; hour: number; minute: number }
      close: { day: number; hour: number; minute: number }
    }>
    weekdayDescriptions: string[]
  }
  photos?: Array<{
    name: string
    widthPx: number
    heightPx: number
  }>
  reviews?: Array<{
    name: string
    relativePublishTimeDescription: string
    rating: number
    text: { text: string; languageCode: string }
    originalText: { text: string; languageCode: string }
    authorAttribution: {
      displayName: string
      uri: string
      photoUri: string
    }
  }>
  [key: string]: any
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
