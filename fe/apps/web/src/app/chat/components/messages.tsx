import { Avatar, AvatarIcon } from '@heroui/avatar'
import { cn } from '@repo/utils/tailwind-utils'
import type { UIMessage } from 'ai'
import { cva, type VariantProps } from 'class-variance-authority'
import type { ComponentProps, HTMLAttributes } from 'react'

export type MessageProps = HTMLAttributes<HTMLDivElement> & {
  from: UIMessage['role']
}

export const Message = ({ className, from, ...props }: MessageProps) => (
  <div
    className={cn(
      'group flex w-full items-start justify-end gap-2 py-4',
      from === 'user' ? 'is-user' : 'is-assistant flex-row-reverse justify-end',
      className
    )}
    {...props}
  />
)

const messageContentVariants = cva(
  'is-user:dark flex flex-col gap-2 overflow-hidden rounded-xl',
  {
    variants: {
      variant: {
        contained: [
          'max-w-[80%] px-4 py-3',
          'group-[.is-user]:bg-primary group-[.is-user]:text-primary-foreground',
          'group-[.is-assistant]:bg-foreground-50 group-[.is-assistant]:text-foreground'
        ],
        flat: [
          'group-[.is-user]:max-w-[80%] group-[.is-user]:bg-secondary group-[.is-user]:px-4 group-[.is-user]:py-3 group-[.is-user]:text-foreground',
          'group-[.is-assistant]:text-foreground'
        ]
      }
    },
    defaultVariants: {
      variant: 'contained'
    }
  }
)

export type MessageContentProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof messageContentVariants>

export const MessageContent = ({
  children,
  className,
  variant,
  ...props
}: MessageContentProps) => (
  <div
    className={cn(messageContentVariants({ variant, className }))}
    {...props}
  >
    {children}
  </div>
)

export type MessageAvatarProps = ComponentProps<typeof Avatar> & {
  src?: string
  name?: string
}

export const MessageAvatar = ({
  src,
  name,
  icon,
  className,
  ...props
}: MessageAvatarProps) => (
  <Avatar
    src={src}
    name={name}
    className={cn('size-8', className)}
    {...props}
  />
)
