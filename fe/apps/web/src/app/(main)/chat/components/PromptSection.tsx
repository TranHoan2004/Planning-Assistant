'use client'

import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import type { RootState } from '@/state/store'
import PromptContainer from './PromptContainer'
import { DefaultChatTransport } from 'ai'
import { useChat } from '@ai-sdk/react'
import { v4 as uuidv4 } from 'uuid'
import { useRouter, useSearchParams } from 'next/navigation'
import { clientApi } from '@/utils/client-api'
import ApproveSelect from './ApproveSelect'
import { Message, MessageContent } from './messages'
import { Response as AIResponse } from '@/components/ui/response'
import { MdAssistant, MdPerson } from 'react-icons/md'
import { ItineraryResponse } from '../_schema/itinerary'
import { parse, Allow } from 'partial-json'
import { useChatContext } from '@/contexts/chat-context'
import { HeartTitleIcon } from '@/assets/Icons'
import { useTranslations } from 'next-intl'

interface PromptSectionProps {
  sessionId?: string
}

const PromptSection = ({ sessionId }: PromptSectionProps) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isChatMode, setIsChatMode] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { currentUser } = useSelector((state: RootState) => state.auth)
  const t = useTranslations('ChatPage.promtSection')

  const querySentRef = useRef<string | null>(null)
  const { setItinerary, currentSessionId, setCurrentSessionId } =
    useChatContext()

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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (!currentSessionId || !currentUser?.id) return

    const getConversationMessages = async () => {
      try {
        const response = await clientApi.get(
          `/api/conversation/${currentSessionId}?user_id=${currentUser?.id}`
        )
        if (response.data) {
          setIsChatMode(true)
          setMessages(response.data.messages)
          setItinerary(response.data.itinerary)
        }
      } catch (err) {
        console.error(err)
      }
    }

    getConversationMessages()
    scrollToBottom()
  }, [currentSessionId, currentUser?.id])

  const handleSubmit = async (inputValue: string, files?: File[]) => {
    window.history.replaceState({}, '', `/chat/${sessionId}`)
    setIsChatMode(true)

    sendMessage(
      { text: inputValue },
      {
        body: {
          user_id: currentUser?.id,
          session_id: currentSessionId
        }
      }
    )
    scrollToBottom()
  }

  const handleOnYesClick = () => {}

  const handleOnNoClick = () => {}

  const handleSendImage = async (selectedImage: File[]) => {
    // Image handling logic...
  }

  return (
    <div className="flex-1 relative flex flex-col h-full pt-8 px-5">
      {!isChatMode ? (
        <div className={`flex-1 flex flex-col items-center justify-center`}>
          <div className="text-center">
            <div className="mb-8">
              <h1 className="text-[60px] font-bold text-gray-900 mb-4 flex">
                {t('title')} <HeartTitleIcon />
              </h1>
              <p className="text-[#060304] mb-2 text-lg">{t('subtitle')}</p>
              <p className="text-[#060304] mb-2 text-lg">{t('helper-text')}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className={`relative flex-1 px-4 transition-opacity duration-500`}>
          <div className="overflow-y-auto space-y-2 mb-4 no-scrollbar mx-auto max-w-4xl">
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
                      case 'data-interrupt':
                        return (
                          <ApproveSelect
                            key={`${message?.id}-${i}`}
                            label="Do you want to continue?"
                            onYes={handleOnYesClick}
                            onNo={handleOnNoClick}
                          />
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
            <div ref={messagesEndRef} />
          </div>
        </div>
      )}

      <div className="sticky bottom-0 z-1 mx-auto max-w-4xl px-2 pb-3 md:px-4 md:pb-4 w-full flex bg-white">
        <PromptContainer
          disabled={status !== 'ready'}
          handleSubmit={handleSubmit}
          placeholder={t('placeholderProps')}
        />
      </div>
    </div>
  )
}

export default PromptSection
