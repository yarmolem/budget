import { redirect } from 'next/navigation'

import { getIsLoggedIn } from '@/lib/ssr'
import { DashboardSidebar } from '@/components/layout/dashboard-sidebar'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'

export default async function DashboardLayout({
  children
}: {
  children: React.ReactNode
}) {
  const isLoggedIn = await getIsLoggedIn()

  if (!isLoggedIn) redirect('/sign-in')

  return (
    <SidebarProvider>
      <DashboardSidebar />
      <main>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  )
}
