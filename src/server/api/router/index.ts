import { z } from 'zod'
import { createCallerFactory, publicProcedure, router } from '../trpc'

export const appRouter = router({
  hello: publicProcedure
    .input(z.object({ name: z.string().optional() }))
    .query(({ input }) => `Hola ${input.name ?? 'Joe'}`)
})

export type AppRouter = typeof appRouter

export const createCaller = createCallerFactory(appRouter)
