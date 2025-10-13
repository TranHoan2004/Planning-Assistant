'use client'

import type { ThemeProviderProps } from 'next-themes'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import StoreProvider from '@/state/StoreProvider'
import { ToastProvider } from '@heroui/toast'
import { HeroUIProvider } from '@heroui/react'
import { APIProvider as GoogleMapsAPIProvider } from '@vis.gl/react-google-maps'
import {
  isServer,
  QueryClient,
  QueryClientProvider
} from '@tanstack/react-query'

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: 60 * 1000
      }
    }
  })
}

let browserQueryClient: QueryClient | undefined = undefined

function getQueryClient() {
  if (isServer) {
    // Server: always make a new query client
    return makeQueryClient()
  } else {
    // Browser: make a new query client if we don't already have one
    // This is very important, so we don't re-make a new client if React
    // suspends during the initial render. This may not be needed if we
    // have a suspense boundary BELOW the creation of the query client
    if (!browserQueryClient) browserQueryClient = makeQueryClient()
    return browserQueryClient
  }
}

export interface ProvidersProps {
  children: React.ReactNode
  themeProps?: ThemeProviderProps
}

export function Providers({ children, themeProps }: ProvidersProps) {
  const router = useRouter()
  const queryClient = getQueryClient()

  return (
    <StoreProvider>
      <QueryClientProvider client={queryClient}>
        <HeroUIProvider navigate={router.push}>
          <GoogleMapsAPIProvider
            apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
            language="vi"
            region="VN"
          >
            <NextThemesProvider {...themeProps}>
              <ToastProvider
                maxVisibleToasts={10}
                toastOffset={5}
                placement={'bottom-right'}
              />
              {children}
            </NextThemesProvider>
          </GoogleMapsAPIProvider>
        </HeroUIProvider>
      </QueryClientProvider>
    </StoreProvider>
  )
}
