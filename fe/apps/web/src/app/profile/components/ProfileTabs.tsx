import React, { useEffect, useState } from 'react'
import { Tabs, Tab } from '@heroui/tabs'
import { Skeleton } from '@heroui/skeleton'
import { clientApi } from '@/utils/client-api'
import { useTranslations } from 'next-intl'

interface ProfileTabsProps {
  activeTab: 'all' | 'hotels' | 'places'
  onTabChange: (tab: 'all' | 'hotels' | 'places') => void
  userId: string
}

export default function ProfileTabs({
  activeTab,
  onTabChange,
  userId
}: ProfileTabsProps) {
  const [counts, setCounts] = useState({ all: 0 })
  const [loading, setLoading] = useState(true)

  const t = useTranslations('Profile')

  useEffect(() => {
    let isMounted = true

    const fetchCounts = async () => {
      try {
        setLoading(true)
        const response = await clientApi.get(`/api/favourite/count/${userId}`)

        const data = response.data.data

        if (isMounted) {
          setCounts({
            all: data.count || 0
          })
        }
      } catch (err: any) {
        console.error('Failed to fetch counts:', err)
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchCounts()

    return () => {
      isMounted = false
    }
  }, [userId])

  const tabs = [
    { id: 'all', label: t('allFavourite'), count: counts.all },
    { id: 'hotels', label: t('hotelsFavourite') },
    { id: 'places', label: t('placesFavourite') }
  ]

  return (
    <div className="w-full">
      <Tabs
        selectedKey={activeTab}
        onSelectionChange={(key) =>
          onTabChange(key as 'all' | 'hotels' | 'places')
        }
        aria-label="Profile tabs"
        variant="underlined"
        fullWidth
        classNames={{
          tabList: 'w-full',
          tab: 'py-4 px-6',
          cursor: 'bg-black',
          tabContent: 'group-data-[selected=true]:text-black'
        }}
      >
        {tabs.map((tab) => (
          <Tab
            key={tab.id}
            title={
              <div className="flex items-center gap-2">
                <span className="font-medium">{tab.label}</span>
                {loading
                  ? tab.id === 'all' && <Skeleton className="w-8 h-4 rounded" />
                  : tab.id === 'all' && (
                      <span className="text-sm font-medium">{tab.count}</span>
                    )}
              </div>
            }
          />
        ))}
      </Tabs>
    </div>
  )
}
