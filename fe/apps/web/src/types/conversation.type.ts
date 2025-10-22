export type ChatRequest = {
  user_id: string
  session_id?: string
}

export type Conversation = {
  session_id: string
  user_id: string
  created_at: string
}

export type ConversationHistoryResponse = {
  data: Conversation[]
  page: {
    number: number
    page_size: number
    has_next: boolean
  }
}
