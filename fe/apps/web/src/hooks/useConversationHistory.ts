import { ConversationHistoryResponse } from '@/types/conversation.type'
import { clientApi } from '@/utils/client-api'
import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query'

const fetchConversationHistory = async (
  userId: string,
  page?: number,
  pageSize?: number
): Promise<ConversationHistoryResponse> =>
  clientApi
    .get(`/api/conversation/history/${userId}`, {
      params: {
        page,
        pageSize
      }
    })
    .then((resp) => resp.data)
    .catch((err) => err)

interface useConversationHistoryParams {
  userId?: string
  page?: number
  pageSize?: number
}

const useConversationHistory = ({
  userId,
  page = 1,
  pageSize = 10
}: useConversationHistoryParams) => {
  const {
    data,
    error,
    isPending,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isFetchNextPageError
  } = useInfiniteQuery({
    enabled: !!userId,
    queryKey: ['conversationHistory', userId],
    queryFn: ({ pageParam }) =>
      fetchConversationHistory(userId!, pageParam, pageSize),
    initialPageParam: page,
    getNextPageParam: (lastPage) =>
      lastPage.page.has_next ? lastPage?.page.number + 1 : undefined,
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false
  })

  const conversationHistory = data?.pages.flatMap((page) => page.data)

  return {
    conversationHistory,
    error,
    isPending,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isFetchNextPageError
  }
}

export default useConversationHistory
