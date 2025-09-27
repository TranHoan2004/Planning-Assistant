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
    <div className="w-screen h-screen">
      <Sidebar />
      <div className="h-full flex-col flex ml-50">
        <ChatHeader />
        {children}
      </div>
    </div>
  )
}
