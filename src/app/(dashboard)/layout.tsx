import { redirect } from 'next/navigation'
import { getIsLoggedIn } from '@/lib/ssr'

export default async function DashboardLayout({
  children
}: {
  children: React.ReactNode
}) {
  const isLoggedIn = await getIsLoggedIn()

  if (!isLoggedIn) redirect('/sign-in')

  return <div className="flex h-screen w-full">{children}</div>
}
