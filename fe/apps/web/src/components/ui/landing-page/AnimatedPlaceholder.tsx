import { useEffect, useState } from 'react'

const AnimatedPlaceholder = ({ isVisible }: { isVisible: boolean }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [fade, setFade] = useState(true)

  const placeholders = [
    'Plan a surf trip to Costa Rica in August',
    'Weekend getaway to the mountains with friends',
    'Family vacation to Disney World',
    'Backpacking through Southeast Asia',
    'Romantic trip to Paris for 5 days',
    'Group adventure to New Zealand',
    'Budget travel through Eastern Europe',
    'Luxury safari in Tanzania',
    'Food tour of Tokyo with colleagues',
    'Beach vacation in the Maldives',
    'Cultural exploration of Morocco',
    'Road trip across California'
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false)
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % placeholders.length)
        setFade(true)
      }, 250)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  if (!isVisible) return null

  return (
    <div className="absolute inset-0 pointer-events-none select-none p-4 text-base text-gray-500">
      <div
        className="whitespace-nowrap overflow-hidden text-ellipsis transition-opacity duration-500"
        style={{ opacity: fade ? 1 : 0 }}
      >
        {placeholders[currentIndex]}
      </div>
    </div>
  )
}

export default AnimatedPlaceholder
