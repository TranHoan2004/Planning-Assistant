import React from 'react'
import { Card, CardBody } from '@heroui/card'
import { Button } from '@heroui/button'
import { Image } from '@heroui/image'
import { PlaneIcon } from '@/assets/Icons'

interface FlightCardProps {
  airlineImage?: string
  departureTime?: string
  arrivalTime?: string
  departureLocation?: string
  arrivalLocation?: string
  departureCity?: string
  arrivalCity?: string
  duration?: string
  flightType?: string
  airline?: string
  flightNumber?: string
  ticketClass?: string
  price?: string
  currency?: string
  className?: string
}

export default function FlightCard({
  airlineImage = 'https://quatangphuongtrinh.com/public/uploads/images/bai-viet/Bo-nhan-dien-thuong-hieu-cua-vietnam-airlines-niem-tu-hao-cua-quoc-gia/slogan-cua-vietnam-airlines.jpg',
  departureTime = '11:00',
  arrivalTime = '18:00',
  departureLocation = 'Sân bay Nội Bài',
  arrivalLocation = 'Sân bay Nội Bài',
  departureCity = 'Thành phố Hà Nội',
  arrivalCity = 'Thành phố Hà Nội',
  duration = '8h 30m',
  flightType = 'Chiều đi',
  airline = 'Vietnam Airline',
  flightNumber = 'DL123',
  ticketClass = 'Vé thương gia',
  price = '1,100,550',
  currency = 'đ',
  className = ''
}: FlightCardProps) {
  return (
    <div className={`w-full max-w-4xl p-4 ${className}`}>
      <div className="p-0">
        <div className="flex items-end justify-between mx-3">
          {/* Airline Image */}
          <div className="flex-shrink-0">
            <div className="w-20 h-16 rounded-lg overflow-hidden bg-gray-100">
              <Image
                src={airlineImage}
                alt={airline}
                width={80}
                height={64}
                className="object-cover w-full h-full"
                removeWrapper
              />
            </div>
          </div>

          {/* Flight Times and Locations */}
          <div className="flex-1 grid grid-cols-3 gap-4 items-center">
            {/* Departure */}
            <div className=" text-center">
              <div className="text-[28px] font-bold">
                {departureTime}
              </div>
              <div className="text-sm text-gray-600 mb-0.5">
                {departureLocation}
              </div>
              <div className="text-sm text-gray-500">
                {departureCity}
              </div>
            </div>

            {/* Flight Duration and Icon */}
            <div className="text-center">
              <div className="text-sm text-gray-500 mb-4">
                {duration}
              </div>
              <div className="relative flex items-center justify-center mb-4">
                <div className="w-full h-px bg-gray-300"></div>
                <div className="absolute bg-white px-2">
                  <div className="w-6 h-6">
                    <PlaneIcon />
                  </div>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                {flightType}
              </div>
            </div>

            {/* Arrival */}
            <div className="text-center">
              <div className="text-[28px] font-bold">
                {arrivalTime}
              </div>
              <div className="text-sm text-gray-600 mb-0.5">
                {arrivalLocation}
              </div>
              <div className="text-sm text-gray-500">
                {arrivalCity}
              </div>
            </div>
          </div>

          {/* Price and Button */}
          <div className="flex-shrink-0 text-center">
            <div className="text-2xl font-bold mb-3">
              {price}{currency}
            </div>
            <Button 
              className="bg-black text-white px-8 py-2 rounded-lg font-medium w-36 h-9"
              size="lg"
            >
              Chi tiết
            </Button>
          </div>
        </div>

        {/* Flight Details */}
        <div className="pt-3 px-21">
          <div className="text-sm font-semibold">
            <span className="">{airline}</span>
            <span className="mx-2">/</span>
            <span>{flightNumber}</span>
            <span className="mx-2">/</span>
            <span>{ticketClass}</span>
          </div>
        </div>
      </div>
    </div>
  )
}