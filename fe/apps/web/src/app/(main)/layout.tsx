import { Header } from '@/components/layout/Header'
import LocaleSwitcher from '@/components/ui/LocaleSwitcher'
import React from 'react'

export default function Layout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="relative flex flex-col">
      <Header />
      <div className="relative flex-1 flex h-full">
        {/* <Sidebar /> */}
        {children}
      </div>
      <LocaleSwitcher className="fixed bottom-3 right-3 z-20" size="lg" />
    </div>
  )
}
