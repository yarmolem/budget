import React from 'react'
import { redirect } from 'next/navigation'

import { getIsLoggedIn } from '@/lib/ssr'

export default async function AuthLayout({
  children
}: {
  children: React.ReactNode
}) {
  const isLoggedIn = await getIsLoggedIn()

  if (isLoggedIn) redirect('/')

  return (
    <div className="relative flex h-screen w-full items-center justify-center">
      {children}
    </div>
  )
}
