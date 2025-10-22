'use client'

import CustomGoogleMap from '@/components/ui/CustomGoogleMap'
import { useChatContext } from '@/contexts/chat-context'
import { useEffect, useState } from 'react'
import { APIProvider, useMap } from '@vis.gl/react-google-maps'
import PlaceMarker from './PlaceMarker'

const RoutePolyline = ({ places }: { places: any[] }) => {
  const map = useMap()

  useEffect(() => {
    if (!map || !places || places.length < 2) return

    const validPlaces = places.filter(
      (place) => place.location?.latitude && place.location?.longitude
    )

    if (validPlaces.length < 2) return

    const path = validPlaces.map((place) => ({
      lat: place.location.latitude,
      lng: place.location.longitude
    }))

    const polyline = new google.maps.Polyline({
      path: path,
      geodesic: true,
      strokeColor: '#000000',
      strokeOpacity: 0.8,
      strokeWeight: 3,
      map: map
    })

    return () => {
      polyline.setMap(null)
    }
  }, [map, places])

  return null
}

const MapSection = () => {
  const { placesData } = useChatContext()

  const [position, setPosition] = useState({
    lat: 21.0124,
    lng: 105.5253
  })
  const [zoom, setZoom] = useState(10)

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''

  useEffect(() => {
    if (placesData && placesData.length > 0 && placesData[0]?.location) {
      const firstPlace = placesData[0].location
      if (firstPlace.latitude && firstPlace.longitude) {
        setPosition({
          lat: firstPlace.latitude,
          lng: firstPlace.longitude
        })
        setZoom(15)
        return
      }
    }

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setPosition({ lat: latitude, lng: longitude })
        },
        (error) => {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              console.log('User denied the request for Geolocation.')
              break
            case error.POSITION_UNAVAILABLE:
              console.log('Location information is unavailable.')
              break
            case error.TIMEOUT:
              console.log('The request to get user location timed out.')
              break
            default:
              console.log('An unknown error occurred.')
              break
          }
        }
      )
    } else {
      console.log('Geolocation is not available')
    }
  }, [placesData])

  return (
    <APIProvider apiKey={apiKey}>
      <CustomGoogleMap position={position} defaultZoom={zoom}>
        {/* Vẽ đường nối giữa các điểm */}
        {placesData && placesData.length > 1 && (
          <RoutePolyline places={placesData} />
        )}

        {/* Hiển thị markers với số thứ tự */}
        {placesData &&
          placesData.map((place, index) => {
            if (!place.location?.latitude || !place.location?.longitude)
              return null

            return (
              <PlaceMarker
                key={place.id || index}
                position={{
                  lat: place.location.latitude,
                  lng: place.location.longitude
                }}
                placeData={place}
                dayNumber={index + 1}
              />
            )
          })}
      </CustomGoogleMap>
    </APIProvider>
  )
}

export default MapSection
