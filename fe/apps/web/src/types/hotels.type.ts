// types/hotels.ts

/** Small unions for known numeric codes — keep only meaningful ones */
export type SortBy = 3 | 8 | 13 // 3=Lowest price, 8=Highest rating, 13=Most reviewed
export type RatingFilter = 7 | 8 | 9 // 7 => 3.5+, 8 => 4.0+, 9 => 4.5+
export type HotelClass = 2 | 3 | 4 | 5
export type Currency = 'USD' | 'VND' | 'EUR' | 'GBP' | 'JPY'
export type CountryCode = 'us' | 'vn' | 'uk' | 'fr' | 'jp'
export type LanguageCode = 'en' | 'vi' | 'fr' | 'es' | 'ja'

export interface HotelRequest {
  // Core search
  q: string // required - the search query

  // Localization / presentation
  gl?: CountryCode // country code - vn là việt nam
  hl?: LanguageCode // language code - vi
  currency?: Currency // currency code - VND

  // Dates (required)
  check_in_date: string // YYYY-MM-DD
  check_out_date: string // YYYY-MM-DD

  // Guests
  adults?: number // default 2
  children?: number // default 0
  children_ages?: number[] // must match children length if provided (values 1..17)

  // Filters / sorting
  sort_by?: SortBy
  rating?: RatingFilter
  min_price?: number
  max_price?: number

  // Property filters
  property_types?: number[] | string
  amenities?: number[] | string
  brands?: number[] | string

  // Hotel-specific filters
  hotel_class?: HotelClass | HotelClass[] | string
  free_cancellation?: boolean
  special_offers?: boolean
  eco_certified?: boolean

  // Vacation rental specific
  vacation_rentals?: boolean
  bedrooms?: number
  bathrooms?: number

  // Pagination / detail
  next_page_token?: string
  property_token?: string

  // SerpApi-specific / control
  engine: 'google_hotels' // required
  api_key: string
  no_cache?: boolean
  async?: boolean
  zero_trace?: boolean // enterprise only
  output?: 'json' | 'html'
  json_restrictor?: string
}

// Response Types
export interface HotelsResponse {
  ads?: Ad[]
  properties?: Property[]
  serpapi_pagination?: SerpapiPagination
  search_metadata?: any
}

/** Ads (Hiện thị nhanh - cards) */
export interface Ad {
  name: string
  source?: string
  source_icon?: string // URL
  link?: string // URL
  property_token?: string
  serpapi_property_details_link?: string // SerpApi endpoint URL
  gps_coordinates?: GPSCoordinates
  hotel_class?: number // integer hotel class
  thumbnail?: string // URL
  overall_rating?: number // float
  reviews?: number // total reviews
  price?: string // formatted price (with currency)
  amenities?: string[] // e.g. ["Free Wi-Fi", "Pool"] Tiện nghi
  free_cancellation?: boolean
}

/** Properties (detailed hotel/vacation rental data) */
export interface Property {
  type?: string // e.g. "hotel" | "vacation_rental"
  name: string
  description?: string
  link?: string // URL
  logo?: string // URL
  sponsored?: boolean
  gps_coordinates?: GPSCoordinates
  check_in_time?: string // e.g. "3:00 PM"
  check_out_time?: string // e.g. "12:00 PM"
  rate_per_night?: RateSummary
  total_rate?: RateSummary
  prices?: PriceItem[]
  nearby_places?: NearbyPlace[]
  hotel_class?: string // e.g. "5-star hotel"
  images?: ImageItem[]
  overall_rating?: number // float
  reviews?: number // integer
  ratings?: RatingCount[] // breakdown per star
  location_rating?: number // float
  reviews_breakdown?: ReviewBreakdown[] // categories (cleanliness, staff, ...)
  amenities?: string[] // included amenities
  health_and_safety?: HealthAndSafety
  essential_info?: string[] // e.g. ["Entire villa", "Sleeps 4"]
  property_token?: string
  serpapi_property_details_link?: string // SerpApi endpoint URL
}

/** Generic GPS coords */
export interface GPSCoordinates {
  latitude: number
  longitude: number
}

