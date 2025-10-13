'use client'

import { useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'
import { AmericanFlagIcon, VietnamFlagIcon } from '@/assets/Icons'

export default function LocaleSwitcher() {
  const router = useRouter()
  const currentLocale = useLocale()
  // const [selectedLocale, setSelectedLocale] = useState(currentLocale)

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
    <>
      {/* <Select
          size="sm"
          value={selectedLocale}
          selectedKeys={new Set([selectedLocale])}
          onChange={(e) => {
            setSelectedLocale(e.target.value)
            handleChange(e.target.value)
          }}
          className="w-18"
          selectionMode="single"
          // selectorIcon={<span />}
          aria-labelledby="Select Language"
          variant='underlined'
      >
        {SUPPORTED_LOCALES.map((loc) => (
          <SelectItem key={loc}>{loc}</SelectItem>
        ))}
      </Select> */}
      <div
        className="cursor-pointer"
        onClick={() => handleChange(currentLocale === 'en' ? 'vi' : 'en')}
      >
        {currentLocale === 'en' ? <AmericanFlagIcon /> : <VietnamFlagIcon />}
      </div>
    </>
  )
}
