import { addToast, CircularProgress } from '@heroui/react'

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
  isCircularProgress?: true
}

const duration = 3000

export const callToast = ({
  message,
  title,
  color,
  isCircularProgress
}: ToastProps) => {
  addToast({
    ...(title && { title }),
    description: (
      <div className="flex items-center gap-2">
        {isCircularProgress && (
          <CircularProgress size="sm" aria-label="Loading..." />
        )}
        <span>{message}</span>
      </div>
    ),
    color: color,
    closeIcon: 'true',
    shouldShowTimeoutProgress: true,
    timeout: duration
  })
}
