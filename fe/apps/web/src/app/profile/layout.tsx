import { Header } from '@/components/layout/Header'
import Sidebar from '@/components/layout/sidebar/Sidebar'
import React from 'react'

export default function Profile({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="h-screen">
      {/* <ChatHeader /> */}
      <div className="relative flex-1 flex h-[calc(100vh)]">
        <Sidebar />
        {children}
      </div>
    </div>
  )
}
