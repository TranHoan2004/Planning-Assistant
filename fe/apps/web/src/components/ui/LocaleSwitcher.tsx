'use client'

import { useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'
import { AmericanFlagIcon, VietnamFlagIcon } from '@/assets/Icons'
import { cn } from '@repo/utils/tailwind-utils'
import { Button, ButtonProps } from '@heroui/button'

export default function LocaleSwitcher({ className, ...props }: ButtonProps) {
  const router = useRouter()
  const currentLocale = useLocale()

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
    <Button
      className={cn('cursor-pointer', className)}
      isIconOnly
      variant="flat"
      radius="full"
      onPress={() => handleChange(currentLocale === 'en' ? 'vi' : 'en')}
      {...props}
    >
      {currentLocale === 'en' ? <AmericanFlagIcon /> : <VietnamFlagIcon />}
    </Button>
  )
}
