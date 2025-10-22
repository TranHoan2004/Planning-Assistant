'use client'

import React, { useEffect, useState } from 'react'
import { cn } from '@repo/utils/tailwind-utils'
import { FacebookIcon, InstagramIcon, TikTokIcon } from '@/assets/Icons'
import { useTranslations } from 'next-intl'
import {
  Link,
  Tooltip,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
  Divider,
  Button,
  Spacer
} from '@heroui/react'
import LocaleSwitcher from '@/components/ui/LocaleSwitcher'
import {
  TbLayoutSidebarRightExpand,
  TbLayoutSidebarLeftExpand
} from 'react-icons/tb'
import { GoHome, GoPlusCircle, GoHeart } from 'react-icons/go'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/state/store'
import { clientApi } from '@/utils/client-api'
import { clearCurrentUser, setCurrentUser } from '@/state/auth-slice'
import { CiLogout, CiUser } from 'react-icons/ci'
import { useRouter } from 'next/navigation'
import HistoryList from '@/components/conversation/HistoryList'
import Image from 'next/image'
import { useSetCookie } from 'cookies-next/client'
import { IoChatbubbleOutline } from 'react-icons/io5'
import {
  SIDEBAR_COOKIE_MAX_AGE,
  SIDEBAR_COOKIE_NAME
} from '@/utils/constraints'
import { FaChevronRight } from 'react-icons/fa6'

interface UserProfile {
  name: string
  avatar: string
}

const INITIAL_PROFILE: UserProfile = {
  name: '',
  avatar: ''
}

interface SidebarProps {
  defaultExpanded?: boolean
}

