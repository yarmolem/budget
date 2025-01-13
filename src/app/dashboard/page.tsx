'use client'

import { useSession } from '@/lib/auth-client'
import React from 'react'

export default function DashboardPage() {
  const { data: session } = useSession()
  return <div>{session?.user?.name}</div>
}
