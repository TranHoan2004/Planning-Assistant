import { usePlaceDetails } from '@/hooks/usePlaceDetails'
import { Card, CardBody, CardHeader } from '@heroui/card'
import React from 'react'
import { LuStar } from 'react-icons/lu'
import { A11y, Navigation, Scrollbar, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import GooglePlaceImage from './GooglePlaceImage'

interface PlaceCardProps {
  placeId: string
}

const PlaceCard = ({ placeId }: PlaceCardProps) => {
  const { placeDetails, error, isPending } = usePlaceDetails(placeId)

  if (isPending) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <Card className="border border-neutral-300/50 shadow rounded-2xl">
      {/* <CardHeader>
        <Swiper
          className="w-full"
          modules={[Navigation, Pagination, Scrollbar, A11y]}
          slidesPerView={1}
          spaceBetween={10}
          navigation
          pagination={{ clickable: true }}
          scrollbar={{ draggable: true }}
        >
          {placeDetails?.photos?.map((photo) => (
            <SwiperSlide key={photo.name}>
              <GooglePlaceImage
                photoName={photo.name}
                maxWidth={400}
                maxHeight={300}
                className="w-full h-auto object-cover"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </CardHeader> */}
      <CardBody className="p-4">
        <div className="w-full flex items-center justify-between">
          <p className="font-semibold">{placeDetails?.displayName?.text}</p>
          <div className="inline-flex gap-2 items-center">
            <LuStar size={16} className="text-yellow-400 fill-yellow-400" />
            <span className="text-sm">{placeDetails?.rating}</span>
          </div>
        </div>
        <div className="mt-3">
          <p className="text-sm text-neutral-500">
            {placeDetails?.formattedAddress}
          </p>
        </div>
      </CardBody>
    </Card>
  )
}

export default PlaceCard
