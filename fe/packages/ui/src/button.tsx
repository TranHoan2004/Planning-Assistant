'use client'

import React, { useCallback } from 'react'
import { useRef, useState } from 'react'
import { cn } from '@repo/utils/tailwind-utils'
import { HTMLMotionProps, Transition, motion } from 'motion/react'
import { cva, type VariantProps } from 'class-variance-authority'

const buttonVariants = cva(
  `relative overflow-hidden inline-flex items-center justify-center rounded-md bg-clip-padding border
  text-white
  text-lg
  transition-colors
  cursor-pointer
  outline-hidden
  focus-visible:ring-2
  `,
  {
    variants: {
      variant: {
        primary: 'bg-primary',
        secondary: 'bg-secondary',
        success: 'bg-success',
        danger: 'bg-danger',
        warning: 'bg-warning',
        info: 'bg-info',
        ghost:
          'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 border-none text-white/90 hover:text-white hover:bg-white/10',
        outline:
          'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50'
      },
      size: {
        default: 'h-10 px-4 py-2 has-[>svg]:px-3',
        sm: 'h-9 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
        lg: 'h-11 px-8 has-[>svg]:px-6',
        icon: 'size-10'
      }
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default'
    }
  }
)

const rippleVariants = cva('absolute rounded-full size-5 pointer-events-none', {
  variants: {
    variant: {
      primary: 'bg-primary',
      secondary: 'bg-secondary',
      success: 'bg-success',
      danger: 'bg-danger',
      warning: 'bg-warning',
      info: 'bg-info',
      ghost: 'bg-accent dark:bg-accent/50',
      outline: 'bg-accent dark:bg-accent/50'
    }
  },
  defaultVariants: {
    variant: 'primary'
  }
})

type Ripple = {
  id: number
  x: number
  y: number
}

type ButtonProps = HTMLMotionProps<'button'> & {
  children: React.ReactNode
  rippleClassName?: string
  scale?: number
  ripple?: boolean
  transition?: Transition
} & VariantProps<typeof buttonVariants>

export const Button = ({
  ref,
  children,
  onClick,
  className,
  rippleClassName,
  variant,
  size,
  scale = 10,
  transition = { duration: 0.6, ease: 'easeOut' },
  ...props
}: ButtonProps) => {
  const [ripples, setRipples] = useState<Ripple[]>([])
  const buttonRef = useRef<HTMLButtonElement>(null)

  const createRipple = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      const button = buttonRef.current
      if (!button) return

      const rect = button.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top

      const newRipple: Ripple = {
        id: Date.now(),
        x,
        y
      }

      setRipples((prev) => [...prev, newRipple])

      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== newRipple.id))
      }, 600)
    },
    []
  )

  const handleClick = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      createRipple(event)
      if (onClick) {
        onClick(event)
      }
    },
    [createRipple, onClick]
  )

  return (
    <motion.button
      ref={buttonRef}
      data-slot="ripple-button"
      onClick={handleClick}
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.05 }}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {children}
      {ripples.map((ripple) => (
        <motion.span
          key={ripple.id}
          initial={{ scale: 0, opacity: 0.5 }}
          animate={{ scale, opacity: 0 }}
          transition={transition}
          className={cn(
            rippleVariants({ variant, className: rippleClassName })
          )}
          style={{
            top: ripple.y - 10,
            left: ripple.x - 10
          }}
        />
      ))}
    </motion.button>
  )
}
