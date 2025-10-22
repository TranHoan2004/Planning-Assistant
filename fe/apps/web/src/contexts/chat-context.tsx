'use client'

import { ItineraryResponse } from '@/app/chat/_schema/itinerary'
import { PlaceDetailsResponse } from '@/types/places.type'
import { createContext, useState, use } from 'react'

type ChatContextType = {
  itinerary?: ItineraryResponse
  setItinerary: (itinerary?: ItineraryResponse) => void
  recommendHotelIds: string[]
  setRecommendHotelIds: (hotelIds: string[]) => void
  initBasicParams: PlanRequest
  setInitBasicParams: (params: PlanRequest) => void
  placesData: PlaceDetailsResponse[]
  setPlacesData: React.Dispatch<React.SetStateAction<PlaceDetailsResponse[]>>
}

export const ChatContext = createContext<ChatContextType | null>(null)

type ChatProviderProps = {
  children: React.ReactNode
  itinerary?: ItineraryResponse
}

type PlanRequest = {
  from: string
  to: string
  checkInDate: string
  checkOutDate: string
  adults?: number
  children?: number
  babies?: number
  withPets?: boolean
  currency: string
  minBudget: number
  maxBudget: number
}

export const ChatProvider = ({
  children,
  itinerary: initialItinerary
}: ChatProviderProps) => {
  const [itinerary, setItinerary] = useState<ItineraryResponse | undefined>(
    initialItinerary
  )

  const [recommendHotelIds, setRecommendHotelIds] = useState<string[]>([])
  const [initBasicParams, setInitBasicParams] = useState<PlanRequest>({
    from: '',
    to: '',
    checkInDate: '',
    checkOutDate: '',
    currency: '',
    minBudget: 0,
    maxBudget: 0
  })

  const [placesData, setPlacesData] = useState<PlaceDetailsResponse[]>([])

  return (
    <ChatContext.Provider
      value={{
        itinerary,
        setItinerary,
        recommendHotelIds,
        setRecommendHotelIds,
        initBasicParams,
        setInitBasicParams,
        placesData,
        setPlacesData
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export const useChatContext = () => {
  const context = use(ChatContext)
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider')
  }
  return context
}
