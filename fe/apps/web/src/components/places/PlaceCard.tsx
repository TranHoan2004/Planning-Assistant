'use client'

import { usePlaceDetail } from '@/hooks/useGooglePlacesApi'
import React, { memo, useEffect } from 'react'
import { LuStar } from 'react-icons/lu'
import Image from 'next/image'
import { Card, CardBody, CardFooter, CardHeader } from '@heroui/card'
import { Button } from '@heroui/button'
import { Link } from '@heroui/link'
import { FaExternalLinkAlt } from 'react-icons/fa'
import { useDisclosure } from '@heroui/modal'
import PlaceModal from './PlaceModal'
import { Skeleton } from '@heroui/skeleton'
import { Spacer } from '@heroui/spacer'
import { useChatContext } from '@/contexts/chat-context'

interface PlaceCardProps {
  placeId: string
}

const PlaceCard = ({ placeId }: PlaceCardProps) => {
  const { onOpen, onOpenChange, isOpen } = useDisclosure()
  const { placesData, setPlacesData } = useChatContext()

  const placeFromContext = placesData.find((place) => place.id === placeId)
  const {
    placeDetails: fetchedPlaceDetails,
    isPending,
    isError
  } = usePlaceDetail(placeId, {
    enabled: !placeFromContext
  })

  useEffect(() => {
    if (fetchedPlaceDetails) {
      const inContext = placesData.find(
        (place) => place.id === fetchedPlaceDetails.id
      )
      if (!inContext) {
        setPlacesData((prevData) => [...prevData, fetchedPlaceDetails])
      }
    }
  }, [fetchedPlaceDetails, placesData, setPlacesData])

  const placeDetails = placeFromContext || fetchedPlaceDetails

  if (isPending) {
    return (
      <Card className="shadow-none rounded-2xl cursor-pointer">
        <Skeleton className="h-60 w-full rounded-lg" />
        <Spacer y={2} />
        <Skeleton className="h-6 w-full rounded-full" />
        <Spacer y={2} />
        <Skeleton className="h-6 w-full rounded-full" />
      </Card>
    )
  }

  if (isError) {
    return (
      <Card className="shadow-none rounded-2xl cursor-pointer">
        <CardBody>
          <p className="text-center text-pink-600 font-semibold">
            Something went wrong
          </p>
        </CardBody>
      </Card>
    )
  }

  return (
    <>
      <Card className="shadow-none rounded-2xl cursor-pointer">
        {/* <CardHeader className="p-0">
          <div className="relative h-64 w-full">
            <Image
              alt={placeDetails?.displayName?.text || ''}
              src={
                placeDetails?.photos?.[0]?.getURI({
                  maxWidth: 400,
                  maxHeight: 400
                }) || ''
              }
              fill={true}
              sizes="(max-width: 768px) 100vw, 33vw"
              className="w-full h-auto object-center object-cover rounded-2xl"
            />
          </div>
        </CardHeader> */}
        <CardBody className="p-0 mt-2" onClick={onOpen}>
          <div className="w-full flex items-center justify-between">
            <p className="font-semibold text-ellipsis line-clamp-1">
              {placeDetails?.displayName?.text}
            </p>
          </div>
          <div className="mt-3">
            <p className="text-sm text-neutral-500 text-ellipsis line-clamp-1">
              {placeDetails?.formattedAddress}
            </p>
          </div>
        </CardBody>
        <CardFooter onClick={onOpen} className="p-0 mt-2">
          <Button
            size="sm"
            as={Link}
            href={placeDetails?.googleMapsUri || ''}
            target="_blank"
            className="bg-foreground text-background"
            radius="full"
            endContent={<FaExternalLinkAlt className="size-3" />}
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
