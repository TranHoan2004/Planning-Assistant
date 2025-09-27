'use client'

import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import type { RootState } from '@/state/store'
import PromptContainer from './PromptContainer'
import LoadingIndicator from './LoadingIndicator'
import { DefaultChatTransport } from 'ai'
import { useChat, useCompletion } from '@ai-sdk/react'
import { v4 as uuidv4 } from 'uuid'
import { useRouter, useSearchParams } from 'next/navigation'
import { clientApi } from '@/utils/client-api'
import ApproveSelect from './ApproveSelect'
import { Message, MessageContent } from './messages'
import { Response as AIResponse } from './response'
import { MdAssistant, MdPerson } from 'react-icons/md'
import { ItineraryResponse } from '../_schema/itinerary'
import ItineraryDetailView from './ItinenaryDetailView'
import { parse, Allow } from 'partial-json'

interface PromptSectionProps {
  sessionId?: string
}

const PromptSection = ({ sessionId }: PromptSectionProps) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [currentSessionId, setCurrentSessionId] = useState(sessionId)
  const [isChatMode, setIsChatMode] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { currentUser } = useSelector((state: RootState) => state.auth)

  const querySentRef = useRef<string | null>(null)

  const [itinerary, setItinerary] = useState<ItineraryResponse | undefined>(
    undefined
  )

  const query = searchParams.get('query')

  const { messages, status, sendMessage } = useChat({
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

  // const { complete, completion, setInput } = useCompletion({
  //   api: '/api/completion/itinerary',
  //   credentials: 'include',
  //   onError: (error) => {
  //     console.log(error)
  //   },
  //   onFinish: (data) => {
  //     console.log(data)
  //   }
  // })

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    // Create new session if there is no sessionId (new chat)
    if (!currentSessionId) {
      const newSessionId = uuidv4()
      setCurrentSessionId(newSessionId)
      router.replace(
        `/chat/${newSessionId}` +
          (searchParams.size > 0 ? `?${searchParams.toString()}` : '')
      )
    }
  }, [router, sessionId])

  useEffect(() => {
    if (!currentSessionId || !currentUser?.id) return

    const getConversationMessages = async () => {
      const response = await clientApi.get(
        `/api/conversation?session_id=${sessionId}&user_id=${currentUser?.id}`
      )
      console.log(response.data)
    }

    getConversationMessages()
    scrollToBottom()
  }, [currentSessionId, currentUser?.id])

  useEffect(() => {
    if (
      query &&
      currentUser?.id &&
      currentSessionId &&
      querySentRef.current !== query
    ) {
      console.log('Auto-sending query:', query)
      querySentRef.current = query
      setIsChatMode(true)

      sendMessage(
        { text: query },
        {
          body: {
            user_id: currentUser?.id,
            session_id: currentSessionId
          }
        }
      )

      // clear the query from URL after sending
      const newSearchParams = new URLSearchParams(searchParams)
      newSearchParams.delete('query')
      const newUrl = newSearchParams.toString()
        ? `/chat/${currentSessionId}?${newSearchParams.toString()}`
        : `/chat/${currentSessionId}`
      router.replace(newUrl)
    }
  }, [query, currentUser?.id, currentSessionId, sendMessage, router, searchParams])

  const handleSubmit = (inputValue: string, files?: File[]) => {
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
  }

  const handleOnYesClick = () => {}

  const handleOnNoClick = () => {}

  const handleSendImage = async (selectedImage: File[]) => {
    for (const image of selectedImage) {
      if (!image) return
      //   const fakeMessage: MessageItem = {
      //     id: uuid,
      //     attachments: [
      //       {
      //         id: uuid,
      //         name: image.name,
      //         mimeType: image.type,
      //         size: image.size,
      //         imageData: {
      //           url: URL.createObjectURL(image),
      //           width: 0,
      //           height: 0,
      //           previewUrl: '',
      //           maxWidth: 0,
      //           maxHeight: 0,
      //           renderAsSticker: false,
      //           imageType: 0
      //         }
      //       }
      //     ],
      //     status: 'sending'
      //   }

      //   dispatch(addNewCustomMessage(fakeMessage))

      //   try {
      //     const formData = new FormData()
      //     formData.append('file', image)
      //     formData.append('type', 'IMAGE')
      //     const response = await postImageFile(
      //       currentConversation.id,
      //       formData,
      //       false
      //     )
      //     const newMessageId = response.data.message.id

      //     dispatch(updateMessageId({ oldId: uuid, newId: newMessageId }))
      //   } catch (error) {
      //     throw error
      //   } finally {
      //     setSelectedImage([])
      //   }
      // }
    }
  }

  return (
    <div className="flex-1 relative flex flex-col">
      <div
        className={`flex-1 flex items-center justify-center ${
          isChatMode ? '!hidden' : 'opacity-100 mt-21'
        }`}
      >
        <div className="text-center">
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto mb-6 bg-pink-200 rounded-full flex items-center justify-center">
              <span className="text-2xl">🗺️</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Where to today?
            </h1>
            <p className="text-gray-600 mb-2">
              Hey there, I'm here to assist you in planning your experience.
            </p>
            <p className="text-gray-600">
              Ask me anything travel related or upload files for assistance.
            </p>
          </div>
        </div>
      </div>

      <div
        className={`relative flex-1 px-4 transition-opacity duration-500 ${
          isChatMode ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden '
        }`}
      >
        <div className="mx-auto">
          <div className="max-h-[80vh] overflow-y-auto space-y-2 mb-4 no-scrollbar">
            {/* {status === 'submitted' && <LoadingIndicator />} */}
            {messages.map((message) => (
              <Message key={message.id} from={message.role}>
                <MessageContent>
                  {message.parts.map((part, i) => {
                    switch (part.type) {
                      case 'text':
                        return (
                          <AIResponse key={`${message.id}-${i}`}>
                            {part.text}
                          </AIResponse>
                        )
                      case 'data-interrupt':
                        return (
                          <ApproveSelect
                            key={`${message.id}-${i}`}
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
                {message.role === 'assistant' ? (
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
            {itinerary && <ItineraryDetailView data={itinerary} />}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      <div className="pb-10 relative">
        <PromptContainer
          disabled={status !== 'ready'}
          handleSubmit={handleSubmit}
          placeholder="Create a perfect travel plan with plango now ..."
        />
      </div>
    </div>
  )
}

export default PromptSection
