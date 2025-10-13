import { ChatHeader } from '@/components/layout/ChatHeader'
import Sidebar from '@/components/layout/sidebar/Sidebar'
import React from 'react'

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
