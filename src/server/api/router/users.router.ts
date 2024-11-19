import { protectedProcedure, createTRPCRouter } from '../trpc'

export const usersRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.user.findMany()
  })
})