export const Sidebar = ({ defaultExpanded = false }: SidebarProps) => {
  const { currentUser } = useSelector((state: RootState) => state.auth)
  const t = useTranslations('Sidebar')
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)
  const [autoOpen, setAutoOpen] = useState(false)
  const dispatch = useDispatch()
  const [userProfile, setUserProfile] = useState<UserProfile>(INITIAL_PROFILE)
  const router = useRouter()
  const setCookie = useSetCookie()

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const response = await clientApi.get('/api/auth/me')

        const userData = response.data.result

        dispatch(
          setCurrentUser({
            id: userData.id,
            email: userData.email
          })
        )

        const profileResponse = await clientApi.get(
          `/api/profile/${userData.id}`
        )
        const data = profileResponse.data.data

        setUserProfile({
          name: data.user_fullname || '',
          avatar: data.user_avatar || ''
        })
      } catch (error) {}
    }

    getCurrentUser()
  }, [])

  const handleToggleSidebar = () => {
    const newValue = !isExpanded
    setIsExpanded(newValue)
  }

  useEffect(() => {
    setCookie(SIDEBAR_COOKIE_NAME, isExpanded ? 'true' : 'false', {
      maxAge: SIDEBAR_COOKIE_MAX_AGE
    })
  }, [setCookie, isExpanded])

  const navItems = [
    {
      href: '/',
      icon: <GoHome className="w-6 h-6" />,
      tooltip: t('tool-tips.home'),
      label: t('tool-tips.home'),
      color: 'foreground' as const
    },
    {
      href: '/chat',
      icon: <GoPlusCircle className="w-6 h-6" />,
      tooltip: t('tool-tips.new-chat'),
      label: t('tool-tips.new-chat'),
      color: 'foreground' as const
    },
    {
      href: '/love-hotels',
      icon: <GoHeart className="w-6 h-6" />,
      tooltip: t('tool-tips.saved'),
      label: t('tool-tips.saved'),
      color: 'foreground' as const
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

  const handleLogout = async () => {
    try {
      const response = await clientApi.post('/api/auth/logout')
      if (response.status === 204) {
        dispatch(clearCurrentUser())
        router.push('/')
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={handleToggleSidebar}
        className="md:hidden cursor-pointer fixed top-4 left-4 z-50 bg-white border border-[#E5E7EB] rounded-full p-2 hover:bg-gray-50 transition-colors shadow-md"
        aria-label={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
      >
        {isExpanded ? (
          <TbLayoutSidebarLeftExpand className="w-5 h-5 text-gray-600" />
        ) : (
          <TbLayoutSidebarRightExpand className="w-5 h-5 text-gray-600" />
        )}
      </button>

      {/* Overlay */}
      {isExpanded && (
        <div
          className="md:hidden fixed inset-0 bg-black/40 z-30"
          onClick={handleToggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'h-screen flex flex-col items-center border-r border-neutral-200 transition-all duration-300 ease-in-out bg-white',
          // Mobile
          'md:relative fixed top-0 left-0 z-40',
          // Hide on mobile when collapsed, show on desktop
          isExpanded ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
          // Width management
          'md:w-17',
          isExpanded ? 'w-64 md:w-64' : 'w-64'
        )}
      >
        {/* Desktop Toggle Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="hidden md:block absolute -right-3 top-3 z-10 bg-white border border-neutral-200 rounded-full p-1 hover:bg-gray-50 transition-colors shadow-sm"
          aria-label={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {isExpanded ? (
            <TbLayoutSidebarLeftExpand className="w-4 h-4 text-gray-600" />
          ) : (
            <TbLayoutSidebarRightExpand className="w-4 h-4 text-gray-600" />
          )}
        </button>

        {/* Brand Logo */}
        {isExpanded && (
          <div className="flex px-4 w-full">
            <Image
              src="/logo.png"
              alt="Logo"
              width={100}
              height={50}
              className="object-contain"
            />
          </div>
        )}
        {/* Navigation */}
        <nav
          className={cn('flex flex-col gap-6 w-full', !isExpanded && 'mt-12')}
          aria-label="Main navigation"
        >
          {navItems.map((item, index) => (
            <Tooltip
              key={index}
              color={item.color}
              content={item.tooltip}
              placement="right"
              offset={2}
              showArrow={true}
              closeDelay={0}
              isDisabled={isExpanded}
            >
              <Link
                href={item.href}
                className={cn(
                  'w-full p-1 rounded-full hover:scale-110 transition duration-300 flex items-center text-black',
                  isExpanded
                    ? 'justify-start gap-3 px-4'
                    : 'justify-center md:justify-center'
                )}
              >
                <div className={cn(isExpanded && 'flex-shrink-0')}>
                  {item.icon}
                </div>
                {isExpanded && (
                  <span className="text-sm font-medium whitespace-nowrap">
                    {item.label}
                  </span>
                )}
              </Link>
            </Tooltip>
          ))}
        </nav>
        {/* Chat History */}
        {!isExpanded ? (
          <>
            <Tooltip
              content={t('tool-tips.chat-history')}
              placement="right"
              color="foreground"
              offset={2}
              showArrow={true}
              closeDelay={0}
              isDisabled={isExpanded}
            >
              <Button
                aria-label={t('tool-tips.chat-history')}
                isIconOnly
                variant="light"
                size="sm"
                radius="full"
                className="data-[hover=true]:bg-transparent data-[hover=true]:scale-110 transition duration-300 mt-6"
                onPress={() => {
                  setIsExpanded(true)
                  setAutoOpen(true)
                }}
              >
                <IoChatbubbleOutline className="size-6" />
              </Button>
            </Tooltip>
            <Spacer as={'div'} className="grow" />
          </>
        ) : (
          <>
            <div
              tabIndex={0}
              role="button"
              className="inline-flex gap-2 items-center justify-start cursor-pointer text-neutral-600 w-full p-4 pb-0 mt-2"
              onClick={() => setAutoOpen(!autoOpen)}
            >
              <span>
                <IoChatbubbleOutline className="size-6" />
              </span>
              <h3 className="text-sm font-bold">{t('historyTitle')}</h3>
              <span>
                <FaChevronRight
                  className={cn(
                    'size-3 transition-all duration-300 ease-in-out',
                    autoOpen ? 'rotate-90' : 'rotate-0'
                  )}
                />
              </span>
            </div>
            <HistoryList autoOpen={autoOpen} className="grow overflow-y-auto" />
          </>
        )}

        {/* TODO: seperate sidebar bottom*/}
        {/* Bottom Section */}
        <div
          className={cn(
            'sticky bottom-0 left-0 flex flex-col p-4 space-y-4 bg-background z-10 w-full items-center',
            isExpanded && 'items-start'
          )}
        >
          {/* Follow Us Label */}
          {!isExpanded && (
            <Dropdown closeOnSelect={false}>
              <DropdownTrigger>
                <div className="flex items-center gap-2 bg-[#FCFBFB] rounded-xl cursor-pointer">
                  <Avatar
                    size="sm"
                    className="cursor-pointer"
                    src={userProfile.avatar}
                    isBordered
                  />
                </div>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem
                  key={'profile'}
                  onPress={() => router.push('/profile')}
                  startContent={<CiUser className="text-xl" />}
                >
                  Profile
                </DropdownItem>
                <DropdownItem
                  key="logout"
                  closeOnSelect={true}
                  onPress={handleLogout}
                  startContent={<CiLogout className="text-xl" />}
                >
                  {t('logout')}
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          )}

          {isExpanded && (
            <Dropdown closeOnSelect={false}>
              <DropdownTrigger>
                <div className="flex items-center gap-2 bg-[#FCFBFB] py-1 px-4 rounded-xl cursor-pointer w-full">
                  <Avatar
                    size="sm"
                    className="cursor-pointer"
                    src={userProfile.avatar}
                  />
                  <span className="text-sm font-medium">
                    {userProfile.name}
                  </span>
                </div>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem
                  key={'profile'}
                  onPress={() => router.push('/profile')}
                  startContent={<CiUser className="text-xl" />}
                >
                  Profile
                </DropdownItem>
                <DropdownItem
                  key="logout"
                  closeOnSelect={true}
                  onPress={handleLogout}
                  startContent={<CiLogout className="text-xl" />}
                >
                  {t('logout')}
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          )}

          {/* Divider */}
          {!isExpanded && <Divider className={cn(!isExpanded && 'hidden')} />}

          {isExpanded && <div className="w-full border-t border-[#E5E7EB]" />}

          {/* Social Links */}
          <nav
            className={cn(
              'flex flex-col w-full',
              isExpanded ? 'space-y-4' : 'space-y-8'
            )}
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
                isDisabled={isExpanded}
              >
                <Link
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.ariaLabel}
                  className={cn(
                    'cursor-pointer hover:scale-102 transition duration-300 flex items-center w-full',
                    isExpanded ? 'gap-3 px-2' : 'justify-center w-full'
                  )}
                >
                  <div
                    className={cn(
                      'flex items-center',
                      isExpanded
                        ? 'w-6 justify-center'
                        : 'w-full justify-center'
                    )}
                  >
                    {social.icon}
                  </div>
                  {isExpanded && (
                    <span className="text-sm font-medium text-black">
                      {social.label}
                    </span>
                  )}
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
            isDisabled={isExpanded}
          >
            <div
              className={cn(
                'w-full mt-4 hover:scale-105 transition duration-300 flex items-center',
                isExpanded ? 'justify-start gap-3' : 'justify-center px-2'
              )}
            >
              <LocaleSwitcher variant="light" />
              {isExpanded && (
                <span className="text-sm font-medium">
                  {t('tool-tips.language') || 'Language'}
                </span>
              )}
            </div>
          </Tooltip>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
