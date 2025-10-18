'use client'

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter
} from '@heroui/modal'
import { Button } from '@heroui/button'
import { Link } from '@heroui/link'
import { memo, useEffect, useState } from 'react'
import { PlaceDetailsResponse } from '@/types/places.type'
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselDot,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '../ui/carousel'
import Image from 'next/image'
import { LuStar } from 'react-icons/lu'
import ParkIcon from '@/assets/ParkIcon'
import { IoIosRestaurant } from 'react-icons/io'
import { MdOutlineEmojiFoodBeverage } from 'react-icons/md'
import AttractionsIcon from '@/assets/AttractionsIcon'
import { FaExternalLinkAlt } from 'react-icons/fa'
import { FaChevronDown, FaChevronUp, FaRegClock } from 'react-icons/fa6'

interface PlaceModalProps {
  isOpen: boolean
  onOpenChange: () => void
  placeDetails?: PlaceDetailsResponse | null
}

const PlaceModal = ({
  isOpen,
  onOpenChange,
  placeDetails
}: PlaceModalProps) => {
  const [api, setApi] = useState<CarouselApi>()

  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)
  const [openOpeningHours, setOpenOpeningHours] = useState(false)

  useEffect(() => {
    if (!api) return

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })
  }, [api])

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      scrollBehavior="inside"
      size="3xl"
      classNames={{
        closeButton: 'hidden'
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="p-6 relative pb-0">
              <Carousel
                opts={{ loop: true }}
                className="w-full relative"
                setApi={setApi}
              >
                <CarouselContent>
                  {placeDetails?.photos?.map((photo, index) => (
                    <CarouselItem key={index}>
                      <div className="relative h-96 w-full rounded-xl overflow-hidden">
                        <Image
                          alt={placeDetails?.displayName?.text || ''}
                          src={
                            photo.getURI({ maxWidth: 800, maxHeight: 800 }) ||
                            ''
                          }
                          fill={true}
                          sizes="(max-width: 768px) 100vw, 80vw"
                          className="w-full h-auto object-center object-cover"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="flex justify-between items-center mt-3">
                  <div className="flex gap-2 items-center">
                    <CarouselPrevious className="relative bg-foreground top-0 left-0 translate-0" />
                    <CarouselNext className="relative bg-foreground top-0 right-0 translate-0" />
                  </div>
                  <div className="flex gap-2 items-center">
                    {Array.from(Array(count).keys()).map((_, index) => (
                      <CarouselDot
                        key={index}
                        selected={index === current - 1}
                        onClick={() => api?.scrollTo(index)}
                      />
                    ))}
                  </div>
                </div>
              </Carousel>
              <div className="absolute left-0 right-0 bottom-10 z-10 flex flex-col p-10">
                <h1 className="text-background font-bold text-5xl text-shadow-black text-shadow-lg mb-3">
                  {placeDetails?.displayName?.text}
                </h1>
                <p className="text-neutral-100 text-xl">
                  {placeDetails?.formattedAddress}
                </p>
              </div>
            </ModalHeader>
            <ModalBody>
              <div className="inline-flex gap-2 items-center">
                <LuStar size={28} className="text-yellow-400 fill-yellow-400" />
                <span className="text-lg font-semibold">
                  {placeDetails?.rating}
                </span>
                <span className="text-lg">
                  ({placeDetails?.userRatingCount})
                </span>
              </div>
              <div className="flex gap-3 items-center">
                {placeDetails?.types?.map((type, index) => {
                  switch (type) {
                    case 'park':
                      return <ParkIcon key={index} className="size-8" />
                    case 'restaurant':
                      return <IoIosRestaurant key={index} className="size-8" />
                    case 'food':
                      return (
                        <MdOutlineEmojiFoodBeverage
                          key={index}
                          className="size-8"
                        />
                      )
                    case 'attraction':
                      return <AttractionsIcon key={index} className="size-8" />
                    default:
                      return null
                  }
                })}
              </div>

              <div
                className="text-xl font-bold cursor-pointer inline-flex items-center"
                role="button"
                onClick={() => setOpenOpeningHours(!openOpeningHours)}
              >
                <span className="mr-2">
                  <FaRegClock className="size-5" />
                </span>
                Opening Hours
                <span className="ml-2">
                  {openOpeningHours ? (
                    <FaChevronUp className="size-4" />
                  ) : (
                    <FaChevronDown className="size-4" />
                  )}
                </span>
              </div>
              {openOpeningHours && (
                <div className="ml-6 flex flex-col gap-2">
                  {placeDetails?.openingHours?.weekdayDescriptions?.map(
                    (desc, index) => (
                      <p key={index}>{desc}</p>
                    )
                  )}
                </div>
              )}

              <Link
                href={placeDetails?.googleMapsUri || ''}
                target="_blank"
                className="bg-foreground text-background w-fit inline-flex px-4 py-2 rounded-full items-center"
              >
                Maps
                <span className="ml-2">
                  <FaExternalLinkAlt className="size-4" />
                </span>
              </Link>
            </ModalBody>
            <ModalFooter>
              <Button
                onPress={onClose}
                className="bg-foreground text-background"
                radius="full"
              >
                Close
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}

export default memo(PlaceModal)
