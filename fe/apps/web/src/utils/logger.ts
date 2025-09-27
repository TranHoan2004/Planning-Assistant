import { isDev, isDebugger } from '@/utils/utils'

export const logInfo = (...args: any[]) => {
  if (isDev || isDebugger) {
    console.info('[INFO]', ...args)
  }
}

export const logError = (...args: any[]) => {
  if (isDev || isDebugger) {
    console.error('[ERROR]', ...args)
  }
}
