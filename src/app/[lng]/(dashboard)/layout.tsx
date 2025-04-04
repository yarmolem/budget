import { redirect } from 'next/navigation'

import { getServerAuthSession } from '@/server/auth'
import { ToggleTheme } from '@/components/shared/toggle-theme'
import { SidebarMobile } from '@/components/layout/sidebar-mobile'
import { SidebarDesktop } from '@/components/layout/sidebar-desktop'

export default async function DashboardLayout({
  children
}: {
  children: React.ReactNode
}) {
  const session = await getServerAuthSession()

  if (!session?.user?.id) {
    redirect('/sign-in')
  }

  return (
    <div className="flex h-screen w-full">
      <SidebarDesktop />
      <main className="flex h-screen w-full flex-col overflow-y-auto px-4 py-3">
        <nav className="mb-4 flex items-center justify-between py-2">
          <SidebarMobile />

          <div className="ml-auto flex">
            <ToggleTheme />
          </div>
        </nav>
        <div className="max-h-[100dvh_-_100px] w-full flex-1">{children}</div>
      </main>
    </div>
  )
}
