import { differenceInSeconds, parseISO } from 'date-fns'
import { useEffect, useState } from 'react'

const useTimeAgo = (timestamp: string) => {
  const [timeAgo, setTimeAgo] = useState<string>('')

  const calculateTimeAgo = (timestamp: string): string => {
    const seconds = differenceInSeconds(new Date(), parseISO(timestamp))

    if (seconds < 60) return 'Vừa xong'
    if (seconds < 3600) return `${Math.floor(seconds / 60)} phút`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} giờ`
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} ngày`
    if (seconds < 2419200) return `${Math.floor(seconds / 604800)} tuần`
    if (seconds < 29030400) return `${Math.floor(seconds / 2419200)} tháng`
    return `${Math.floor(seconds / 29030400)} năm`
  }

  // Tính toán interval thông minh dựa trên thời gian
  const getUpdateInterval = (seconds: number): number => {
    if (seconds < 60) return 1000 // Cập nhật mỗi giây cho "vừa xong"
    if (seconds < 3600) return 60000 // Cập nhật mỗi phút
    if (seconds < 86400) return 3600000 // Cập nhật mỗi giờ
    return 86400000 // Cập nhật mỗi ngày cho thời gian lâu hơn
  }

  useEffect(() => {
    const updateTimeAgo = () => {
      const newTimeAgo = calculateTimeAgo(timestamp)
      setTimeAgo(newTimeAgo)

      const seconds = differenceInSeconds(new Date(), parseISO(timestamp))
      return getUpdateInterval(seconds)
    }

    let nextInterval = updateTimeAgo()

    let timeoutId: NodeJS.Timeout

    const scheduleNextUpdate = () => {
      timeoutId = setTimeout(() => {
        nextInterval = updateTimeAgo()
        scheduleNextUpdate()
      }, nextInterval)
    }

    scheduleNextUpdate()

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [timestamp])

  return timeAgo
}

export default useTimeAgo
