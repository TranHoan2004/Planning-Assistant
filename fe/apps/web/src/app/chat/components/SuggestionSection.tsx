'use client'

import FlightCard from '@/components/ui/FlightCard'
import HotelGrid from '@/components/ui/HotelGrid'
import ItineraryDetailView from './ItinenaryDetailView'
import { useChatContext } from '@/contexts/chat-context'

const SuggestionSection = () => {
  const { itinerary } = useChatContext()
  return (
    <div className="p-4 rounded-2xl shadow-lg max-w-4xl mx-auto">
      {itinerary ? (
        <ItineraryDetailView data={itinerary} />
      ) : (
        <div className="flex flex-1 flex-col gap-7">
          {/* Hotels Section */}
          <div>
            <HotelGrid
              initialQuery="Nha Trang Hotels"
              checkInDate="2025-09-28"
              checkOutDate="2025-09-29"
              adults={2}
              children={0}
            />
          </div>

          {/* Flights Section remains the same */}
          <div>
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
          </div>

          <div>
            <h2 className="text-xl font-bold text-black mb-4">
              Sự kiện sắp diễn ra tại Nha Trang
            </h2>
          </div>
        </div>
      )}
    </div>
  )
}

export default SuggestionSection
