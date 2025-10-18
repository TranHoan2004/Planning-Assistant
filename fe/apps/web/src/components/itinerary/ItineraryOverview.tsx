import { TripSummary } from '@/app/(main)/chat/_schema/itinerary'
import { formatCurrency } from '@/utils/formatters'
import { Card, CardBody } from '@heroui/card'
import { cn } from '@repo/utils/tailwind-utils'
import { useTranslations } from 'next-intl'
import React from 'react'
import { MdCalendarToday } from 'react-icons/md'

interface ItineraryOverviewProps {
  summary?: TripSummary
  className?: string
}

const ItineraryOverview = ({ summary, className }: ItineraryOverviewProps) => {
  const t = useTranslations('ChatPage.itinenaryDetailView')
  return (
    <Card className={cn('p-7 shadow', className)}>
      <CardBody className="flex items-center justify-between flex-row p-0">
        <div className="flex flex-col gap-3">
          <span className="text-xl font-semibold">
            {summary?.destinations?.join(', ')}
          </span>
          <span className="inline-flex gap-3 text-lg">
            <MdCalendarToday className="size-6" />
            {summary?.total_days} {t('day')}
          </span>
        </div>
        <div>
          <p className="font-semibold text-lg">{t('estimated-budget')}</p>
          <span className="text-lg">
            {formatCurrency(
              summary?.estimated_total_budget?.min || 0,
              summary?.estimated_total_budget?.currency || 'USD'
            )}
          </span>
          <span className="text-lg"> - </span>
          <span className="text-lg">
            {formatCurrency(
              summary?.estimated_total_budget?.max || 0,
              summary?.estimated_total_budget?.currency || 'USD'
            )}
          </span>
        </div>
      </CardBody>
    </Card>
  )
}

export default ItineraryOverview
