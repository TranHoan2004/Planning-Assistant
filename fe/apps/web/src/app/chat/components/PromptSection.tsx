'use client'

import { memo, useCallback, useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import type { RootState } from '@/state/store'
import PromptContainer from './PromptContainer'
import { DefaultChatTransport, UIMessage } from 'ai'
import { useChat } from '@ai-sdk/react'
import { usePathname, useSearchParams } from 'next/navigation'
import { ItineraryResponse } from '../_schema/itinerary'
import { parse, Allow } from 'partial-json'
import { useChatContext } from '@/contexts/chat-context'
import { useTranslations } from 'next-intl'
import Messages from './Messages'
import { Spinner } from '@heroui/spinner'

interface PromptSectionProps {
  sessionId?: string
  initialMessages: UIMessage[]
}

const PromptSection = ({ sessionId, initialMessages }: PromptSectionProps) => {
  const [input, setInput] = useState('')
  const pathname = usePathname()
  const { currentUser } = useSelector((state: RootState) => state.auth)
  const t = useTranslations('ChatPage.promtSection')
  const { setItinerary } = useChatContext()

  const searchParams = useSearchParams()
  const query = searchParams.get('query')
  const querySentRef = useRef<string | null>(null)

  const { messages, status, sendMessage, setMessages } = useChat({
    messages: initialMessages,
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

  const handleSubmit = useCallback(
    async (inputValue: string, files?: File[], initBasicParams?: any) => {
      if (pathname.split('/').length <= 2) {
        window.history.replaceState({}, '', `/chat/${sessionId}`)
      }

      if (!sessionId) return

      if (initBasicParams) {
        sendMessage(
          { text: inputValue },
          {
            body: {
              user_id: currentUser?.id,
              session_id: sessionId,
              ...initBasicParams
            }
          }
        )
      } else {
        sendMessage(
          { text: inputValue },
          {
            body: {
              user_id: currentUser?.id,
              session_id: sessionId
            }
          }
        )
      }
    },
    [sessionId, currentUser?.id]
  )

  const handleSendImage = async (selectedImage: File[]) => {
    // Image handling logic...
  }

  return (
    <div className="flex-1 relative flex flex-col h-full pt-4 bg-background">
      <Messages messages={messages} />
      <div className="sticky bottom-0 z-1 mx-auto max-w-4xl px-2 pb-3 md:px-4 md:pb-4 w-full flex bg-white">
        <PromptContainer
          input={input}
          setInput={setInput}
          disabled={status !== 'ready' || !input.trim()}
          handleSubmit={handleSubmit}
          placeholder={t('placeholderProps')}
          className="drop-shadow-2xl z-50"
        />
      </div>
    </div>
  )
}

export default memo(PromptSection)
