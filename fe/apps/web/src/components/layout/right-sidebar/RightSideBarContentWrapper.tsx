'use client'

import { RootState } from '@/state/store'
import React from 'react'
import { format } from 'date-fns'
import { useSelector } from 'react-redux'
import HotelGrid from '@/components/ui/HotelGrid'
import { useChatContext } from '@/contexts/chat-context'
import ItineraryDetailView from '@/components/itinerary/ItinenaryDetailView'
import FlightCard from '@/components/ui/FlightCard'
import MapSection from '@/app/chat/components/MapSection'
import { ScrollShadow } from '@heroui/react'

const RightSideBarContentWrapper = () => {
  const activeRightSideBarItem = useSelector(
    (state: RootState) => state.rightsidebar.activeRightBarItem
  )
  const { itinerary } = useChatContext()

  return (
    <>
      {activeRightSideBarItem === 'Hotels' && (
        <ScrollShadow className="h-full" size={0}>
          <HotelGrid
            initialQuery="Nha Trang Hotels"
            checkInDate={format(new Date(), 'yyyy-MM-dd')}
            checkOutDate={'2025-10-20'}
            adults={2}
            children={0}
          />
        </ScrollShadow>
      )}

      {activeRightSideBarItem === 'Map' && (
        <div className="w-full h-[86vh] rounded-2xl overflow-hidden">
          <MapSection />
        </div>
      )}

      {activeRightSideBarItem === 'Itineraries' && (
        <div className="pb-20">
          {itinerary ? (
            <ItineraryDetailView data={itinerary} />
          ) : (
            <p>Bắt đầu chat với Plango để lên kế hoạch ngay!</p>
          )}
        </div>
      )}

      {activeRightSideBarItem === 'Flights' && (
        <>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-black mb-4">
              Chuyến bay vào ngày 12/06 đến Nha Trang
            </h2>
            <button className="text-sm text-gray-600 cursor-pointer">
              See all
            </button>
          </div>
          <div className="flex flex-col gap-4">
            <FlightCard
              departureTime="11:00"
              arrivalTime="18:00"
              departureLocation="Sân bay Nội Bài"
              arrivalLocation="Sân bay Cam Ranh"
              departureCity="Thành phố Hà Nội"
              arrivalCity="Thành phố Nha Trang"
              duration="2h 30m"
              flightType="Chiều đi"
              airline="Vietnam Airline"
              flightNumber="VN123"
              ticketClass="Vé thương gia"
              price="2,100,550"
              currency="₫"
            />
          </div>
        </>
      )}
    </>
  )
}

export default RightSideBarContentWrapper
