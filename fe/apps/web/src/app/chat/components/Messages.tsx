'use client'

import { HeartTitleIcon } from '@/assets/Icons'
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton
} from '@/components/ai/conversation'
import { Message, MessageContent } from '@/components/ai/message'
import { Response as AIResponse } from '@/components/ai/response'
import { UIMessage } from 'ai'
import { useTranslations } from 'next-intl'
import { MdAssistant, MdPerson } from 'react-icons/md'

interface MessagesProps {
  messages: UIMessage[]
}

const Messages = ({ messages }: MessagesProps) => {
  const t = useTranslations('ChatPage.promtSection')
  return (
    <Conversation className="mx-2 md:mx-4">
      <ConversationContent className="flex flex-col gap-2 max-w-4xl min-w-0 mx-auto">
        {messages.length === 0 ? (
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
  )
}

export default Messages
