'use client'

import { useEffect, useState } from 'react'
import {
  Navbar as HeroUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem
} from '@heroui/navbar'
import { Button } from '@heroui/button'
import { Link } from '@heroui/link'
import { Input } from '@heroui/input'
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DropdownSection
} from '@heroui/dropdown'
import { Avatar } from '@heroui/avatar'
import { SearchIcon } from '@/assets/Icons'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/state/store'
import { CiLogout, CiUser } from 'react-icons/ci'
import { useRouter } from 'next/navigation'
import { clearCurrentUser, setCurrentUser } from '@/state/auth-slice'
import { clientApi } from '@/utils/client-api'
import LocaleSwitcher from '../ui/LocaleSwitcher'
import { Image } from '@heroui/react'
import { useTranslations } from 'next-intl'
import { setActiveItem } from '@/state/navbar-slice'

export const ChatHeader = () => {
  const { currentUser } = useSelector((state: RootState) => state.auth)
  const activeNav = useSelector((state: RootState) => state.navbar.activeItem)
  const [isSearchExpanded, setIsSearchExpanded] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const t = useTranslations('Header')
  const router = useRouter()
  const dispatch = useDispatch()

  const navItems = ['explore', 'flight', 'hotel', 'blog', 'about-us']

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const response = await clientApi.get('/api/auth/me')
        dispatch(
          setCurrentUser({
            id: response.data.result.id,
            email: response.data.result.email
          })
        )
      } catch (error) {}
    }

    getCurrentUser()
  }, [])

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

  const handleSearchClick = () => {
    setIsSearchExpanded(true)
  }

  const handleSearchBlur = () => {
    if (!searchValue.trim()) {
      setIsSearchExpanded(false)
    }
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value)
  }

  const handleNav = (item: string) => () => {
    dispatch(setActiveItem(item))
  }

  const searchInput = (
    <div className="relative flex items-center">
      <div
        className={`
          flex items-center justify-center cursor-pointer transition-all duration-300 ease-in-out
          ${isSearchExpanded ? 'w-0 opacity-0 pointer-events-none' : 'w-10 h-10 opacity-100'}
          hover:bg-default-100 rounded-full
        `}
        onClick={handleSearchClick}
      >
        <SearchIcon
          className={`
            w-5 h-5 text-default-400 transition-colors duration-200
            hover:text-default-600
          `}
        />
      </div>

      <div
        className={`
          transition-all duration-300 ease-in-out overflow-hidden
          ${isSearchExpanded ? 'w-64 opacity-100' : 'w-0 opacity-0'}
        `}
      >
        <Input
          aria-label="Search"
          value={searchValue}
          onChange={handleSearchChange}
          onBlur={handleSearchBlur}
          autoFocus={isSearchExpanded}
          classNames={{
            inputWrapper: 'bg-default-100 border-none shadow-sm',
            input: 'text-sm'
          }}
          labelPlacement="outside"
          placeholder={t('search-placeholder')}
          startContent={
            <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0 w-4 h-4" />
          }
          endContent={
            searchValue && (
              <button
                onClick={() => {
                  setSearchValue('')
                  setIsSearchExpanded(false)
                }}
                className="text-default-400 hover:text-default-600 transition-colors"
              >
                ×
              </button>
            )
          }
          type="search"
          className="w-full"
        />
      </div>
    </div>
  )

  return (
    <HeroUINavbar
      className="border-b border-[#B7B9C5]"
      height={60}
      maxWidth="full"
      position="sticky"
    >
      <NavbarBrand>
        <Link
          href="/"
          className="flex border-r border-[#B7B9C5] pr-8 items-end"
        >
          <Image src="/logo.png" alt="logo" className="object-contain pt-3.5" />
        </Link>
      </NavbarBrand>
      <NavbarContent className="header-content flex items-end !justify-between w-full">
        {/* <NavbarItem className="hidden lg:flex">{searchInput}</NavbarItem> */}
        <NavbarItem className="flex h-full items-end">
          <div className="flex">
            {navItems.map((item) => (
              <Link
                key={item}
                id={item}
                className="text-black"
                href={`/${item}`}
                onPress={handleNav(item)}
              >
                <div
                  id={item}
                  key={item}
                  className="border-r border-[#B7B9C5] w-[160px] text-center cursor-pointer pb-3"
                >
                  <span
                    className={
                      item === activeNav
                        ? 'font-bold border-b-4 border-yellow-400'
                        : ''
                    }
                  >
                    {t(`${item}`)}
                  </span>
                </div>
              </Link>
            ))}
            {!currentUser && (
              <>
                <div className="w-[160px] text-center cursor-pointer pb-3">
                  <Link href="/login">
                    <span className="font-bold text-red-500">{t('login')}</span>
                  </Link>
                </div>
                <Button
                  as={Link}
                  href="/register"
                  disableAnimation
                  className="w-[80px] bg-white text-center cursor-pointer pb-3 mr-4"
                >
                  <span className="text-lg scale-90 h-[32px]">Đăng ký</span>
                </Button>
              </>
            )}
          </div>
          {!currentUser ? (
            <div className="helllo pb-1">
              <Button
                as={Link}
                className="text-md font-medium !rounded-lg bg-[#060304] text-white"
                href="/chat"
                variant="solid"
              >
                {t('plan-now')}
              </Button>
            </div>
          ) : (
            <div className="w-[160px] flex justify-center">
              <Dropdown closeOnSelect={false}>
                <DropdownTrigger>
                  <Avatar size="sm" className="cursor-pointer mb-1.5" />
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
            </div>
          )}
        </NavbarItem>
        {/* <NavbarItem className='py-3'>
          <LocaleSwitcher />
        </NavbarItem> */}
      </NavbarContent>
    </HeroUINavbar>
  )
}
