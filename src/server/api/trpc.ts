import SuperJSON from 'superjson'
import { initTRPC, TRPCError } from '@trpc/server'

import { db } from '../db'
import { auth } from '../auth'

export const createTRPCContext = async (opts: { headers: Headers }) => {
  const session = await auth.api.getSession(opts)

  return {
    db,
    session,
    ...opts
  }
}

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: SuperJSON
})

export const createTRPCRouter = t.router
export const createCallerFactory = t.createCallerFactory

export const publicProcedure = t.procedure
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }

  return next({
    ctx: {
      // infers the `session` as non-nullable
      session: { ...ctx.session, user: ctx.session.user }
    }
  })
})
