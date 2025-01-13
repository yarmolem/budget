import { InputBuilder } from '../utils/input-builder'
import { getPaginatedResults } from '../utils/pagination'
import { user, account, session } from '@/server/db/schema'
import { protectedProcedure, createTRPCRouter } from '../trpc'

const userInput = new InputBuilder(user, {
  account,
  session
})

export const usersRouter = createTRPCRouter({
  getAll: protectedProcedure
    .input(userInput.getAllSchema())
    .query(async ({ ctx, input = {} }) => {
      const where = userInput.getWhere(input.filters)
      const populate = userInput.getWith(input.include)
      const orderBy = userInput.getOrderBy(input.sortBy)
      const pagination = userInput.getPagination(input.pagination)

      return getPaginatedResults({
        where,
        pagination,
        table: user,
        query: () => {
          return ctx.db.query.user.findMany({
            where,
            orderBy,
            with: populate,
            limit: pagination.limit,
            offset: pagination.offset
          })
        }
      })
    }),
  getOne: protectedProcedure
    .input(userInput.getOneSchema())
    .query(async ({ ctx, input = {} }) => {
      const where = userInput.getWhere(input.filters)
      const populate = userInput.getWith(input.include)

      return ctx.db.query.user.findFirst({
        where,
        with: populate
      })
    })
})
