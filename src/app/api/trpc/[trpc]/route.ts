import { type NextRequest } from 'next/server'
import { fetchRequestHandler } from '@trpc/server/adapters/fetch'

import env from '@/env'
import { appRouter } from '@/server/api/router'
import { createTRPCContext } from '@/server/api/trpc'

const createContext = async (req: NextRequest) => {
  return createTRPCContext({
    headers: req.headers
  })
}

const handler = (req: NextRequest) => {
  return fetchRequestHandler({
    req,
    router: appRouter,
    endpoint: '/api/trpc',
    allowMethodOverride: true,
    createContext: () => createContext(req),
    onError: env.isDev
      ? ({ path, error }) => {
          console.error(
            `❌ tRPC failed on ${path ?? '<no-path>'}: ${error.message}`
          )
        }
      : undefined
  })
}

export { handler as GET, handler as POST }
