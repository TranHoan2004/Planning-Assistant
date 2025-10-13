'use client'

import { useState } from 'react'
import { useHotelSearch } from '@/hooks/useHotelSearch'
import HotelCard from '@/components/ui/HotelCard'

export default function HotelSearch() {
  const { hotels, loading, error, searchHotels, loadMore, nextPageToken } =
    useHotelSearch()
  const [searchQuery, setSearchQuery] = useState('Nha Trang Resorts')

  const handleSearch = () => {
    searchHotels({
      q: searchQuery,
      check_in_date: '2025-09-28',
      check_out_date: '2025-09-29',
      adults: 2,
      currency: 'VND',
      gl: 'vn',
      hl: 'vi',
      engine: 'google_hotels'
    })
  }

  return (
    <div className="p-4">
      <div className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search hotels..."
            className="flex-1 p-2 border rounded"
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {hotels.map((hotel, index) => (
          <HotelCard
            key={index}
            image={hotel.images?.[0]?.original_image || ''}
            title={hotel.name}
            content={hotel.description}
            price={hotel.rate_per_night?.lowest}
            href={hotel.link || '#'}
          />
        ))}
      </div>

      {nextPageToken && (
        <div className="mt-6 text-center">
          <button
            onClick={loadMore}
            disabled={loading}
            className="px-6 py-2 bg-gray-500 text-white rounded disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  )
}
