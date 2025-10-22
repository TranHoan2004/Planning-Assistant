'use client'

import { useEffect, useState } from 'react'
import {
  Navbar as HeroUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle
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
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { setActiveItem } from '@/state/navbar-slice'
import { PiUserCircleThin } from 'react-icons/pi'

interface UserProfile {
  name: string
  avatar: string
}

const INITIAL_PROFILE: UserProfile = {
  name: '',
  avatar: ''
}

export const Header = () => {
  const { currentUser } = useSelector((state: RootState) => state.auth)
  const activeNav = useSelector((state: RootState) => state.navbar.activeItem)
  const [isSearchExpanded, setIsSearchExpanded] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const t = useTranslations('Header')
  const router = useRouter()
  const dispatch = useDispatch()
  const [userProfile, setUserProfile] = useState<UserProfile>(INITIAL_PROFILE)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navItems = ['home', 'chat', 'explore', 'about-us']

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
    // <HeroUINavbar
    //   className="border-b border-[#B7B9C5]"
    //   height={50}
    //   maxWidth="full"
    //   position="sticky"
    // >
    //   <NavbarBrand>
    //     <Link href="/" className="">
    //       <Image src="/logo.png" alt="logo" className="object-contain w-20" />
    //     </Link>
    //   </NavbarBrand>
    //   <NavbarContent className="header-content flex items-end !justify-between w-full">
    //     {/* <NavbarItem className="hidden lg:flex">{searchInput}</NavbarItem> */}
    //     <NavbarItem className="flex h-full items-end">
    //       <div className="flex">
    //         {navItems.map((item) => (
    //           <Link
    //             key={item}
    //             id={item}
    //             className="text-black"
    //             href={`/${item}`}
    //             onPress={handleNav(item)}
    //           >
    //             <div
    //               id={item}
    //               key={item}
    //               className="border-r border-[#B7B9C5] w-[160px] text-center cursor-pointer pb-3"
    //             >
    //               <span
    //                 className={
    //                   item === activeNav
    //                     ? 'font-bold border-b-4 border-yellow-400'
    //                     : ''
    //                 }
    //               >
    //                 {t(`${item}`)}
    //               </span>
    //             </div>
    //           </Link>
    //         ))}
    //         {!currentUser && (
    //           <>
    //             <div className="w-[160px] text-center cursor-pointer pb-3">
    //               <Link href="/login">
    //                 <span className="font-bold text-red-500">{t('login')}</span>
    //               </Link>
    //             </div>
    //             <Button
    //               as={Link}
    //               href="/register"
    //               disableAnimation
    //               className="w-[80px] bg-white text-center cursor-pointer pb-3 mr-4"
    //             >
    //               <span className="text-lg scale-90 h-[32px]">Đăng ký</span>
    //             </Button>
    //           </>
    //         )}
    //       </div>
    //       {!currentUser ? (
    //         <div className="helllo pb-1">
    //           <Button
    //             as={Link}
    //             className="text-md font-medium !rounded-lg bg-[#060304] text-white"
    //             href="/chat"
    //             variant="solid"
    //           >
    //             {t('plan-now')}
    //           </Button>
    //         </div>
    //       ) : (
    //         <div className="w-[160px] flex justify-center">
    //           <Dropdown closeOnSelect={false}>
    //             <DropdownTrigger>
    //               <Avatar size="sm" className="cursor-pointer mb-1.5" />
    //             </DropdownTrigger>
    //             <DropdownMenu>
    //               <DropdownItem
    //                 key={'profile'}
    //                 onPress={() => router.push('/profile')}
    //                 startContent={<CiUser className="text-xl" />}
    //               >
    //                 Profile
    //               </DropdownItem>
    //               <DropdownItem
    //                 key="logout"
    //                 closeOnSelect={true}
    //                 onPress={handleLogout}
    //                 startContent={<CiLogout className="text-xl" />}
    //               >
    //                 {t('logout')}
    //               </DropdownItem>
    //             </DropdownMenu>
    //           </Dropdown>
    //         </div>
    //       )}
    //     </NavbarItem>
    //   </NavbarContent>
    // </HeroUINavbar>

    <HeroUINavbar
      maxWidth="full"
      className="shadow"
      onMenuOpenChange={setIsMenuOpen}
      height={50}
    >
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          className="block sm:hidden"
        />
        <NavbarBrand>
          <Link href="/" className="">
            <Image
              src="/logo.png"
              alt="logo"
              className="object-contain"
              width={80}
              height={50}
            />
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-12" justify="center">
        {navItems.map((item) => (
          <NavbarItem key={item} isActive={item === activeNav}>
            <Link
              color="foreground"
              href={item === 'home' ? '/' : `/${item}`}
              onPress={handleNav(item)}
            >
              {t(`${item}`)}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>
      <NavbarContent as="div" justify="end">
        {/* <NavbarItem className="hidden lg:flex">
          <Link href="#">Login</Link>
        </NavbarItem> */}
        {!currentUser ? (
          <Button
            as={Link}
            href="/login"
            variant="flat"
            className="bg-black text-white font-bold"
          >
            Get Started
          </Button>
        ) : (
          <Dropdown closeOnSelect={false}>
            <DropdownTrigger>
              <div className="flex items-center gap-2 bg-[#FCFBFB] py-1 px-4 rounded-xl cursor-pointer">
                <Avatar
                  size="sm"
                  className="cursor-pointer"
                  src={userProfile.avatar}
                />
                <span className="text-sm font-medium">{userProfile.name}</span>
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
      </NavbarContent>

      <NavbarMenu>
        {navItems.map((item) => (
          <NavbarMenuItem key={item} isActive={item === activeNav}>
            <Link
              className="w-full"
              color="foreground"
              href={item === 'home' ? '/' : `/${item}`}
              onPress={handleNav(item)}
              size="lg"
            >
              {t(`${item}`)}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </HeroUINavbar>
  )
}
