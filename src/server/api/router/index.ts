import { z } from 'zod'
import { createCallerFactory, publicProcedure, router } from '../trpc'
import { usersRouter } from './users.router'

export const appRouter = router({
  hello: publicProcedure
    .input(z.object({ name: z.string().optional() }))
    .query(({ input }) => `Hola ${input.name ?? 'Joe'}`),
  users: usersRouter
})

export type AppRouter = typeof appRouter

export const createCaller = createCallerFactory(appRouter)
