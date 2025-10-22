'use client'

import React, { memo, useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Spinner } from '@heroui/react'
import useConversationHistory from '@/hooks/useConversationHistory'
import { useSelector } from 'react-redux'
import type { RootState } from '@/state/store'
import Link from 'next/link'
import { cn } from '@repo/utils/tailwind-utils'
import InfiniteScrollContainer from '../ui/InfiniteScrollContainer'

interface ChatHistoryPanelProps {
  autoOpen: boolean
  className?: string
}

interface ChatItem {
  id: number
  title: string
  preview: string
  dateGroup: 'today' | 'yesterday' | 'week'
}

const HistoryList = ({ autoOpen, className }: ChatHistoryPanelProps) => {
  const { currentUser } = useSelector((state: RootState) => state.auth)
  const t = useTranslations('HistoryList')

  const {
    conversationHistory,
    error,
    isPending,
    isError,
    isFetching,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage
  } = useConversationHistory({
    userId: currentUser?.id
  })

  const historyPanelList = useMemo(() => {
    if (conversationHistory && Array.isArray(conversationHistory)) {
      return conversationHistory.map((c: any) => {
        const createdDate = new Date(c.created_at)
        const now = new Date()
        const diff = now.getTime() - createdDate.getTime()
        const diffDays = diff / (1000 * 60 * 60 * 24)

        let dateGroup: 'today' | 'yesterday' | 'week'
        if (diffDays < 1) dateGroup = 'today'
        else if (diffDays < 2) dateGroup = 'yesterday'
        else dateGroup = 'week'

        return {
          id: c.session_id,
          title: 'New Chat',
          dateGroup
        } as ChatItem
      })
    }
  }, [conversationHistory])

  const groupedChats = {
    today: historyPanelList?.filter((c) => c.dateGroup === 'today'),
    yesterday: historyPanelList?.filter((c) => c.dateGroup === 'yesterday'),
    week: historyPanelList?.filter((c) => c.dateGroup === 'week')
  }

  if (error) console.error(error)

  return (
    <div className={cn('w-full mt-4', className)}>
      {autoOpen && (
        <div className="flex flex-col gap-2">
          {isPending ? (
            <div className="flex justify-center items-center">
              <Spinner size="sm" color="default" />
              <p>{t('isLoading')}</p>
            </div>
          ) : isError ? (
            <p className="text-center text-sm text-pink-500">
              {t('cannotLoading')}
            </p>
          ) : (
            <>
              {Object.entries(groupedChats).map(([group, chats]) =>
                chats?.length && chats.length > 0 ? (
                  <InfiniteScrollContainer
                    key={group}
                    onBottomReached={() =>
                      hasNextPage && !isFetching && fetchNextPage()
                    }
                    className="px-2"
                  >
                    <p className="text-xs font-semibold text-gray-500 px-4">
                      {group === 'today'
                        ? t('today')
                        : group === 'yesterday'
                          ? t('yesterday')
                          : t('previous7days')}
                    </p>
                    {chats?.map((chat, index) => (
                      <Link
                        href={`/chat/${chat.id}`}
                        key={`${group}-${chat.id}-${index}`}
                        className="flex flex-col w-full hover:bg-gray-100 px-4 py-2.5 rounded-md text-sm font-medium truncate text-gray-800"
                      >
                        {chat.title}
                      </Link>
                    ))}
                    {isFetchingNextPage && (
                      <Spinner size="sm" color="default" />
                    )}
                  </InfiniteScrollContainer>
                ) : null
              )}
              {historyPanelList?.length === 0 && (
                <p className="text-center text-sm text-gray-500 py-4">
                  {t('noChat')}
                </p>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default memo(HistoryList)
