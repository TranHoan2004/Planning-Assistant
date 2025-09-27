import React from 'react'
import PromptSection from '../components/PromptSection'
import SuggestionSection from '../components/SuggestionSection'

const ChatPage = async ({ params }: { params: Promise<{ id?: string[] }> }) => {
  const { id } = await params

  return (
    <main className="flex w-full h-full overflow-hidden">
      {/* Left Side - Prompt Part */}
      <PromptSection sessionId={id?.at(0)} />

      {/* Right Side - Suggestions/Map Part */}
      <SuggestionSection />
    </main>
  )
}

export default ChatPage
