import { CONVERSATION_API_URL } from '@/utils/constraints'
import { NextRequest, NextResponse } from 'next/server'

export const POST = async (request: NextRequest) => {
  const response = await fetch(`${CONVERSATION_API_URL}/v1/conversation/new`, {
    method: 'POST',
    headers: {
      ...request.headers,
      'Content-Type': 'application/json'
    }
  })

  if (!response.ok) {
    throw new Error('Error creating new conversation')
  }

  const data = await response.json()
  return NextResponse.json(data)
}
