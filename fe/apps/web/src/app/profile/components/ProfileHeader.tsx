import { Button, Image } from '@heroui/react'
import React from 'react'
import { IoSettingsOutline } from 'react-icons/io5'
import { Skeleton } from '@heroui/skeleton'

interface ProfileHeaderProps {
  name: string
  avatar: string
}

export default function ProfileHeader({ name, avatar }: ProfileHeaderProps) {
  return (
    <div className="flex flex-col items-center shadow">
      <div className="w-full flex justify-end">
        <Button isIconOnly className="m-2" variant="light" size="sm">
          <IoSettingsOutline size="1.6em" color="black" />
        </Button>
      </div>

      <div className="relative mb-4">
        {avatar ? (
          <Image
            src={avatar}
            className="w-24 h-24 bg-gradient-to-br from-pink-400 to-red-400 rounded-full flex items-center justify-center text-white text-4xl font-semibold shadow-lg"
          />
        ) : (
          <Skeleton className="flex rounded-full w-24 h-24" />
        )}
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">{name}</h1>
      {/* <p className="text-gray-500 mb-6">{username}</p> */}
    </div>
  )
}
