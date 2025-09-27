import { cn } from '@heroui/react'
import Link from 'next/link'

interface SidebarNavLinkProps {
  href: string
  label: string
  className?: string
}

const SidebarNavLink = ({ href, label, className }: SidebarNavLinkProps) => {
  return (
    <li key={href}>
      <Link
        className={cn(
          'flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-300 hover:bg-default-100',
          'text-default-700 hover:text-foreground'
        )}
        href={href}
      >
        <span
          className={cn(
            'font-semibold text-[14px] transition-all duration-300 ease-in-out',
            className
          )}
        >
          {label}
        </span>
      </Link>
    </li>
  )
}

export default SidebarNavLink
