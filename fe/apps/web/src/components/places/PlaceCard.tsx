'use client'

import { usePlaceDetail } from '@/hooks/useGooglePlacesApi'
import React, { memo } from 'react'
import { LuStar } from 'react-icons/lu'
import Image from 'next/image'
import { Card, CardBody, CardFooter, CardHeader } from '@heroui/card'
import { Button } from '@heroui/button'
import { Link } from '@heroui/link'
import { FaExternalLinkAlt } from 'react-icons/fa'
import { useDisclosure } from '@heroui/modal'
import PlaceModal from './PlaceModal'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '../ui/carousel'

interface PlaceCardProps {
  placeId: string
}

const PlaceCard = ({ placeId }: PlaceCardProps) => {
  const { onOpen, onOpenChange, isOpen } = useDisclosure()
  const placeDetails = usePlaceDetail(placeId)

  return (
    <>
      <Card className="border border-neutral-300/50 shadow rounded-2xl cursor-pointer">
        <CardHeader className="p-0">
          <Carousel opts={{ loop: true }} className="w-full">
            <CarouselContent>
              {placeDetails?.photos?.map((photo, index) => (
                <CarouselItem key={index}>
                  <div className="relative h-52 w-full">
                    <Image
                      alt={placeDetails?.displayName?.text || ''}
                      src={
                        photo.getURI({ maxWidth: 400, maxHeight: 400 }) || ''
                      }
                      fill={true}
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="w-full h-auto object-center object-cover"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </CardHeader>
        <CardBody className="p-4" onClick={onOpen}>
          <div className="w-full flex items-center justify-between">
            <p className="font-semibold text-ellipsis line-clamp-1">
              {placeDetails?.displayName?.text}
            </p>
            <div className="inline-flex gap-2 items-center">
              <LuStar size={16} className="text-yellow-400 fill-yellow-400" />
              <span className="text-sm">{placeDetails?.rating}</span>
              <span>({placeDetails?.userRatingCount})</span>
            </div>
          </div>
          <div className="mt-3">
            <p className="text-sm text-neutral-500 text-ellipsis line-clamp-1">
              {placeDetails?.formattedAddress}
            </p>
          </div>
        </CardBody>
        <CardFooter onClick={onOpen}>
          <Button
            as={Link}
            href={placeDetails?.googleMapsUri || ''}
            target="_blank"
            className="bg-foreground text-background"
            radius="full"
            endContent={<FaExternalLinkAlt className="size-4" />}
          >
            Maps
          </Button>
        </CardFooter>
      </Card>
      <PlaceModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placeDetails={placeDetails}
      />
    </>
  )
}

export default memo(PlaceCard)
