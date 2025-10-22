import { getTranslations } from 'next-intl/server'
import React from 'react'

const LoadingIndicator = async () => {
  const t = await getTranslations('ChatPage.loadingIndicator')

  return (
    <div className="flex justify-start mb-4">
      <div className="flex items-start gap-3 max-w-[80%]">
        {/* AI Avatar */}
        <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center text-sm font-semibold">
          AI
        </div>

        {/* Loading animation */}
        <div className="bg-gray-100 backdrop-blur-md rounded-2xl px-4 py-3">
          <div className="flex items-center gap-1">
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div
                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: '0.1s' }}
              ></div>
              <div
                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: '0.2s' }}
              ></div>
            </div>
            <span className="text-sm ml-2 text-gray-600">
              {t('aiThinking')}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoadingIndicator
