import { Image } from '@heroui/image'
import React from 'react'
import { usePlacePhoto } from '@/hooks/usePlaceDetails'
import { cn } from '@repo/utils/tailwind-utils'

interface GooglePlaceImageProps {
  photoName: string
  maxWidth?: number
  maxHeight?: number
  className?: string
}

const GooglePlaceImage = ({
  photoName,
  maxWidth,
  maxHeight,
  className
}: GooglePlaceImageProps) => {
  const { placePhoto, isPending } = usePlacePhoto(
    photoName,
    maxWidth,
    maxHeight
  )

  if (isPending) return <div>Loading...</div>

  return (
    <Image
      src={placePhoto?.photoUri}
      alt={photoName}
      width={maxWidth}
      height={maxHeight}
      classNames={{
        img: cn('w-full h-auto object-cover', className)
      }}
    />
  )
}

export default GooglePlaceImage
