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
import { useTranslations } from 'next-intl'
import { Link, Tooltip } from '@heroui/react'
import LocaleSwitcher from '@/components/ui/LocaleSwitcher'

export const Sidebar = () => {
  const t = useTranslations('Sidebar')

  const navItems = [
    {
      href: '/chat',
      icon: <NewConversationIcon />,
      tooltip: t('tool-tips.new-chat'),
      color: 'foreground' as const
    },
    {
      href: '/history',
      icon: <ConversationHistoryIcon />,
      tooltip: t('tool-tips.chat-history'),
      color: 'foreground' as const
    },
    {
      href: '/love-hotels',
      icon: <LoveHotelsIcon />,
      tooltip: t('tool-tips.saved'),
      color: 'danger' as const
    }
  ]

  const socialLinks = [
    {
      href: 'https://www.facebook.com/profile.php?id=61581120443948',
      icon: <FacebookIcon />,
      label: 'Facebook',
      ariaLabel: 'Visit our Facebook page'
    },
    {
      href: 'https://www.tiktok.com/@plango.vn',
      icon: <TikTokIcon />,
      label: 'TikTok',
      ariaLabel: 'Visit our TikTok profile'
    },
    {
      href: 'https://www.instagram.com/plango.vn/',
      icon: <InstagramIcon />,
      label: 'Instagram',
      ariaLabel: 'Visit our Instagram profile'
    }
  ]

  return (
    <aside
      className={cn(
        'h-full flex flex-col z-50 justify-between w-16 border-r border-[#E5E7EB]'
      )}
    >
      {/* Navigation */}
      <nav
        className="flex flex-col px-2 pt-12 gap-6"
        aria-label="Main navigation"
      >
        {navItems.map((item, index) => (
          <Tooltip
            key={index}
            color={item.color}
            content={item.tooltip}
            placement="right"
            offset={-4}
            showArrow={true}
            closeDelay={0}
          >
            <Link
              href={item.href}
              className="w-full p-2 hover:bg-[#EFEFEF] rounded-full hover:scale-105 transition duration-300 flex items-center justify-center text-black"
            >
              {item.icon}
            </Link>
          </Tooltip>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="flex flex-col p-4 space-y-4 mb-4">
        {/* Follow Us Label */}
        <div className="flex items-end justify-center w-4 pb-8 pl-3">
          <p className="text-[#B7B9C5] text-md font-semibold whitespace-nowrap rotate-90 origin-center">
            {t('follow-us')}
          </p>
        </div>

        {/* Divider */}
        <div className="flex items-end justify-center w-4 pl-3">
          <p className="text-[#B7B9C5] text-md font-semibold whitespace-nowrap rotate-90 origin-center">
            -
          </p>
        </div>

        {/* Social Links */}
        <nav
          className="flex flex-col space-y-8"
          aria-label="Social media links"
        >
          {socialLinks.map((social, index) => (
            <Tooltip
              key={index}
              color="foreground"
              content={social.label}
              placement="right"
              showArrow={true}
              closeDelay={0}
            >
              <Link
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.ariaLabel}
                className="w-full cursor-pointer hover:scale-105 transition duration-300 flex items-center justify-center"
              >
                {social.icon}
              </Link>
            </Tooltip>
          ))}
        </nav>

        {/* Locale Switcher */}
        <Tooltip
          color="primary"
          content={t('tool-tips.language') || 'Change language'}
          placement="right"
          showArrow={true}
          closeDelay={0}
        >
          <div className="w-full cursor-pointer px-2 mt-4 hover:scale-105 transition duration-300 flex items-center justify-center">
            <LocaleSwitcher />
          </div>
        </Tooltip>
      </div>
    </aside>
  )
}

export default Sidebar
