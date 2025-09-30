import { withAuth } from '@/middlewares/auth-middleware'
import { CONVERSATION_API_URL } from '@/utils/constraints'
import { NextRequest, NextResponse } from 'next/server'

const getConversation = async (
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) => {
  const searchParams = request.nextUrl.searchParams
  const sessionId = params.sessionId
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

  const response = await fetch(
    `${CONVERSATION_API_URL}/v1/conversation/${sessionId}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }
  )

  return new NextResponse(response.body, {
    headers: response.headers,
    status: response.status,
    statusText: response.statusText
  })
}

export const GET = withAuth(getConversation)
