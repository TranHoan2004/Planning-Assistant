'use client'

import { AdvancedMarker, useAdvancedMarkerRef } from '@vis.gl/react-google-maps'
import { useState } from 'react'
import { PlaceDetailsResponse } from '@/types/places.type'
import {
  Card,
  CardBody,
  CardHeader,
  Chip,
  Divider,
  Image,
  Link
} from '@heroui/react'
import { CiClock1, CiGlobe, CiMapPin, CiPhone, CiStar } from 'react-icons/ci'
import { FaDollarSign } from 'react-icons/fa'
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselDot,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel'

interface PlaceMarkerProps {
  position: { lat: number; lng: number }
  placeData: PlaceDetailsResponse
  dayNumber?: number // Số thứ tự ngày
}

const PlaceMarker = ({ position, placeData, dayNumber }: PlaceMarkerProps) => {
  const [markerRef] = useAdvancedMarkerRef()
  const [isHovered, setIsHovered] = useState(false)

  const getPriceLevelText = (priceLevel?: string | null) => {
    if (!priceLevel) return null
    const levels: Record<string, string> = {
      PRICE_LEVEL_FREE: 'Miễn phí',
      PRICE_LEVEL_INEXPENSIVE: '$',
      PRICE_LEVEL_MODERATE: '$$',
      PRICE_LEVEL_EXPENSIVE: '$$$',
      PRICE_LEVEL_VERY_EXPENSIVE: '$$$$'
    }
    return levels[priceLevel] || priceLevel
  }

  const getBusinessStatusText = (status?: string | null) => {
    if (!status) return null
    const statuses: Record<
      string,
      { text: string; color: 'success' | 'warning' | 'danger' }
    > = {
      OPERATIONAL: { text: 'Đang hoạt động', color: 'success' },
      CLOSED_TEMPORARILY: { text: 'Tạm đóng cửa', color: 'warning' },
      CLOSED_PERMANENTLY: { text: 'Đã đóng cửa', color: 'danger' }
    }
    return statuses[status] || { text: status, color: 'warning' as const }
  }

  return (
    <AdvancedMarker
      ref={markerRef}
      position={{ lat: position.lat, lng: position.lng }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative cursor-pointer">
        {/* Nhãn "Ngày X" phía trên marker */}
        {dayNumber && (
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 bg-white px-2 py-1 rounded shadow-md border border-gray-200 whitespace-nowrap z-10">
            <span className="text-xs font-semibold text-gray-700">
              Ngày {dayNumber}
            </span>
          </div>
        )}

        {/* Marker pin */}
        <div className="bg-red-500 hover:bg-red-600 transition-colors rounded-full p-2 shadow-lg">
          <CiMapPin className="w-6 h-6 text-white" fill="white" />
        </div>

        {/* Popup card khi hover */}
        {isHovered && (
          <div
            className="absolute z-50 pointer-events-none"
            style={{
              bottom: 'calc(100% + 12px)',
              left: '50%',
              transform: 'translateX(-50%)',
              willChange: 'transform'
            }}
          >
            <Card className="w-[400px] max-h-[600px] overflow-y-auto pointer-events-auto shadow-2xl">
              <CardHeader className="flex flex-col items-start gap-2 pb-3">
                <div className="flex justify-between items-start w-full gap-2">
                  <h3 className="text-xl font-bold flex-1">
                    {placeData.displayName?.text || 'Địa điểm'}
                  </h3>
                  {placeData.rating && (
                    <Chip
                      startContent={
                        <CiStar className="w-4 h-4" fill="currentColor" />
                      }
                      color="warning"
                      variant="flat"
                      size="sm"
                    >
                      {placeData.rating}{' '}
                      {placeData.userRatingCount &&
                        `(${placeData.userRatingCount.toLocaleString()})`}
                    </Chip>
                  )}
                </div>

                {placeData.types && placeData.types.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {placeData.types.slice(0, 3).map((type, idx) => (
                      <Chip key={idx} size="sm" variant="flat" color="default">
                        {type.replace(/_/g, ' ')}
                      </Chip>
                    ))}
                  </div>
                )}
              </CardHeader>

              <Divider />

              <CardBody className="gap-3 py-4">
                {placeData.formattedAddress && (
                  <div className="flex gap-2">
                    <CiMapPin className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm">{placeData.formattedAddress}</p>
                  </div>
                )}

                {placeData.plusCode?.globalCode && (
                  <div className="flex gap-2 items-center">
                    <span className="text-xs text-gray-500">Plus Code:</span>
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {placeData.plusCode.globalCode}
                    </code>
                  </div>
                )}

                {placeData.businessStatus && (
                  <div className="flex gap-2 items-center">
                    {(() => {
                      const status = getBusinessStatusText(
                        placeData.businessStatus
                      )
                      return status ? (
                        <Chip size="sm" color={status.color} variant="flat">
                          {status.text}
                        </Chip>
                      ) : null
                    })()}
                  </div>
                )}

                {placeData.priceLevel && (
                  <div className="flex gap-2 items-center">
                    <FaDollarSign className="w-5 h-5 text-gray-500" />
                    <span className="text-sm">
                      {getPriceLevelText(placeData.priceLevel)}
                    </span>
                  </div>
                )}

                {placeData.openingHours?.weekdayDescriptions && (
                  <div className="flex gap-2">
                    <CiClock1 className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold mb-1">Giờ mở cửa:</p>
                      <div className="text-xs space-y-0.5">
                        {placeData.openingHours.weekdayDescriptions.map(
                          (day, idx) => (
                            <p key={idx} className="text-gray-600">
                              {day}
                            </p>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <Divider />

                {(placeData.internationalPhoneNumber ||
                  placeData.nationalPhoneNumber) && (
                  <div className="flex gap-2 items-center">
                    <CiPhone className="w-5 h-5 text-gray-500" />
                    <Link
                      href={`tel:${placeData.internationalPhoneNumber || placeData.nationalPhoneNumber}`}
                      className="text-sm"
                    >
                      {placeData.internationalPhoneNumber ||
                        placeData.nationalPhoneNumber}
                    </Link>
                  </div>
                )}

                {placeData.websiteUri && (
                  <div className="flex gap-2 items-center">
                    <CiGlobe className="w-5 h-5 text-gray-500" />
                    <Link
                      href={placeData.websiteUri}
                      target="_blank"
                      className="text-sm truncate"
                      showAnchorIcon
                    >
                      Website
                    </Link>
                  </div>
                )}

                {placeData.googleMapsUri && (
                  <Link
                    href={placeData.googleMapsUri}
                    target="_blank"
                    className="text-sm text-blue-600"
                    showAnchorIcon
                  >
                    Xem trên Google Maps
                  </Link>
                )}

                {placeData.location && (
                  <div className="text-xs text-gray-500 mt-2">
                    <p>Lat: {placeData.location.latitude?.toFixed(6)}</p>
                    <p>Lng: {placeData.location.longitude?.toFixed(6)}</p>
                  </div>
                )}

                {placeData.reviews && placeData.reviews.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm font-semibold mb-2">Đánh giá:</p>
                    <div className="space-y-2 max-h-[200px] overflow-y-auto">
                      {placeData.reviews.slice(0, 3).map((review, idx) => (
                        <div
                          key={idx}
                          className="text-xs bg-gray-50 p-2 rounded"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold">
                              {review.authorAttribution?.displayName}
                            </span>
                            {review.rating && (
                              <span className="flex items-center gap-1 text-yellow-600">
                                <CiStar
                                  className="w-3 h-3"
                                  fill="currentColor"
                                />
                                {review.rating}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {placeData.photos && placeData.photos.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-500 mb-2">
                      {placeData.photos.length} ảnh
                    </p>
                    <Carousel opts={{ loop: true }} className="w-full">
                      <CarouselContent>
                        {placeData?.photos?.map((photo, index) => (
                          <CarouselItem key={index}>
                            <div className="relative h-96 w-full rounded-xl overflow-hidden">
                              <Image
                                alt={placeData?.displayName?.text || ''}
                                src={
                                  photo.getURI({
                                    maxWidth: 800,
                                    maxHeight: 800
                                  }) || ''
                                }
                                className="w-full h-full object-center object-cover"
                              />
                            </div>
                          </CarouselItem>
                        ))}
                      </CarouselContent>

                      <CarouselPrevious />
                      <CarouselNext />
                    </Carousel>
                  </div>
                )}
              </CardBody>
            </Card>
          </div>
        )}
      </div>
    </AdvancedMarker>
  )
}

export default PlaceMarker
