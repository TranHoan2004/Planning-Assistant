import React, { useEffect, useState } from 'react'
import { Spinner } from '@heroui/react'
import EmptyState from './EmptyState'
import { clientApi } from '@/utils/client-api'
import { useTranslations } from 'next-intl'
import { Favourite } from '@/types/Favourite/favourite.type'
import HotelCardWrapper from '@/components/ui/hotel-booking-com/HotelCardWrapper'
import PlaceCard from '@/components/places/PlaceCard'

interface ProfileContentProps {
  activeTab: 'all' | 'hotels' | 'places'
  userId: string
}

export default function ProfileContent({
  activeTab,
  userId
}: ProfileContentProps) {
  const [data, setData] = useState<{
    hotels: Favourite[]
    places: Favourite[]
  }>({
    hotels: [],
    places: []
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const t = useTranslations('Profile')

  useEffect(() => {
    let isMounted = true

    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        const endpoints = {
          all: `/api/favourite/${userId}`,
          hotels: `/api/favourite/hotel/${userId}`,
          places: `/api/favourite/place/${userId}`
        }

        const response = await clientApi.get(endpoints[activeTab])
        const resData = response.data.data

        if (isMounted) {
          if (isMounted) {
            setData({
              hotels: resData.hotels ?? [],
              places: resData.places ?? []
            })
          }
        }
      } catch (err: any) {
        console.error('Failed to fetch data:', err)
        if (isMounted) setError(t('error.loadContentFailed'))
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchData()
    return () => {
      isMounted = false
    }
  }, [activeTab, userId])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner label={t('loading')} />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  if (!data) {
    return <EmptyState type={activeTab} />
  }

  return (
    <div className="p-6 overflow-auto max-h-[605px]">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {data.hotels.map((hotel) => {
          return (
            <HotelCardWrapper key={hotel.place_id} hotelId={hotel.place_id} />
          )
        })}
        {data.places.map((place) => {
          return <PlaceCard key={place.place_id} placeId={place.place_id} />
        })}
      </div>
    </div>
  )
}
