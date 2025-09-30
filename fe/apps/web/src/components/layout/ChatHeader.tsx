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
  DropdownItem
} from '@heroui/dropdown'
import { Avatar } from '@heroui/avatar'
import { SearchIcon } from '@/assets/Icons'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/state/store'
import { CiLogout } from 'react-icons/ci'
import { useRouter } from 'next/navigation'
import { clearCurrentUser, setCurrentUser } from '@/state/auth-slice'
import { clientApi } from '@/utils/client-api'
import LocaleSwitcher from '../ui/LocalSwitcher'
import { Image } from '@heroui/react'

export const ChatHeader = () => {
  const { currentUser } = useSelector((state: RootState) => state.auth)
  const [isSearchExpanded, setIsSearchExpanded] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const router = useRouter()
  const dispatch = useDispatch()

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
          placeholder="Search..."
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
        <Link href="/" className='flex border-r border-[#B7B9C5] pr-8 items-end'>
          <Image
            src="/logo.png"
            alt="logo"
            className="object-contain pt-3.5"
          />
        </Link>
      </NavbarBrand>
      <NavbarContent className="header-content flex items-end !justify-between w-full">
        {/* <NavbarItem className="hidden lg:flex">{searchInput}</NavbarItem> */}
        <NavbarItem className="flex h-full items-end">
          <div className="flex">
            <div className="border-x border-[#B7B9C5] w-[160px] text-center cursor-pointer pb-3">
              <span className="font-bold border-b-4 border-yellow-400">
                Khám phá
              </span>
            </div>
            <div className="border-r border-[#B7B9C5] w-[160px] text-center cursor-pointer pb-3">
              <span className="">Chuyến bay</span>
            </div>
            <div className="border-r border-[#B7B9C5] w-[160px] text-center cursor-pointer pb-3">
              <span className="">Khách sạn</span>
            </div>
            <div className="border-r border-[#B7B9C5] w-[160px] text-center cursor-pointer pb-3">
              <span className="">Blog</span>
            </div>
            <div className="border-r border-[#B7B9C5] w-[160px] text-center cursor-pointer pb-3">
              <span className="">Về PlanGo</span>
            </div>
            {!currentUser && (
            <div className="w-[160px] text-center cursor-pointer pb-3">
              <span className="font-bold text-red-500">Đăng nhập</span>
            </div>)}
          </div>
          {!currentUser ? (
            <div className="helllo pb-1">
              <Button
                as={Link}
                className="text-md font-medium !rounded-lg bg-[#060304] text-white"
                href="/login"
                variant="solid"
              >
                Lên kế hoạch ngay
              </Button>
            </div>
          ) : (
            <div className="w-[160px] flex justify-center">
              <Dropdown>
                <DropdownTrigger>
                  <Avatar size="sm" className="cursor-pointer mb-1.5" />
                </DropdownTrigger>
                <DropdownMenu>
                  <DropdownItem
                    key="logout"
                    onPress={handleLogout}
                    startContent={<CiLogout className="text-xl" />}
                  >
                    Logout
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          )}
        </NavbarItem>

        {/* <NavbarItem>
          <LocaleSwitcher />
        </NavbarItem> */}
      </NavbarContent>
    </HeroUINavbar>
  )
}
