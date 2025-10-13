import { clientApi } from '@/utils/client-api'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useState } from 'react'

const fetchConversationHistory = async (
  userId: string,
  page?: number,
  pageSize?: number
) => {
  try {
    const resp = await clientApi.get(`/api/conversation/history/${userId}`, {
      params: {
        page,
        pageSize
      }
    })
    return resp.data
  } catch (err) {
    throw new Error(`Cannot get conversation history`)
  }
}

interface useConversationHistoryProps {
  userId: string
  page?: number
  pageSize?: number
}

const useConversationHistory = ({
  userId,
  page,
  pageSize
}: useConversationHistoryProps) => {
  const [mPage, setPage] = useState(page)
  const [mPageSize, setPageSize] = useState(pageSize)

  const {
    data: conversationHistory,
    error,
    isPending,
    isError,
    isPlaceholderData
  } = useQuery({
    queryKey: ['conversationHistory', userId, mPage, mPageSize],
    queryFn: () => fetchConversationHistory(userId, mPage, mPageSize),
    placeholderData: keepPreviousData
  })

  return {
    setPage,
    setPageSize,
    conversationHistory,
    error,
    isPending,
    isError
  }
}

export default useConversationHistory
