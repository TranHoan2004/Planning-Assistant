import {
  HotelApiError,
  HotelRequest,
  HotelSearchBuilder,
  HotelsResponse,
  toQueryParams
} from '@/types/hotels.type'

const SERPAPI_BASE_URL = 'https://serpapi.com/search.json'

export class HotelApiService {
  private apiKey: string

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async searchHotels(request: HotelRequest): Promise<HotelsResponse> {
    try {
      console.log('api key ' + this.apiKey)
      const params = toQueryParams(request)
      const url = `${SERPAPI_BASE_URL}?${params.toString()}`

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new HotelApiError(
          `API request failed: ${response.statusText}`,
          response.status
        )
      }

      const data: HotelsResponse = await response.json()

      if (data.search_metadata?.status === 'Error') {
        throw new HotelApiError('API returned an error status')
      }

      return data
    } catch (error) {
      if (error instanceof HotelApiError) {
        throw error
      }
      throw new HotelApiError(
        `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }

  // Helper method to get a builder instance
  createBuilder(): HotelSearchBuilder {
    return new HotelSearchBuilder(this.apiKey)
  }
}
