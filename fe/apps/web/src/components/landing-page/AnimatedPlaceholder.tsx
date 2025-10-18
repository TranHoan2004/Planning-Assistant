import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'

const AnimatedPlaceholder = ({ isVisible }: { isVisible: boolean }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [fade, setFade] = useState(true)
  const t = useTranslations('HomePage')

  const placeholders = t.raw('pre-promt') as string[]

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
