import { categoriesRouter } from './categories.router'
import { transactionsRouter } from './transactions.router'
import { createCallerFactory, createTRPCRouter } from '../trpc'

export const appRouter = createTRPCRouter({
  categories: categoriesRouter,
  transactions: transactionsRouter
})

export type AppRouter = typeof appRouter

export const createCaller = createCallerFactory(appRouter)
