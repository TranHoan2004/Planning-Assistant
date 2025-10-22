import React from 'react'
import { ChatProvider } from '@/contexts/chat-context'
import PromptSection from './components/PromptSection'
import RightSideBar from '@/components/layout/right-sidebar/RightSideBar'
import { v4 as uuidv4 } from 'uuid'

const NewChatPage = () => {
  const id = uuidv4()

  return (
    <main className="flex flex-1">
      <ChatProvider>
        {/* Left Side - Prompt Part */}
        <div className="flex-1/2 h-full">
          <PromptSection sessionId={id} initialMessages={[]} />
        </div>

        {/* Right Side - Suggestions/Map Part */}
        <RightSideBar />
      </ChatProvider>
    </main>
  )
}

export default NewChatPage
