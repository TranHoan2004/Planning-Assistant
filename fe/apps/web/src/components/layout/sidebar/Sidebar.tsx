'use client'

import React from 'react'
import { cn } from '@repo/utils/tailwind-utils'
import {
  ConversationHistoryIcon,
  FacebookIcon,
  InstagramIcon,
  LoveHotelsIcon,
  NewConversationIcon,
  TikTokIcon
} from '@/assets/Icons'

export const Sidebar = () => {
  return (
    <aside
      className={cn(
        'h-full flex flex-col z-50 justify-between w-16 border-r border-[#E5E7EB]'
      )}
    >
      {/* Navigation */}
      <nav className="flex flex-col px-4 pt-4 gap-8">
        <ul className="w-full mx-auto cursor-pointer">
          <NewConversationIcon />
        </ul>
        <ul className="w-full mx-auto cursor-pointer">
          <ConversationHistoryIcon />
        </ul>
        <ul className="w-full mx-auto cursor-pointer">
          <LoveHotelsIcon />
        </ul>
      </nav>

      {/* Bottom Section */}
      <div className="flex flex-col p-4 space-y-4 gap-4 mb-4">
        {/* Solution 1: Using whitespace-nowrap with rotate */}
        <div className="flex items-end justify-center w-4 pb-8">
          <p className="text-[#B7B9C5] text-md font-semibold whitespace-nowrap rotate-90 origin-center">
            Theo dõi PlanGo
          </p>
        </div>
        <div className="flex items-end justify-center w-4">
          <p className="text-[#B7B9C5] text-md font-sembold whitespace-nowrap rotate-90 origin-center">
            -
          </p>
        </div>

        <ul className="w-full mx-auto cursor-pointer">
          <FacebookIcon />
        </ul>
        <ul className="w-full mx-auto cursor-pointer">
          <TikTokIcon />
        </ul>
        <ul className="w-full mx-auto cursor-pointer">
          <InstagramIcon />
        </ul>
      </div>
    </aside>
  )
}

export default Sidebar
