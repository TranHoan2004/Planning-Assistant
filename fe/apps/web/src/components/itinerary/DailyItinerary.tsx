import React, { useState } from 'react'
import { ItineraryDay } from '@/app/(main)/chat/_schema/itinerary'
import { Response as AIResponse } from '../ai/response'
import { useTranslations } from 'next-intl'
import { IoMoonOutline } from 'react-icons/io5'
import { CiSun } from 'react-icons/ci'
import { formatDate } from '@/utils/utils'
import { Button } from '@heroui/react'
import { FaChevronUp, FaChevronDown } from 'react-icons/fa6'
import { MdCalendarToday } from 'react-icons/md'
import { IoIosRestaurant } from 'react-icons/io'
import { PiClockAfternoon, PiCarProfile, PiMapPinFill } from 'react-icons/pi'
import { motion, AnimatePresence } from 'framer-motion'
import { Swiper, SwiperSlide } from 'swiper/react'
import { A11y, Navigation, Pagination, Scrollbar } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import PlaceCard from '@/components/places/PlaceCard'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '../ui/carousel'

interface DailyItineraryProps {
  order: number
  itineraryDay: ItineraryDay
}

const DailyItinerary = ({ order, itineraryDay }: DailyItineraryProps) => {
  const t = useTranslations('ChatPage.itinenaryDetailView')
  const [expand, setExpand] = useState(false)

  return (
    <div className="relative w-full h-auto flex flex-col border border-neutral-300/50 shadow rounded-2xl px-7 py-5 gap-3">
      <Button
        isIconOnly
        className="absolute top-4 right-4"
        size="sm"
        radius="full"
        variant="light"
        onPress={() => setExpand(!expand)}
      >
        {expand ? (
          <FaChevronDown className="size-4" />
        ) : (
          <FaChevronUp className="size-4" />
        )}
      </Button>
      <div className="flex items-center justify-start gap-2">
        <h1 className="font-bold text-2xl">
          {t('day')} {order}
        </h1>
        <span>
          <PiMapPinFill className="size-6" />
        </span>
        <span className="text-lg">{itineraryDay.location}</span>
        <span>
          <MdCalendarToday className="size-6" />
        </span>
        <span className="text-lg">{formatDate(itineraryDay.date_)}</span>
      </div>
      <AnimatePresence initial={false}>
        {expand && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="flex flex-col gap-3"
          >
            <div className="grid grid-cols-3 gap-4">
              <div className="w-full">
                <h6 className="text-lg font-semibold inline-flex items-center gap-2">
                  <span>
                    <CiSun className="size-6" />
                  </span>
                  {t('activity-timeline.morning')}
                </h6>
                <AIResponse>{itineraryDay.morning}</AIResponse>
              </div>
              <div className="w-full">
                <h6 className="text-lg font-semibold inline-flex items-center gap-2">
                  <span>
                    <PiClockAfternoon className="size-6" />
                  </span>
                  {t('activity-timeline.afternoon')}
                </h6>
                <AIResponse>{itineraryDay.afternoon}</AIResponse>
              </div>
              <div className="w-full">
                <h6 className="text-lg font-semibold inline-flex items-center gap-2">
                  <span>
                    <IoMoonOutline className="size-6" />
                  </span>
                  {t('activity-timeline.evening')}
                </h6>
                <AIResponse>{itineraryDay.evening}</AIResponse>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="w-full">
                <h6 className="text-lg font-semibold inline-flex items-center gap-2">
                  <span>
                    <IoIosRestaurant className="size-6" />
                  </span>
                  {t('aditional-details.meals')}
                </h6>
                <ul className="flex flex-col gap-2">
                  {itineraryDay.meals.map((meal, index) => (
                    <li key={index}>
                      <AIResponse>{meal}</AIResponse>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="w-full">
                <h6 className="text-lg font-semibold inline-flex items-center gap-2">
                  <span>
                    <PiCarProfile className="size-6" />
                  </span>
                  {t('aditional-details.transportation')}
                </h6>
                <AIResponse>{itineraryDay.transportation}</AIResponse>
              </div>
            </div>

            <h6 className="text-lg font-semibold">Recommended Attractions</h6>
            <Swiper
              className="w-full"
              modules={[Navigation, Pagination, Scrollbar, A11y]}
              spaceBetween={10}
              slidesPerView={2}
              pagination={{ clickable: true }}
              scrollbar={{ draggable: true }}
            >
              {itineraryDay.attraction_recommendations?.map((attraction) => (
                <SwiperSlide key={attraction.place_id} className="md:basis-1/2">
                  <PlaceCard placeId={attraction.place_id} />
                </SwiperSlide>
              ))}
            </Swiper>

            <h6 className="text-lg font-semibold">Recommended Restaurants</h6>
            <Swiper
              className="w-full"
              modules={[Navigation, Pagination, Scrollbar, A11y]}
              spaceBetween={10}
              slidesPerView={2}
              pagination={{ clickable: true }}
              scrollbar={{ draggable: true }}
            >
              {itineraryDay.restaurant_recommendations?.map((restaurant) => (
                <SwiperSlide key={restaurant.place_id}>
                  <PlaceCard placeId={restaurant.place_id} />
                </SwiperSlide>
              ))}
            </Swiper>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default DailyItinerary
