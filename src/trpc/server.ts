import 'server-only'

import { cache } from 'react'
import { headers } from 'next/headers'
import { createHydrationHelpers } from '@trpc/react-query/rsc'

import { makeQueryClient } from '@/lib/query-client'
import { createTRPCContext } from '@/server/api/trpc'
import { type AppRouter, createCaller } from '@/server/api/router'

export const getQueryClient = cache(makeQueryClient)

const createContext = async () => {
  const headerStore = headers()

  const heads = new Headers(headerStore)
  heads.set('x-trpc-source', 'rsc')

  return createTRPCContext({
    headers: heads
  })
}

export const caller = createCaller(createContext)

export const { trpc, HydrateClient } = createHydrationHelpers<AppRouter>(
  caller,
  getQueryClient
)
