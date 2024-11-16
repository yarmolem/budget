import { db } from '@/server/db'
import { publicProcedure, router } from '../trpc'

export const usersRouter = router({
  getAll: publicProcedure.query(async () => {
    return await db.query.users.findMany()
  })
})
