'use client'

import { useInView } from 'react-intersection-observer'

interface InfiniteScrollContainerProps {
  children: React.ReactNode
  onBottomReached: () => void
  className?: string
  rootMargin?: string
}

const InfiniteScrollContainer = ({
  children,
  onBottomReached,
  className,
  rootMargin = '100px'
}: InfiniteScrollContainerProps) => {
  const { ref } = useInView({
    rootMargin,
    onChange: (inView) => {
      if (inView) {
        onBottomReached()
      }
    }
  })

  return (
    <div className={className}>
      {children}
      <div ref={ref} />
    </div>
  )
}

export default InfiniteScrollContainer
