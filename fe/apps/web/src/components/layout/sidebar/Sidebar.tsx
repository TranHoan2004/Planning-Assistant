'use client'

import React, { useState } from 'react'
import { cn } from '@repo/utils/tailwind-utils'
import { Logo } from '@/assets/Icons'
import { siteConfig } from '@/config/site'
import { ThemeSwitch } from '@/components/ui/theme-switch'
import { Image } from '@heroui/react'
import SidebarNavLink from './SidebarNavLink'

export const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-screen flex flex-col bg-background transition-all duration-500 ease-in-out z-50',
        isCollapsed ? 'w-16' : 'w-50'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <div
          className={cn(
            'flex items-center gap-3',
            isCollapsed && 'justify-center'
          )}
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <div className="flex items-center gap-2 cursor-pointer">
            {isCollapsed ? (
              <Logo />
            ) : (
              <div className="flex items-center gap-2 w-[140px]">
                <Image
                  src="/logo.png"
                  alt="logo"
                  className="w-20 h-20 object-contain"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 mt-[187px]">
        <ul className="space-y-2">
          {siteConfig.navItems.map((item) => (
            <SidebarNavLink
              key={item.href}
              href={item.href}
              label={item.label}
              className={
                isCollapsed
                  ? 'opacity-0 scale-95 translate-x-2 pointer-events-none w-0'
                  : 'opacity-100 scale-100 translate-x-2 pointer-events-auto'
              }
            />
          ))}
        </ul>
      </nav>

      {/* Bottom Section */}
      <div className="p-4 space-y-4">
        <div
          className={cn(
            'flex transition-all duration-300 ease-in-out justify-start'
          )}
        >
          <div
            className={cn(
              'transition-all duration-300 ease-in-out',
              isCollapsed ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
            )}
          >
            <ThemeSwitch />
          </div>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
