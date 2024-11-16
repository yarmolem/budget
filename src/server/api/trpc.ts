import SuperJSON from 'superjson'
import { initTRPC } from '@trpc/server'

export const createTRPCContext = async (opts: { headers: Headers }) => {
  return {
    /*     db, */
    /*   session, */
    ...opts
  }
}

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: SuperJSON
})

export const router = t.router
export const publicProcedure = t.procedure
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  /*   if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      // infers the `session` as non-nullable
      session: { ...ctx.session, user: ctx.session.user },
    },
  }); */

  return next()
})

export const createCallerFactory = t.createCallerFactory
