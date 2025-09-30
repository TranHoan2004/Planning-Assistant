import { withAuth } from '@/middlewares/auth-middleware'
import { NextRequest, NextResponse } from 'next/server'
import { CONVERSATION_API_URL } from '@/utils/constraints'
import { ChatRequest } from '@/types/conversation.type'
import { UIMessage } from 'ai'

type ConversationRequest = ChatRequest & {
  message: UIMessage
}

const handleConversation = async (request: NextRequest) => {
  try {
    const body = (await request.json()) as ConversationRequest
    const { user_id, session_id, message } = body

    const response = await fetch(
      `${CONVERSATION_API_URL}/v1/conversation/stream`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id,
          session_id,
          content: convertToMessageContent(message)
        })
      }
    )

    if (!response.ok) {
      throw new Error(`Error response with ${response.status}`)
    }

    return new NextResponse<unknown>(response.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
        'x-vercel-ai-ui-message-stream': 'v1'
      }
    })
  } catch (error) {
    console.error('Request processing error:', error)
    return NextResponse.json(
      {
        error: 'Failed to process request',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

const convertToMessageContent = (message: UIMessage) => {
  return message.parts
    .filter((part) => part.type === 'text')
    .map((part) => part.text)
    .join('\n')
}

export const POST = withAuth(handleConversation)
