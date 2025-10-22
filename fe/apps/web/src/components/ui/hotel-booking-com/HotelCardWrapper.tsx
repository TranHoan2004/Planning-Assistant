import { useHotelDetails, useHotelPhotos } from '@/hooks/useHotelDetail'
import { Card, Skeleton, Chip } from '@heroui/react'
import React from 'react'
import HotelCard from '../HotelCard'
import { ImageItem } from '@/types/hotels.type'

interface HotelCardProps {
  hotelId: string
}

const HotelCardWrapper = ({ hotelId }: HotelCardProps) => {
  const {
    hotelDetails,
    isPending: hotelIsPending,
    error: hotelError
  } = useHotelDetails(hotelId)
  const {
    hotelPhotosResponse,
    isPending: photoIsPending,
    error: photoError
  } = useHotelPhotos(hotelId)

  if (hotelIsPending)
    return (
      <Card className="w-[300px] space-y-5 p-4" radius="lg">
        <Skeleton className="rounded-lg">
          <div className="h-24 rounded-lg bg-default-300" />
        </Skeleton>
        <div className="space-y-3">
          <Skeleton className="w-3/5 rounded-lg">
            <div className="h-3 w-3/5 rounded-lg bg-default-200" />
          </Skeleton>
          <Skeleton className="w-4/5 rounded-lg">
            <div className="h-3 w-4/5 rounded-lg bg-default-200" />
          </Skeleton>
          <Skeleton className="w-2/5 rounded-lg">
            <div className="h-3 w-2/5 rounded-lg bg-default-300" />
          </Skeleton>
        </div>
      </Card>
    )

  if (hotelError || photoError)
    return (
      <p className="text-red-500 font-medium">
        {hotelError?.message} {photoError?.message}
      </p>
    )

  const hotel = hotelDetails.data

  const hotelPhotos = hotelPhotosResponse?.data ?? []
  const imageItems: ImageItem[] = hotelPhotos.slice(0, 10).map((photo) => ({
    original_image: photo.url
  }))

  return (
    <HotelCard
      images={imageItems || []}
      title={hotel.hotel_name}
      content={hotel.facilities_block?.facilities
        .map((faci) => `${faci.name}`)
        .join(', ')}
      price={
        hotel.product_price_breakdown &&
        hotel.product_price_breakdown.gross_amount_per_night &&
        hotel.product_price_breakdown.gross_amount_per_night.amount_rounded
          ? `${hotel.product_price_breakdown.gross_amount_per_night.amount_rounded}`
          : 'N/A'
      }
      rating={hotel.rawData.reviewScore}
      reviewCount={hotel.rawData.reviewCount}
      currency={
        hotel.product_price_breakdown &&
        hotel.product_price_breakdown.gross_amount_per_night &&
        hotel.product_price_breakdown.gross_amount_per_night.currency
          ? `${hotel.product_price_breakdown.gross_amount_per_night.currency}`
          : 'N/A'
      }
      href={hotel.url || '#'}
      isLiked={true}
      // onHeartClick={() => handleHeartClick(index)}
      // onImageClick={(imageUrl, imageIndex) =>
      //   handleImageClick(imageUrl, imageIndex, hotel.name)
      // }
    />
  )
}

export default HotelCardWrapper
