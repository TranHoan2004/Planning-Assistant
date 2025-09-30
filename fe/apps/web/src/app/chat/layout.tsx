import { ChatHeader } from '@/components/layout/ChatHeader'
import Sidebar from '@/components/layout/sidebar/Sidebar'
import { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  title: 'New chat'
}

export default function Layout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="h-screen">
      <ChatHeader />
      <div className="relative flex-1 flex h-[calc(100vh-62px)]">
        <Sidebar />
        {children}
      </div>
    </div>
  )
}
