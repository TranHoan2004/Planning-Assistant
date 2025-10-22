import React from 'react'
import { FaRegHeart } from 'react-icons/fa'

interface EmptyStateProps {
  type: 'all' | 'hotels' | 'places'
}

export default function EmptyState({ type }: EmptyStateProps) {
  const content = {
    all: {
      title: 'Save some hotels or places',
      description: 'Properties you love can be display here',
      buttonText: 'Let love some <3'
    },
    hotels: {
      title: 'No loved hotels yet.',
      description: 'Start explore some hotels.',
      buttonText: 'Explore'
    },
    places: {
      title: 'No loved places yet.',
      description: 'Start explore some places.',
      buttonText: 'Explore'
    }
  }

  const { title, description, buttonText } = content[type]

  return (
    <div className="flex flex-col items-center justify-center py-40 px-8">
      <div className="relative mb-8">
        <div className="w-32 h-32 bg-gradient-to-br from-pink-400 to-red-400 rounded-full flex items-center justify-center text-white shadow-lg">
          <svg
            className="w-16 h-16"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full border-4 border-white flex items-center justify-center">
          <FaRegHeart color="red" />
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
      <p className="text-gray-500 mb-8">{description}</p>

      <button className="px-8 py-3 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-colors shadow-lg">
        {buttonText}
      </button>
    </div>
  )
}
