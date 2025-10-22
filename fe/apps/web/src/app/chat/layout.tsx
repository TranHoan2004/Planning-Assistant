import Sidebar from '@/components/layout/sidebar/Sidebar'
import { SIDEBAR_COOKIE_NAME } from '@/utils/constraints'
import { cookies } from 'next/headers'

export default async function ChatLayout({
  children
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const leftsideExpanded =
    cookieStore.get(SIDEBAR_COOKIE_NAME)?.value === 'true'

  return (
    <div className="flex h-screen gap-2">
      <Sidebar defaultExpanded={leftsideExpanded} />
      {children}
    </div>
  )
}
