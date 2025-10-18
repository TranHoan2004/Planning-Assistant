'use client'

import React, { useEffect, useRef, useState } from 'react'

const COMMITMENT_PROMISES = [
  {
    icon: '🕒',
    title: 'Save Time',
    percentage: 90,
    unit: 'Time Saved',
    color: 'bg-indigo-500',
    description:
      'Our platform simplifies services quickly and easily. No more endless hours researching and comparing options.'
  },
  {
    icon: '👤',
    title: 'Personal Experience',
    percentage: 100,
    unit: 'Personalized',
    color: 'bg-purple-500',
    description:
      'Tailor-made itineraries just for you. Every recommendation is based on your unique preferences and style.'
  },
  {
    icon: '$',
    title: 'Fair Prices',
    percentage: 30,
    unit: 'Average Savings',
    color: 'bg-green-500',
    description:
      'We compare prices and find the best deals. We ensure you get maximum value for your travel budget.'
  },
  {
    icon: '🆘',
    title: 'Complete Peace of Mind',
    percentage: '24/7',
    unit: 'Support',
    color: 'bg-orange-500',
    description:
      'Personal information is kept safe and private. Get support whenever you need it.',
    staticDisplay: true
  }
]

interface CommitmentPromiseCardProps {
  icon: string
  title: string
  percentage: number | string
  unit: string
  color: string
  description: string
  staticDisplay?: boolean
}

const CommitmentPromiseCard: React.FC<CommitmentPromiseCardProps> = ({
  icon,
  title,
  percentage,
  unit,
  color,
  description,
  staticDisplay = false
}) => {
  const [progress, setProgress] = useState(0)
  const ref = useRef<HTMLDivElement | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (staticDisplay) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true)
            observer.disconnect()
          }
        })
      },
      { threshold: 0.5 }
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [staticDisplay])

  useEffect(() => {
    if (!visible || staticDisplay || typeof percentage !== 'number') return
    const start = performance.now()

    const animate = (time: number) => {
      const elapsed = time - start
      const value = Math.min((elapsed / 1500) * percentage, percentage)
      setProgress(value)
      if (value < percentage) requestAnimationFrame(animate)
    }

    requestAnimationFrame(animate)
  }, [visible, staticDisplay, percentage])

  return (
    <div
      ref={ref}
      className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300 ease-out h-full flex flex-col justify-center"
    >
      <div>
        <div
          className={`w-12 h-12 rounded-full ${color} text-white bg-gray-100 text-2xl flex items-center justify-center mx-auto mb-3`}
        >
          {icon}
        </div>
        <h4 className="text-lg font-bold text-gray-800 mb-1">{title}</h4>
        <p className="text-sm text-gray-600 mb-4">{description}</p>
      </div>

      <div className="mt-4">
        {staticDisplay ? (
          <p className="text-3xl font-bold text-gray-800">{percentage}</p>
        ) : (
          <p className="text-3xl font-bold text-gray-800">
            {Math.round(progress)}%
          </p>
        )}
        <p className="text-sm text-gray-500">{unit}</p>
        <div className="h-1 mt-2 w-full bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full ${color} rounded-full transition-all duration-500 ease-out`}
            style={{ width: staticDisplay ? percentage : `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  )
}

export const OurMissionAndPromise: React.FC = () => (
  <section className="py-20 bg-white">
    <div className="container mx-auto px-4 max-w-6xl text-center">
      <p className="uppercase text-sm text-indigo-600 font-semibold mb-2 tracking-widest">
        Our Commitment
      </p>
      <h2 className="text-4xl font-bold text-gray-900 mb-4">
        Our Mission & Promise
      </h2>
      <p className="text-lg text-gray-600 mb-12">
        We&#39;re committed to delivering exceptional value and peace of mind with
        every journey.
      </p>

      <div className="grid md:grid-cols-4 gap-6">
        {COMMITMENT_PROMISES.map((promise) => (
          <CommitmentPromiseCard key={promise.title} {...promise} />
        ))}
      </div>
    </div>
  </section>
)
