'use client'

import { ItineraryResponse } from '../_schema/itinerary'
import { motion } from 'framer-motion'
import { formatCurrency } from '@/utils/formatters'
import { MdCalendarToday } from 'react-icons/md'
import { PiMapPinFill } from 'react-icons/pi'
import { Card, CardBody, CardHeader } from '@heroui/card'
import { formatDate } from '@/utils/utils'
import { CiTimer } from 'react-icons/ci'
import { LuUtensils, LuCar } from 'react-icons/lu'

interface ItineraryDetailViewProps {
  data?: ItineraryResponse
}

const ItineraryDetailView = ({ data }: ItineraryDetailViewProps) => {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="relative overflow-hidden rounded-3xl p-8 text-white shadow bg-gradient-primary">
        <div className="relative z-10">
          <div className="flex flex-row items-end justify-between gap-3">
            <div className="w-fit">
              <h1 className="text-2xl lg:text-5xl font-bold mb-4">
                {data?.trip_summary?.destinations?.join(', ')}
              </h1>
              <div className="flex flex-wrap gap-3 text-lg">
                <div className="flex items-center gap-2">
                  <MdCalendarToday className="size-5" />
                  <span>{data?.trip_summary?.total_days} Days</span>
                </div>
                <div className="flex items-center gap-2">
                  <PiMapPinFill className="size-5" />
                  <span>
                    {data?.trip_summary?.destinations?.length
                      ? data?.trip_summary?.destinations?.length > 1 &&
                        data?.trip_summary?.destinations?.join(', ')
                      : data?.trip_summary?.destinations}
                    Destination
                    {data?.trip_summary?.destinations?.length &&
                      data?.trip_summary?.destinations?.length > 1 &&
                      's'}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right w-fit">
              <p className="text-sm opacity-90 mb-2">Estimated Budget</p>
              <div className="text-lg font-bold">
                {formatCurrency(
                  data?.trip_summary?.estimated_total_budget?.min || 0,
                  data?.trip_summary?.estimated_total_budget?.currency || 'USD'
                )}
                <span className="text-lg font-normal"> - </span>
                {formatCurrency(
                  data?.trip_summary?.estimated_total_budget?.max || 0,
                  data?.trip_summary?.estimated_total_budget?.currency || 'USD'
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 bg-black/10"></div>
      </div>

      {/* Daily Itinerary */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-foreground mb-8">
          Daily Itinerary
        </h2>

        {data?.itinerary?.map((day, index) => (
          <motion.div
            key={`${day.date_}-${index}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="shadow-card hover:shadow-lg transition-all duration-300 border-0">
              <CardHeader className="bg-main p-6">
                <div className="w-full flex flex-row items-center justify-between gap-4">
                  <div className="text-white">
                    <h3 className="text-2xl font-bold">Day {index + 1}</h3>
                    <p className="text-lg opacity-90">
                      {formatDate(day.date_)}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <PiMapPinFill className="h-4 w-4" />
                      <span className="font-medium">{day.location}</span>
                    </div>
                  </div>
                  <div className="text-white text-right">
                    <p className="text-sm opacity-90">Daily Budget</p>
                    <p className="text-xl font-bold">
                      {formatCurrency(
                        day?.estimated_cost?.min,
                        day?.estimated_cost?.currency
                      )}{' '}
                      -{' '}
                      {formatCurrency(
                        day?.estimated_cost?.max,
                        day?.estimated_cost?.currency
                      )}
                    </p>
                  </div>
                </div>
              </CardHeader>

              <CardBody className="p-6 space-y-6">
                {/* Activities Timeline */}
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-travel-primary font-semibold">
                        <CiTimer className="h-4 w-4" />
                        <span>Morning</span>
                      </div>
                      <p className="text-muted-foreground leading-relaxed">
                        {day?.morning}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-travel-secondary font-semibold">
                        <CiTimer className="h-4 w-4" />
                        <span>Afternoon</span>
                      </div>
                      <p className="text-muted-foreground leading-relaxed">
                        {day?.afternoon}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-travel-sunset font-semibold">
                        <CiTimer className="h-4 w-4" />
                        <span>Evening</span>
                      </div>
                      <p className="text-muted-foreground leading-relaxed">
                        {day?.evening}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Additional Details */}
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Meals */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-travel-accent font-semibold">
                      <LuUtensils className="h-5 w-5" />
                      <span>Meals</span>
                    </div>
                    <ul className="space-y-1">
                      {day?.meals?.map((meal, mealIndex) => (
                        <li
                          key={mealIndex}
                          className="text-muted-foreground text-sm leading-relaxed"
                        >
                          • {meal}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Transportation */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-travel-primary font-semibold">
                      <LuCar className="h-5 w-5" />
                      <span>Transportation</span>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {day?.transportation}
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="shadow-card border-0">
          <CardHeader className="bg-gradient-mountain">
            <h3 className="text-2xl font-bold text-foreground">
              Important Travel Notes
            </h3>
          </CardHeader>
          <CardBody className="p-6">
            <div className="prose prose-gray max-w-none">
              {data?.notes?.split('\n').map((note, index) => (
                <p
                  key={index}
                  className="text-muted-foreground leading-relaxed mb-3"
                >
                  {note}
                </p>
              ))}
            </div>
          </CardBody>
        </Card>
      </motion.div>
    </div>
  )
}

export default ItineraryDetailView
