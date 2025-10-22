import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { onboardOAuth2 } from '@/services/auth.service'

export async function GET(
  req: Request,
  ctx: RouteContext<'/api/auth/outbound/[provider]'>
) {
  try {
    const url = new URL(req.url)
    const code = url.searchParams.get('code')
    const callbackUrl = url.searchParams.get('state') || '/'

    if (!code) {
      // Redirect to error page or homepage
      return NextResponse.redirect(new URL('/login?error=no_code', req.url))
    }
    const provider = (await ctx.params).provider

    const resp = await onboardOAuth2(provider, code)
    // make sure resp.result exists and has tokens
    if (!resp?.result) {
      return NextResponse.redirect(
        new URL('/login?error=oauth_failed', req.url)
      )
    }

    const cookieStore = await cookies()
    const isProd = process.env.NODE_ENV === 'production'

    cookieStore.set('access_token', resp.result.accessToken, {
      maxAge: resp.result.accessTokenExpiresIn,
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      path: '/'
    })

    cookieStore.set('refresh_token', resp.result.refreshToken, {
      maxAge: resp.result.refreshTokenExpiresIn,
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      path: '/'
    })

    return NextResponse.redirect(new URL(callbackUrl, req.url))
  } catch (err) {
    console.error('OAuth callback error', err)
    return NextResponse.redirect(new URL('/login?error=server_error', req.url))
  }
}
