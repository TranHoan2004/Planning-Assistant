'use client'

import React, { useState } from 'react'
import { Image } from '@heroui/image'
import { HeartFilledIcon, RateStarIcon } from '@/assets/Icons'
import { ImageItem } from '@/types/hotels.type'
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa6'

interface HotelCardProps {
  images?: ImageItem[]
  image?: string
  title?: string
  content?: string
  price?: string
  currency?: string
  rating?: number
  reviewCount?: number
  href?: string
  className?: string
  imageClassName?: string
  isLoveHotels?: boolean
  hotelClass?: string
  onImageClick?: (imageUrl: string, index: number) => void
  onHeartClick?: () => void
  isLiked?: boolean
}

export default function HotelCard({
  images = [],
  image = '',
  title = '',
  content = '',
  price = '',
  currency = 'VND',
  rating,
  reviewCount,
  href = '#',
  className = '',
  imageClassName = '',
  isLoveHotels = true,
  hotelClass,
  onImageClick,
  onHeartClick,
  isLiked = false
}: HotelCardProps) {
  const extractImageUrl = (imageItem: ImageItem): string => {
    return imageItem.original_image || imageItem.thumbnail || ''
  }

  const imageUrls =
    images && images.length > 0
      ? images.map(extractImageUrl).filter((url) => url) // Remove empty URLs
      : image
        ? [image]
        : []
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [imageLoadError, setImageLoadError] = useState<{
    [key: number]: boolean
  }>({})

  const handlePrevImage = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentImageIndex((prev) =>
      prev === 0 ? imageUrls.length - 1 : prev - 1
    )
  }

  const handleNextImage = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentImageIndex((prev) =>
      prev === imageUrls.length - 1 ? 0 : prev + 1
    )
  }

  const handleDotClick = (index: number, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentImageIndex(index)
  }

  const handleHeartClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onHeartClick?.()
  }

  const handleImageError = (index: number) => {
    setImageLoadError((prev) => ({ ...prev, [index]: true }))
  }

  const formatPrice = (priceStr: string) => {
    if (!priceStr) return ''

    const numericPrice = priceStr.replace(/[^\d]/g, '')
    if (!numericPrice) return priceStr

    const formatted = parseInt(numericPrice).toLocaleString('vi-VN')

    const currencySymbol = currency === 'VND' ? '₫' : currency
    return `${formatted}${currencySymbol}`
  }

  const formatRating = (rating?: number) => {
    if (!rating) return '4.5' // fallback
    return rating.toFixed(1)
  }

  const formatReviewCount = (count?: number) => {
    if (!count) return '4k'

    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`
    }
    return count.toString()
  }

  const currentImage = imageUrls[currentImageIndex]
  const hasMultipleImages = imageUrls.length > 1

  return (
    <div className={`relative w-full h-full ${className}`}>
      <div className="relative w-full group">
        {/* Main Image */}
        {currentImage ? (
          <Image
            width={270}
            height={256}
            src={currentImage}
            alt={title}
            className={`w-full object-cover object-center ${imageClassName}`}
            removeWrapper
            // onError={() => handleImageError(currentImageIndex)}
            onClick={() => onImageClick?.(currentImage, currentImageIndex)}
          />
        ) : (
          // Fallback placeholder
          <div className="w-[270px] h-[256px] bg-gray-200 flex items-center justify-center rounded-lg">
            <div className="text-gray-400 text-center">
              <svg
                className="w-12 h-12 mx-auto mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="text-sm">No image</p>
            </div>
          </div>
        )}

        {/* Heart Icon - positioned at top-right of image - only visible on hover */}
        <div
          className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
          onClick={handleHeartClick}
        >
          {isLoveHotels ? (
            <HeartFilledIcon
              className={`${isLiked ? 'text-[#DD0022]' : 'text-[#DD0022]'} drop-shadow-md hover:scale-110 transition-transform`}
            />
          ) : (
            <HeartFilledIcon
              className={`${isLiked ? 'text-[#DD0022]' : 'text-white'} drop-shadow-md hover:scale-110 transition-transform`}
            />
          )}
        </div>

        {/* Hotel Class Badge */}
        {hotelClass && (
          <div className="absolute top-3 left-3 z-10">
            <div className="bg-black bg-opacity-70 text-white px-2 py-1 rounded-full text-xs font-semibold">
              {hotelClass}
            </div>
          </div>
        )}

        {/* Image Navigation - Only show if multiple images */}
        {hasMultipleImages && (
          <>
            {/* Previous Button */}
            <button
              onClick={handlePrevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              aria-label="Previous image"
            >
              <FaAngleLeft />
            </button>

            {/* Next Button */}
            <button
              onClick={handleNextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              aria-label="Next image"
            >
              <FaAngleRight />
            </button>

            {/* Dot Indicators */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              {imageUrls.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => handleDotClick(index, e)}
                  className={`w-1 h-1 rounded-full transition-all duration-200 ${
                    index === currentImageIndex
                      ? 'bg-white scale-125'
                      : 'bg-white bg-opacity-50 hover:bg-opacity-80'
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>

            {/* Image Counter */}
            <div className="absolute bottom-3 right-3 z-20 bg-black bg-opacity-70 text-white px-2 py-1 rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              {currentImageIndex + 1} / {imageUrls.length}
            </div>
          </>
        )}
      </div>

      {/* Content - Keep exact layout from old file */}
      <div className="w-full pt-3">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-base font-semibold leading-tight mb-1 flex-1">
            {title}
          </h3>
          <div className="flex items-center gap-1 ml-2">
            <RateStarIcon />
            <span className="text-sm font-medium">
              {formatRating(rating)}
              <span className="text-gray-400 font-normal">
                ({formatReviewCount(reviewCount)})
              </span>
            </span>
          </div>
        </div>

        {content && (
          <p className="text-sm line-clamp-2 mb-1 font-medium text-[#00000080]">
            {content}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-3 text-sm">
          {price && (
            <p className="inline-block text-gray-400">
              <span className="font-semibold text-black">
                {formatPrice(price)}
              </span>{' '}
              ngày
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
