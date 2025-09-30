'use client'

import { useState, useCallback, useEffect } from 'react'
import { useHotelSearch } from '@/hooks/useHotelSearch'
import HotelCard from '@/components/ui/HotelCard'
import { Property } from '@/types/hotels.type'
import { HotelsHouseIcon } from '@/assets/Icons'
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@heroui/react';


interface HotelGridProps {
  initialQuery?: string
  checkInDate?: string
  checkOutDate?: string
  adults?: number
  children?: number
  className?: string
}

export default function HotelGrid({
  initialQuery = 'Nha Trang Resorts',
  checkInDate = '2025-09-28',
  checkOutDate = '2025-09-29',
  adults = 2,
  children = 0,
  className = ''
}: HotelGridProps) {
  const { hotels, loading, error, searchHotels, loadMore, nextPageToken } =
    useHotelSearch()
  const [likedHotels, setLikedHotels] = useState<Set<number>>(new Set())
  const [selectedImage, setSelectedImage] = useState<{
    url: string
    hotelName: string
  } | null>(null)

  // Initialize search on component mount
  useEffect(() => {
    handleSearch()
  }, [])

  const handleSearch = useCallback(() => {
    searchHotels({
      q: initialQuery,
      check_in_date: checkInDate,
      check_out_date: checkOutDate,
      adults,
      children,
      currency: 'VND',
      gl: 'vn',
      hl: 'vi',
      engine: 'google_hotels',
      rating: 8, // 4.0+ rating
      sort_by: 3 // Lowest price
    })
  }, [initialQuery, checkInDate, checkOutDate, adults, children, searchHotels])

  const handleHeartClick = useCallback((hotelId: number) => {
    setLikedHotels((prev) => {
      const newLiked = new Set(prev)
      if (newLiked.has(hotelId)) {
        newLiked.delete(hotelId)
      } else {
        newLiked.add(hotelId)
      }
      return newLiked
    })
  }, [])

  const handleImageClick = useCallback(
    (imageUrl: string, index: number, hotelName: string) => {
      setSelectedImage({ url: imageUrl, hotelName })
    },
    []
  )

  const closeImageModal = () => {
    setSelectedImage(null)
  }

  if (loading && hotels.length === 0) {
    return (
      <div className={`${className}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-gray-200 w-full h-64 rounded-lg mb-3"></div>
              <div className="space-y-2">
                <div className="bg-gray-200 h-4 rounded w-3/4"></div>
                <div className="bg-gray-200 h-3 rounded w-1/2"></div>
                <div className="bg-gray-200 h-3 rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`${className}`}>
        <div className="text-center py-12">
          <div className="text-red-600 mb-4">
            <svg
              className="w-16 h-16 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
            <h3 className="text-lg font-semibold mb-2">
              Lỗi tìm kiếm khách sạn
            </h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={handleSearch}
              className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Thử lại
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`${className}`}>
      {/* Results Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-2 items-center">
          <h2 className="text-xl font-bold text-black">
            Khách sạn tại{' '}
            {initialQuery.replace(/hotels?|resorts?/i, '').trim() ||
              'Nha Trang'}
          </h2>
          <HotelsHouseIcon />
        </div>
        <div>
                        <Dropdown>
                <DropdownTrigger>
                  <Button variant="bordered">Sắp xếp</Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="Sort options">
                  <DropdownItem key="price">Giá thấp nhất</DropdownItem>
                  <DropdownItem key="rating">Đánh giá cao nhất</DropdownItem>
                  <DropdownItem key="reviews">Nhiều đánh giá nhất</DropdownItem>
                </DropdownMenu>
              </Dropdown>
        </div>
      </div>

      {/* Hotel Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hotels.map((hotel: Property, index) => (
          <HotelCard
            key={index}
            images={hotel.images || []}
            title={hotel.name}
            content={hotel.amenities?.map((amenity) => `${amenity}`).join(', ')}
            price={hotel.rate_per_night?.lowest}
            currency="VND"
            rating={hotel.overall_rating}
            reviewCount={hotel.reviews}
            href={hotel.link || '#'}
            hotelClass={hotel.hotel_class}
            isLiked={likedHotels.has(index)}
            onHeartClick={() => handleHeartClick(index)}
            onImageClick={(imageUrl, imageIndex) =>
              handleImageClick(imageUrl, imageIndex, hotel.name)
            }
          />
        ))}
      </div>

      {/* Load More Button */}
      {nextPageToken && (
        <div className="mt-8 text-center">
          <Button
            onPress={loadMore}
            disabled={loading}
            className="px-8 py-3 bg-[#060304] font-semibold text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Đang tải...
              </span>
            ) : (
              'Xem thêm khách sạn'
            )}
          </Button>
        </div>
      )}

      {/* No Results */}
      {!loading && hotels.length === 0 && (
        <div className="text-center py-12">
          <svg
            className="w-16 h-16 mx-auto mb-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
          <h3 className="text-lg font-semibold mb-2">
            Không tìm thấy khách sạn
          </h3>
          <p className="text-gray-600 mb-4">
            Thử thay đổi điều kiện tìm kiếm của bạn
          </p>
          <button
            onClick={handleSearch}
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Tìm kiếm lại
          </button>
        </div>
      )}

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
          onClick={closeImageModal}
        >
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={closeImageModal}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <img
              src={selectedImage.url}
              alt={selectedImage.hotelName}
              className="max-w-full max-h-full object-contain"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
              <h3 className="text-white text-lg font-semibold">
                {selectedImage.hotelName}
              </h3>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
