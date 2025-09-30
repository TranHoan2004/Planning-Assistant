'use client'

import type { ThemeProviderProps } from 'next-themes'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import StoreProvider from '@/state/StoreProvider'
import { ToastProvider } from '@heroui/toast'
import { HeroUIProvider } from '@heroui/react'

export interface ProvidersProps {
  children: React.ReactNode
  themeProps?: ThemeProviderProps
}

export function Providers({ children, themeProps }: ProvidersProps) {
  const router = useRouter()

  return (
    <StoreProvider>
        <HeroUIProvider navigate={router.push}>
          <NextThemesProvider {...themeProps}>
            <ToastProvider
              maxVisibleToasts={10}
              toastOffset={5}
              placement={'bottom-right'}
            />
            {children}
          </NextThemesProvider>
        </HeroUIProvider>
    </StoreProvider>
  )
}
