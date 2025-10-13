'use client'

import CustomGoogleMap from '@/components/ui/CustomGoogleMap'
import { useEffect, useState } from 'react'

const MapSection = () => {
  const [position, setPosition] = useState({
    lat: 21.0124,
    lng: 105.5253
  })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
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
  }, [])

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return <CustomGoogleMap position={position}></CustomGoogleMap>
}

export default MapSection
