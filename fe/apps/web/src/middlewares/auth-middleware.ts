import { NextRequest, NextResponse } from 'next/server'

export type Handler = (request: NextRequest, ctx: any) => Promise<NextResponse>

export type RouteHandlerWithAuth = (
  request: NextRequest,
  ctx?: any
) => Promise<NextResponse>

export function withAuth(handler: RouteHandlerWithAuth): Handler {
  return async function (request: NextRequest, ctx: any) {
    const accessToken = request.headers
      .get('Authorization')
      ?.split('Bearer ')[1]

    if (!accessToken) {
      return NextResponse.json(
        { status: 'error', error: 'Unauthorized' },
        { status: 401 }
      )
    }

    return handler(request, ctx)
  }
}
