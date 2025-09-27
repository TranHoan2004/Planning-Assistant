import { withAuth } from '@/middlewares/auth-middleware'
import { NextRequest, NextResponse } from 'next/server'

export const POST = withAuth(async (req: NextRequest) => {
  return new NextResponse()
})
