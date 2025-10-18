import { CONVERSATION_API_URL } from '@/utils/constraints'
import 'server-only'

export const getConversationById = async (sessionId: string) => {
  const response = await fetch(
    `${CONVERSATION_API_URL}/v1/conversation/${sessionId}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }
  )

  if (!response.ok) {
    throw new Error(
      `Error getting conversation by id - Status ${response.status}`
    )
  }

  return await response.json()
}
