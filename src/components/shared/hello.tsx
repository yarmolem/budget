'use client'

import React from 'react'
import { trpc } from '@/trpc/client'

export function Hello() {
  const { data, isLoading } = trpc.hello.useQuery({ name: 'CLIENT' })

  if (isLoading) return <div>Loading...</div>

  return <h1 className="text-4xl font-bold">{data}</h1>
}
