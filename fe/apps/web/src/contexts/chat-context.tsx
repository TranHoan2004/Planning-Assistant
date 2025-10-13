'use client'

import { ItineraryResponse } from '@/app/(main)/chat/_schema/itinerary'
import { createContext, useState, use } from 'react'

type ChatContextType = {
  currentSessionId?: string
  setCurrentSessionId: (sessionId: string) => void
  input: string
  setInput: (input: string) => void
  itinerary?: ItineraryResponse
  setItinerary: (itinerary?: ItineraryResponse) => void
  recommendHotelIds: string[]
  setRecommendHotelIds: (hotelIds: string[]) => void
}

export const ChatContext = createContext<ChatContextType | null>(null)

type ChatProviderProps = {
  children: React.ReactNode
  sessionId?: string
}

export const ChatProvider = ({ children, sessionId }: ChatProviderProps) => {
  const [currentSessionId, setCurrentSessionId] = useState(sessionId)
  const [input, setInput] = useState('')

  const [itinerary, setItinerary] = useState<ItineraryResponse | undefined>(
    undefined
  )

  const [recommendHotelIds, setRecommendHotelIds] = useState<string[]>([])

  return (
    <ChatContext.Provider
      value={{
        currentSessionId,
        setCurrentSessionId,
        input,
        setInput,
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
