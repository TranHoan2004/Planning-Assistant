import { onboardOAuth2 } from '@/services/auth.service'
import React, { Suspense } from 'react'

export default async function OutboundPage(
  props: PageProps<'/auth/outbound/[provider]'>
) {
  const { provider } = await props.params
  const searchParams = await props.searchParams
  const code = searchParams.code as string
  console.log('code', code)
  try {
    const resp = await onboardOAuth2(provider, code)
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <div>Ok</div>
      </Suspense>
    )
  } catch (err) {
    return <div>Error</div>
  }
}
