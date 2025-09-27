'use client'

import { useEffect, useState } from 'react'
import {
  Navbar as HeroUINavbar,
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
    <HeroUINavbar maxWidth="full" position="sticky">
      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="hidden lg:flex">{searchInput}</NavbarItem>

        {!currentUser ? (
          <NavbarItem className="hidden md:flex">
            <Button
              as={Link}
              className="text-md font-medium !rounded-[10px] text-white bg-gradient-to-r from-[#F65555] to-[#FFB26A] hover:from-[#FFB26A] hover:to-[#F65555] transition-colors duration-200"
              href="/login"
              variant="solid"
            >
              Login
            </Button>
          </NavbarItem>
        ) : (
          <NavbarItem className="">
            <Dropdown>
              <DropdownTrigger>
                <Avatar size="sm" className="cursor-pointer" />
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
          </NavbarItem>
        )}
      </NavbarContent>
    </HeroUINavbar>
  )
}
