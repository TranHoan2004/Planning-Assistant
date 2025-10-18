'use client'

import { ItineraryResponse } from '@/app/(main)/chat/_schema/itinerary'
import { createContext, useState, use } from 'react'

type ChatContextType = {
  itinerary?: ItineraryResponse
  setItinerary: (itinerary?: ItineraryResponse) => void
  recommendHotelIds: string[]
  setRecommendHotelIds: (hotelIds: string[]) => void
}

export const ChatContext = createContext<ChatContextType | null>(null)

type ChatProviderProps = {
  children: React.ReactNode
  itinerary?: ItineraryResponse
}

export const ChatProvider = ({
  children,
  itinerary: initialItinerary
}: ChatProviderProps) => {
  const [itinerary, setItinerary] = useState<ItineraryResponse | undefined>(
    initialItinerary
  )

  const [recommendHotelIds, setRecommendHotelIds] = useState<string[]>([])

  return (
    <ChatContext.Provider
      value={{
        itinerary,
        setItinerary,
        recommendHotelIds,
        setRecommendHotelIds
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