/** Rate summary (used for rate_per_night and total_rate) */
export interface RateSummary {
  lowest?: string // formatted currency string
  before_taxes_fees?: string // formatted currency string
}

/** Price item per source (e.g. Booking, Expedia) */
export interface PriceItem {
  source?: string
  logo?: string // URL of source's logo
  rate_per_night?: RateSummary
}

/** Nearby place and transport options */
export interface NearbyPlace {
  name: string
  transportations?: Transportation[]
}

export interface Transportation {
  type?: string // e.g. "Taxi", "Walking"
  duration?: string // e.g. "30 min"
}

/** Image list item */
export interface ImageItem {
  thumbnail?: string // URL
  original_image?: string // URL
}

/** Ratings breakdown (stars) */
export interface RatingCount {
  stars: number // 1..5
  count: number // number of reviews with that star
}

/** Reviews breakdown per category */
export interface ReviewBreakdown {
  name: string // category name
  description?: string
  total_mentioned: number
  positive: number
  negative: number
  neutral: number
}

/** Health & safety structure */
export interface HealthAndSafety {
  groups?: HealthGroup[]
  details_link?: string // URL
}

export interface HealthGroup {
  title: string
  list?: HealthItem[]
}

export interface HealthItem {
  title: string
  available: boolean
}

/** SerpApi pagination */
export interface SerpapiPagination {
  current_from?: number
  current_to?: number
  next_page_token?: string | null
  next?: string // URL to next page endpoint
}

// Validation helpers
export class HotelRequestValidator {
  static validateDates(checkIn: string, checkOut: string): boolean {
    const checkInDate = new Date(checkIn)
    const checkOutDate = new Date(checkOut)
    const today = new Date()

    // Reset time for date comparison
    today.setHours(0, 0, 0, 0)
    checkInDate.setHours(0, 0, 0, 0)
    checkOutDate.setHours(0, 0, 0, 0)

    return (
      !isNaN(checkInDate.getTime()) &&
      !isNaN(checkOutDate.getTime()) &&
      checkInDate >= today &&
      checkOutDate > checkInDate
    )
  }

  static validateChildrenAges(
    children: number,
    childrenAges?: number[]
  ): boolean {
    if (children === 0 && (!childrenAges || childrenAges.length === 0)) {
      return true
    }

    if (!childrenAges) {
      return children === 0
    }

    return (
      childrenAges.length === children &&
      childrenAges.every((age) => age >= 1 && age <= 17)
    )
  }

  static validateRequest(req: Partial<HotelRequest>): string[] {
    const errors: string[] = []

    if (!req.q?.trim()) {
      errors.push('Search query (q) is required')
    }

    if (!req.check_in_date) {
      errors.push('Check-in date is required')
    }

    if (!req.check_out_date) {
      errors.push('Check-out date is required')
    }

    if (req.check_in_date && req.check_out_date) {
      if (!this.validateDates(req.check_in_date, req.check_out_date)) {
        errors.push(
          'Invalid dates: check-in must be today or later, check-out must be after check-in'
        )
      }
    }

    if (req.children !== undefined && req.children_ages !== undefined) {
      if (!this.validateChildrenAges(req.children, req.children_ages)) {
        errors.push(
          'Children ages must match number of children and be between 1-17'
        )
      }
    }

    if (req.adults !== undefined && req.adults < 1) {
      errors.push('At least 1 adult is required')
    }

    if (!req.api_key?.trim()) {
      errors.push('API key is required')
    }

    if (!req.engine) {
      errors.push('Engine must be set to "google_hotels"')
    }

    return errors
  }
}

/**
 * Helper: convert HotelRequest -> URLSearchParams
 */
