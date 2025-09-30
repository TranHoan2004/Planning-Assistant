'use client'

import { useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'
import { useState } from 'react'
import { SUPPORTED_LOCALES } from './constants'
import { Select, SelectItem } from '@heroui/select'

export default function LocaleSwitcher() {
  const router = useRouter()
  const currentLocale = useLocale()
  const [selectedLocale, setSelectedLocale] = useState(currentLocale)

  const handleChange = async (newLocale: string) => {
    if (newLocale === currentLocale) return

    await fetch('/api/locale', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ locale: newLocale })
    })

    router.refresh()
  }

  return (
    <Select
      size="sm"
      value={selectedLocale}
      selectedKeys={new Set([selectedLocale])}
      onChange={(e) => {
        setSelectedLocale(e.target.value)
        handleChange(e.target.value)
      }}
      className="w-18"
      selectionMode='single'
    >
      {SUPPORTED_LOCALES.map((loc) => (
        <SelectItem key={loc.code}>{loc.label}</SelectItem>
      ))}
    </Select>
  )
}
