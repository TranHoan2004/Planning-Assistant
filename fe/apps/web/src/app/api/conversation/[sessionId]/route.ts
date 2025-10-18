import { withAuth } from '@/middlewares/auth-middleware'
import { getConversationById } from '@/services/conversation.service'
import { NextRequest, NextResponse } from 'next/server'

const getConversation = async (
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) => {
  const searchParams = request.nextUrl.searchParams
  const { sessionId } = await params
  const userId = searchParams.get('user_id')

  if (!sessionId || !userId) {
    return NextResponse.json(
      {
        status: 'error',
        error: 'session_id and user_id are required'
      },
      {
        status: 400
      }
    )
  }

  const response = getConversationById(sessionId)

  return NextResponse.json({ ...response })
}

export const GET = withAuth(getConversation)
