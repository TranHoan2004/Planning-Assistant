import React, { memo } from 'react'
import { Map } from '@vis.gl/react-google-maps'
import { cn } from '@repo/utils/tailwind-utils'

interface CustomGoogleMapProps {
  className?: string
  children?: React.ReactNode
  position?: { lat: number; lng: number }
  defaultZoom?: number
}

const CustomGoogleMap = ({
  className,
  children,
  position,
  defaultZoom = 10
}: CustomGoogleMapProps) => {
  const styles = [
    {
      featureType: 'administrative',
      elementType: 'geometry',
      stylers: [
        {
          visibility: 'off'
        }
      ]
    },
    {
      featureType: 'landscape.man_made',
      elementType: 'geometry',
      stylers: [
        {
          color: '#f2f2f2'
        }
      ]
    },
    {
      featureType: 'poi',
      stylers: [
        {
          visibility: 'off'
        }
      ]
    },
    {
      featureType: 'road',
      elementType: 'labels.icon',
      stylers: [
        {
          visibility: 'off'
        }
      ]
    },
    {
      featureType: 'road.arterial',
      stylers: [
        {
          color: '#ffffff'
        }
      ]
    },
    {
      featureType: 'road.arterial',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#3d3d3d'
        }
      ]
    },
    {
      featureType: 'road.highway',
      stylers: [
        {
          color: '#ffffff'
        }
      ]
    },
    {
      featureType: 'road.highway',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#3d3d3d'
        }
      ]
    },
    {
      featureType: 'road.local',
      stylers: [
        {
          color: '#ffffff'
        }
      ]
    },
    {
      featureType: 'road.local',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#3d3d3d'
        }
      ]
    },
    {
      featureType: 'transit',
      stylers: [
        {
          visibility: 'off'
        }
      ]
    }
  ]

  return (
    <Map
      styles={styles}
      defaultCenter={position}
      defaultZoom={defaultZoom}
      className={cn('w-full h-full', className)}
      disableDefaultUI={true}
      mapId={process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID}
    >
      {children}
    </Map>
  )
}

export default memo(CustomGoogleMap)