export function toQueryParams(req: HotelRequest): URLSearchParams {
  const params = new URLSearchParams()

  params.set('q', req.q)
  params.set('check_in_date', req.check_in_date)
  params.set('check_out_date', req.check_out_date)
  params.set('engine', req.engine)
  params.set('api_key', req.api_key)

  if (req.gl) params.set('gl', req.gl)
  if (req.hl) params.set('hl', req.hl)
  if (req.currency) params.set('currency', req.currency)

  if (req.adults != null) params.set('adults', String(req.adults))
  if (req.children != null) params.set('children', String(req.children))
  if (req.children_ages && req.children_ages.length) {
    params.set('children_ages', req.children_ages.join(','))
  }

  if (req.sort_by != null) params.set('sort_by', String(req.sort_by))
  if (req.rating != null) params.set('rating', String(req.rating))
  if (req.min_price != null) params.set('min_price', String(req.min_price))
  if (req.max_price != null) params.set('max_price', String(req.max_price))

  const setMaybeList = (k: string, v?: number[] | string | undefined) => {
    if (v == null) return
    if (Array.isArray(v)) params.set(k, v.join(','))
    else if (typeof v === 'string' && v.trim() !== '') params.set(k, v)
  }

  setMaybeList('property_types', req.property_types)
  setMaybeList('amenities', req.amenities)
  setMaybeList('brands', req.brands)

  if (req.hotel_class != null) {
    if (Array.isArray(req.hotel_class))
      params.set('hotel_class', req.hotel_class.join(','))
    else params.set('hotel_class', String(req.hotel_class))
  }

  if (req.free_cancellation != null)
    params.set('free_cancellation', String(req.free_cancellation))
  if (req.special_offers != null)
    params.set('special_offers', String(req.special_offers))
  if (req.eco_certified != null)
    params.set('eco_certified', String(req.eco_certified))

  if (req.vacation_rentals != null)
    params.set('vacation_rentals', String(req.vacation_rentals))
  if (req.bedrooms != null) params.set('bedrooms', String(req.bedrooms))
  if (req.bathrooms != null) params.set('bathrooms', String(req.bathrooms))

  if (req.next_page_token) params.set('next_page_token', req.next_page_token)
  if (req.property_token) params.set('property_token', req.property_token)

  if (req.no_cache != null) params.set('no_cache', String(req.no_cache))
  if (req.async != null) params.set('async', String(req.async))
  if (req.zero_trace != null) params.set('zero_trace', String(req.zero_trace))
  if (req.output) params.set('output', req.output)
  if (req.json_restrictor) params.set('json_restrictor', req.json_restrictor)

  return params
}

// Utility functions for common use cases
export class HotelSearchBuilder {
  private request: Partial<HotelRequest>

  constructor(apiKey: string) {
    this.request = {
      engine: 'google_hotels',
      api_key: apiKey,
      adults: 2,
      children: 0,
      gl: 'vn',
      hl: 'vi',
      currency: 'VND'
    }
  }

  search(query: string): this {
    this.request.q = query
    return this
  }

  dates(checkIn: string, checkOut: string): this {
    this.request.check_in_date = checkIn
    this.request.check_out_date = checkOut
    return this
  }

  guests(adults: number, children: number = 0, childrenAges?: number[]): this {
    this.request.adults = adults
    this.request.children = children
    this.request.children_ages = childrenAges
    return this
  }

  localization(
    country: CountryCode,
    language: LanguageCode,
    currency: Currency
  ): this {
    this.request.gl = country
    this.request.hl = language
    this.request.currency = currency
    return this
  }

  priceRange(min?: number, max?: number): this {
    this.request.min_price = min
    this.request.max_price = max
    return this
  }

  sortBy(sortBy: SortBy): this {
    this.request.sort_by = sortBy
    return this
  }

  rating(rating: RatingFilter): this {
    this.request.rating = rating
    return this
  }

  hotelClass(...classes: HotelClass[]): this {
    this.request.hotel_class = classes.length === 1 ? classes[0] : classes
    return this
  }

  build(): HotelRequest {
    const errors = HotelRequestValidator.validateRequest(this.request)
    if (errors.length > 0) {
      throw new Error(`Invalid hotel request: ${errors.join(', ')}`)
    }
    return this.request as HotelRequest
  }
}

// Error types
export class HotelApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public response?: any
  ) {
    super(message)
    this.name = 'HotelApiError'
  }
}
