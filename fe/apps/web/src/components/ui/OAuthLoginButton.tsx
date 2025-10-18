'use client'

import React from 'react'
import { Button, ButtonProps } from '@heroui/button'
import { FcGoogle } from 'react-icons/fc'
import { FacebookIcon } from '@/assets/Icons'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'

type OAuthProvider = 'google' | 'facebook'

interface OAuthLoginButtonProps extends ButtonProps {
  provider: OAuthProvider
  callbackUrl?: string
}

const ProviderIcons = ({ provider }: { provider: OAuthProvider }) => {
  switch (provider) {
    case 'google':
      return <FcGoogle className="size-6" />
    case 'facebook':
      return <FacebookIcon className="size-6" />
    default:
      return null
  }
}

const googleOAuthUrl = 'https://accounts.google.com/o/oauth2/v2/auth'

const OAuthLoginButton = (props: OAuthLoginButtonProps) => {
  const router = useRouter()
  const { provider, callbackUrl, ...otherProps } = props
  const t = useTranslations('LoginPage')

  const handleClick = () => {
    let url: string = ''
    if (provider === 'google') {
      url = googleOAuthUrl
    }

    const oauthUrl = new URL(url)
    const state = callbackUrl ? callbackUrl : '/'
    oauthUrl.search = new URLSearchParams({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_OAUTH2_CLIENT_ID || '',
      redirect_uri: process.env.NEXT_PUBLIC_OAUTH_REDIRECT_URL || '',
      response_type: 'code',
      scope: 'openid email profile',
      access_type: 'offline',
      prompt: 'consent',
      state: state
    }).toString()

    router.push(oauthUrl.toString())
  }

  return (
    <Button
      variant="bordered"
      startContent={<ProviderIcons provider={provider} />}
      fullWidth
      size="lg"
      {...otherProps}
      onPress={handleClick}
    >
      {t('login-google')}
    </Button>
  )
}

export default OAuthLoginButton
