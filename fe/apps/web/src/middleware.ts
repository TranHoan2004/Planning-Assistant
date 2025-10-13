import { NextRequest, NextResponse } from 'next/server'
import { SUPPORTED_LOCALES } from './components/ui/constants'

export function middleware(request: NextRequest) {
  let locale = request.cookies.get('locale')?.value

  if (!locale) {
    // const acceptLang = request.headers.get('accept-language') || '';
    // const preferred = acceptLang.split(',')[0]?.split('-')[0] || 'vi';
    locale = 'vi'
  }

  const response = NextResponse.next()

  if (!request.cookies.get('locale')) {
    response.cookies.set({
      name: 'locale',
      value: locale,
      path: '/'
    })
  }

  if (request.nextUrl.pathname.startsWith('/chat')) {
    const token = request.cookies.get('refresh_token')?.value
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
}
