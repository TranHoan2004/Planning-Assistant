'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { Spinner } from '@heroui/react'
import ProfileHeader from './components/ProfileHeader'
import ProfileTabs from './components/ProfileTabs'
import ProfileContent from './components/ProfileContent'
import { clientApi } from '@/utils/client-api'
import { RootState } from '@/state/store'
import { setCurrentUser } from '@/state/auth-slice'
import { useTranslations } from 'next-intl'

interface UserProfile {
  name: string
  avatar: string
}

const INITIAL_PROFILE: UserProfile = {
  name: '',
  avatar: ''
}

export default function ProfilePage() {
  const { currentUser } = useSelector((state: RootState) => state.auth)
  const [activeTab, setActiveTab] = useState<'all' | 'hotels' | 'places'>('all')
  const [userProfile, setUserProfile] = useState<UserProfile>(INITIAL_PROFILE)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()
  const dispatch = useDispatch()
  const t = useTranslations('Profile')

  // useEffect(() => {
  //   let isMounted = true

  //   const getCurrentUser = async () => {
  //     try {
  //       const response = await clientApi.get('/api/auth/me')
  //       if (isMounted) {
  //         dispatch(
  //           setCurrentUser({
  //             id: response.data.result.id,
  //             email: response.data.result.email
  //           })
  //         )
  //       }
  //     } catch (err) {
  //       console.error('Failed to fetch current user:', err)
  //     }
  //   }

  //   getCurrentUser()

  //   return () => {
  //     isMounted = false
  //   }
  // }, [dispatch])

  useEffect(() => {
    if (!currentUser?.id) {
      setLoading(false)
      return
    }

    let isMounted = true

    const getProfile = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await clientApi.get(`/api/profile/${currentUser.id}`)

        const data = response.data.data

        if (isMounted) {
          setUserProfile({
            name: data.user_fullname || '',
            avatar: data.user_avatar || ''
          })
        }
      } catch (err: any) {
        console.error('Fetch profile failed:', err)

        if (isMounted) {
          setError(t('error.loadProfileFailed'))
          if (err.response?.status === 401) {
            router.push('/')
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    getProfile()

    return () => {
      isMounted = false
    }
  }, [currentUser?.id, router])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full w-full">
        <Spinner
          classNames={{ label: 'text-foreground mt-4' }}
          label={t('loading')}
          variant="wave"
        />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-full w-full">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {t('retry')}
          </button>
        </div>
      </div>
    )
  }

  if (!currentUser?.id) {
    return (
      <div className="flex justify-center items-center h-full w-full">
        <p className="text-gray-500">{t('unAuthorized')}</p>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto bg-white">
      <ProfileHeader name={userProfile.name} avatar={userProfile.avatar} />
      <ProfileTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        userId={currentUser.id}
      />
      <ProfileContent activeTab={activeTab} userId={currentUser.id} />
    </div>
  )
}
