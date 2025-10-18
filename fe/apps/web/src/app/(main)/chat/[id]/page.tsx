import React, { Suspense } from 'react'
import PromptSection from '../components/PromptSection'
import { ChatProvider } from '@/contexts/chat-context'
import { ScrollShadow } from '@heroui/scroll-shadow'
import RightSideBar from '@/components/layout/right-sidebar/RightSideBar'
import { getConversationById } from '@/services/conversation.service'

const ChatPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params
  const response = await getConversationById(id)

  return (
    <main className="flex w-full">
      <Suspense fallback={<div>Loading...</div>}>
        <ChatProvider itinerary={response?.itinerary}>
          {/* Left Side - Prompt Part */}
          <div className="flex-1/2 h-full">
            <PromptSection sessionId={id} initialMessages={response.messages} />
          </div>

          {/* Right Side - Suggestions/Map Part */}
          <RightSideBar />
        </ChatProvider>
      </Suspense>
    </main>
  )
}

export default ChatPage
