'use client'

import { ItineraryResponse } from '../_schema/itinerary'
import { useTranslations } from 'next-intl'
import DailyItinerary from '@/components/ui/DailyItinerary'
import ItineraryOverview from '@/components/ui/ItineraryOverview'
import { Response as AIResponse } from '@/components/ui/response'

interface ItineraryDetailViewProps {
  data?: ItineraryResponse
}

const ItineraryDetailView = ({ data }: ItineraryDetailViewProps) => {
  const t = useTranslations('ChatPage.itinenaryDetailView')

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <ItineraryOverview summary={data?.trip_summary} />

      {/* Daily Itinerary */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-foreground mb-8">
          {t('daily-itinerary')}
        </h2>

        {data?.itinerary?.map((day, index) => (
          <DailyItinerary key={index} order={index + 1} itineraryDay={day} />
        ))}
      </div>

      {data?.notes && (
        <>
          <h3 className="text-2xl font-bold text-foreground">
            {t('important-travel-notes')}
          </h3>

          {data?.notes?.split('\n').map((note, index) => (
            <AIResponse
              key={index}
              className="text-muted-foreground leading-relaxed mb-3"
            >
              {note}
            </AIResponse>
          ))}
        </>
      )}
    </div>
  )
}

export default ItineraryDetailView
