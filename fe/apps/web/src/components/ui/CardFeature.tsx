import React from 'react'
import { Image } from '@heroui/image'
import { Card, CardBody, CardFooter } from '@heroui/card'

interface CardFeatureProps {
  image?: string
  title?: string
  content?: string
  tag?: string
  href?: string
  className?: string
  imageClassName?: string
}

export default function CardFeature({
  image = '',
  title = '',
  content = '',
  tag = '',
  href = '#',
  className = '',
  imageClassName = ''
}: CardFeatureProps) {
  const renderContent = () => (
    <div className="text-left space-y-2">
      <h3 className="text-lg font-semibold text-gray-900 leading-tight">
        {title}
      </h3>
      {content && (
        <p className="text-sm text-gray-600 line-clamp-2">{content}</p>
      )}
      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
        {tag && <span className="inline-block">{tag}</span>}
      </div>
    </div>
  )

  return (
    <div className={`relative w-full h-full ${className}`}>
      <Card
        isPressable
        className="group relative overflow-hidden"
        as="a"
        href={href}
      >
        <div className="relative w-full" style={{ aspectRatio: '16 / 9' }}>
          <Image
            src={image}
            alt={title}
            className={`object-cover object-center transform transition-transform duration-300 group-hover:scale-105 w-full h-full ${imageClassName}`}
            removeWrapper
          />
          <div className="absolute inset-0" />
        </div>

        <CardFooter className="absolute bottom-0 left-0 right-0 text-white p-4 z-12">
          <div className="w-full">
            <h3 className="text-lg font-semibold text-white leading-tight mb-1">
              {title}
            </h3>
            {content && (
              <p className="text-sm text-white line-clamp-2 mb-2">{content}</p>
            )}
            <div className="flex flex-wrap items-center gap-3 text-sm text-white">
              {tag && <span className="inline-block">{tag}</span>}
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
