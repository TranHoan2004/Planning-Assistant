import { addToast } from '@heroui/react'

interface ToastProps {
  message: string
  title?: string
  color:
    | 'success'
    | 'danger'
    | 'warning'
    | 'default'
    | 'foreground'
    | 'primary'
    | 'secondary'
}

const duration = 3000

export const callToast = ({ message, title, color }: ToastProps) => {
  addToast({
    ...(title && { title }),
    description: message,
    color: color,
    closeIcon: 'true',
    shouldShowTimeoutProgress: true,
    timeout: duration
  })
}
