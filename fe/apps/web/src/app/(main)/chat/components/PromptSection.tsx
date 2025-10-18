'use client'

import { memo, useCallback, useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import type { RootState } from '@/state/store'
import PromptContainer from './PromptContainer'
import { DefaultChatTransport, UIMessage } from 'ai'
import { useChat } from '@ai-sdk/react'
import { usePathname, useSearchParams } from 'next/navigation'
import { MdAssistant, MdPerson } from 'react-icons/md'
import { ItineraryResponse } from '../_schema/itinerary'
import { parse, Allow } from 'partial-json'
import { useChatContext } from '@/contexts/chat-context'
import { HeartTitleIcon } from '@/assets/Icons'
import { useTranslations } from 'next-intl'
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton
} from '@/components/ai/conversation'
import { Message, MessageContent } from '@/components/ai/messages'
import { Response as AIResponse } from '@/components/ai/response'

interface PromptSectionProps {
  sessionId?: string
  initialMessages: UIMessage[]
}

const PromptSection = ({ sessionId, initialMessages }: PromptSectionProps) => {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { currentUser } = useSelector((state: RootState) => state.auth)
  const t = useTranslations('ChatPage.promtSection')
  const querySentRef = useRef<string | null>(null)
  const { setItinerary } = useChatContext()

  const query = searchParams.get('query')

  const { messages, status, sendMessage, setMessages } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/conversation',
      credentials: 'include',
      fetch: async (url, options) => {
        try {
          const tokenResponse = await fetch('/api/auth/token', {
            method: 'GET',
            credentials: 'include'
          })
          const { accessToken } = await tokenResponse.json()
          return fetch(url, {
            ...options,
            headers: {
              ...options?.headers,
              'Content-Type': 'application/json',
              Accept: 'text/event-stream',
              Authorization: `Bearer ${accessToken}`
            }
          })
        } catch (err) {
          console.error(err)
          if (err instanceof Response && err.status === 401) {
            const refreshResponse = await fetch('/api/auth/refresh-token', {
              method: 'POST',
              credentials: 'include'
            })
            const { accessToken } = await refreshResponse.json()
            return fetch(url, {
              ...options,
              headers: {
                ...options?.headers,
                'Content-Type': 'application/json',
                Accept: 'text/event-stream',
                Authorization: `Bearer ${accessToken}`
              }
            })
          }
          throw err
        }
      },
      prepareSendMessagesRequest({ messages, id, body }) {
        return {
          body: {
            message: messages[messages.length - 1],
            id,
            ...body
          }
        }
      }
    }),
    onError: (err) => {
      console.error(err)
    },
    onData: (data) => {
      if (data.type === 'data-itinerary') {
        const itinerary = JSON.stringify(data.data)
        setItinerary(parse(itinerary, Allow.ALL) as ItineraryResponse)
      }
    },
    onFinish: (data) => {
      console.log(data)
      scrollToBottom()
    }
  })

  const [hasAppendedQuery, setHasAppendedQuery] = useState(false)

  useEffect(() => {
    if (query && !hasAppendedQuery) {
      sendMessage(
        { text: query },
        {
          body: {
            user_id: currentUser?.id,
            session_id: sessionId
          }
        }
      )

      setHasAppendedQuery(true)
      window.history.replaceState({}, '', `/chat/${sessionId}`)
    }
  }, [query, sendMessage, hasAppendedQuery, sessionId])

  useEffect(() => {
    setMessages(initialMessages)
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSubmit = useCallback(
    async (inputValue: string, files?: File[]) => {
      if (pathname.split('/').length <= 2) {
        window.history.replaceState({}, '', `/chat/${sessionId}`)
      }

      if (!sessionId) return

      sendMessage(
        { text: inputValue },
        {
          body: {
            user_id: currentUser?.id,
            session_id: sessionId
          }
        }
      )
      scrollToBottom()
    },
    [sessionId, currentUser?.id]
  )

  const handleSendImage = async (selectedImage: File[]) => {
    // Image handling logic...
  }

  return (
    <div className="flex-1 relative flex flex-col h-full pt-4">
      <Conversation className="mx-2">
        <ConversationContent className="max-w-4xl mx-auto">
          {!initialMessages.length ? (
            <ConversationEmptyState>
              <div className="text-center">
                <div className="mb-8">
                  <h1 className="text-[60px] font-bold text-gray-900 mb-4 flex">
                    {t('title')} <HeartTitleIcon />
                  </h1>
                  <p className="text-[#060304] mb-2 text-lg">{t('subtitle')}</p>
                  <p className="text-[#060304] mb-2 text-lg">
                    {t('helper-text')}
                  </p>
                </div>
              </div>
            </ConversationEmptyState>
          ) : (
            // <div
            //   className={`relative flex-1 transition-opacity duration-500`}
            // >
            //   <div className="overflow-y-auto space-y-2 mb-4 no-scrollbar mx-auto max-w-4xl">

            //   </div>
            // </div>
            <>
              {messages.map((message) => (
                <Message key={message?.id} from={message?.role}>
                  <MessageContent>
                    {message?.parts.map((part, i) => {
                      switch (part.type) {
                        case 'text':
                          return (
                            <AIResponse key={`${message?.id}-${i}`}>
                              {part.text}
                            </AIResponse>
                          )
                        default:
                          return null
                      }
                    })}
                  </MessageContent>
                  {message?.role === 'assistant' ? (
                    <span className="p-1 ring-1 ring-gray-300 rounded-full">
                      <MdAssistant className="size-6" />
                    </span>
                  ) : (
                    <span className="p-1 ring-1 ring-gray-300 rounded-full">
                      <MdPerson className="size-6" />
                    </span>
                  )}
                </Message>
              ))}
            </>
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>
      <div className="sticky bottom-0 z-1 mx-auto max-w-4xl px-2 pb-3 md:px-4 md:pb-4 w-full flex bg-white">
        <PromptContainer
          disabled={status !== 'ready'}
          handleSubmit={handleSubmit}
          placeholder={t('placeholderProps')}
          className="drop-shadow-2xl z-50"
        />
      </div>
    </div>
  )
}

export default memo(PromptSection)
