import React from 'react'
import PromptSection from '../components/PromptSection'
import { ChatProvider } from '@/contexts/chat-context'
import { ScrollShadow } from '@heroui/scroll-shadow'
import RightSideBar from '@/components/layout/right-sidebar/RightSideBar'

const ChatPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params

  return (
    <main className="flex w-full">
      <ChatProvider sessionId={id}>
        {/* Left Side - Prompt Part */}
        <ScrollShadow className="flex-1/2 h-full" size={0} hideScrollBar>
          <PromptSection sessionId={id} />
        </ScrollShadow>

        {/* Right Side - Suggestions/Map Part */}
        <RightSideBar />

        {/* <ScrollShadow className="pl-2 flex-1/2 h-full" size={0} hideScrollBar>
          <SuggestionSection />
        </ScrollShadow> */}
      </ChatProvider>
    </main>
  )
}

export default ChatPage
