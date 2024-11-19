import { z } from 'zod'
import { createCallerFactory, publicProcedure, createTRPCRouter } from '../trpc'
import { usersRouter } from './users.router'

export const appRouter = createTRPCRouter({
  users: usersRouter,
  hello: publicProcedure
    .input(z.object({ name: z.string().optional() }))
    .query(({ input }) => `Hola ${input.name ?? 'Joe'}`)
})

export type AppRouter = typeof appRouter

export const createCaller = createCallerFactory(appRouter)
