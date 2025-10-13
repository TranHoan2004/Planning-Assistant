import { differenceInSeconds, format, isToday, parseISO } from 'date-fns'
import { ACCESS_TOKEN } from '@/components/ui/constants'

export const isDev = process.env.NODE_ENV === 'development'
export const isDebugger = process.env.NODE_ENV === 'development'

const getItem = (key: string): string | null => {
  return localStorage.getItem(key)
}

const setItem = (key: string, value: string): void => {
  localStorage.setItem(key, value)
}

const removeItem = (key: string): void => {
  localStorage.removeItem(key)
}

export const getToken = (): string | null => {
  return getItem(ACCESS_TOKEN)
}

export const setToken = (value: string): void => {
  setItem(ACCESS_TOKEN, value)
}

export const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) return ''
  try {
    const date = parseISO(dateString)
    // if (isToday(date)) {
    //   return format(date, 'HH:mm') + ' Hôm nay'
    // }
    return format(date, 'dd/MM/yyyy')
  } catch (error) {
    return ''
  }
}

export const formatTime = (timeString: string | null | undefined) => {
  if (!timeString) return ''
  try {
    const date = parseISO(timeString)
    if (isToday(date)) {
      return format(date, 'HH:mm')
    }
    return format(date, 'HH:mm dd/MM/yyyy')
  } catch (error) {
    return ''
  }
}

export const timeAgo = (timestamp: string | null | undefined): string => {
  if (!timestamp) return ''
  const seconds = differenceInSeconds(new Date(), parseISO(timestamp))

  if (seconds < 60) return 'Vừa xong'
  if (seconds < 3600) return `${Math.floor(seconds / 60)} phút`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} giờ`
  if (seconds < 604800) return `${Math.floor(seconds / 86400)} ngày`
  if (seconds < 2419200) return `${Math.floor(seconds / 604800)} tuần`
  if (seconds < 29030400) return `${Math.floor(seconds / 2419200)} tháng`
  return `${Math.floor(seconds / 29030400)} năm`
}

// export const truncateText = (text: string) => {
//   if (!text) return text;

//   const stripHtml = text
//     .replace(/<br\s*\/?>/gi, " ")
//     .replace(/<[^>]*>/g, "")
//     .replace(/&nbsp;/g, " ")
//     .replace(/&amp;/g, "&")
//     .replace(/&lt;/g, "<")
//     .replace(/&gt;/g, ">")
//     .replace(/&quot;/g, '"')
//     .replace(/&#39;/g, "'");

//   const firstLine = stripHtml.split(/\r?\n/)[0].replace(/\s+/g, " ").trim();
//   if (firstLine.length > 100) return firstLine.slice(0, 100) + "...";

//   return firstLine;
// };
