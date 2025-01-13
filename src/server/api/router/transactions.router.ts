import { and, eq } from 'drizzle-orm'

import { InputBuilder } from '../utils/input-builder'
import { getPaginatedResults } from '../utils/pagination'
import { transaction, category, user } from '@/server/db/schema'
import { protectedProcedure, createTRPCRouter } from '@/server/api/trpc'

const transactionInput = new InputBuilder(transaction, {
  category,
  author: user
})

export const transactionsRouter = createTRPCRouter({
  getAll: protectedProcedure
    .input(transactionInput.getAllSchema())
    .query(async ({ ctx, input }) => {
      const populate = transactionInput.getWith(input.include)
      const orderBy = transactionInput.getOrderBy(input.sortBy)
      const pagination = transactionInput.getPagination(input.pagination)

      const where = transactionInput.getWhere({
        ...input.filters,
        authorId: eq(transaction.authorId, ctx.session.user.id)
      })

      return getPaginatedResults({
        where,
        pagination,
        table: transaction,
        query: () => {
          return ctx.db.query.transaction.findMany({
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
    .input(transactionInput.getOneSchema())
    .query(async ({ ctx, input = {} }) => {
      const populate = transactionInput.getWith(input.include)
      const where = transactionInput.getWhere({
        ...input.filters,
        authorId: eq(transaction.authorId, ctx.session.user.id)
      })

      return ctx.db.query.transaction.findFirst({
        where,
        with: populate
      })
    }),

  create: protectedProcedure
    .input(
      transactionInput.createSchema().omit({
        authorId: true
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db
        .insert(transaction)
        .values({
          ...input,
          authorId: ctx.session.user.id
        })
        .returning()
    }),
  update: protectedProcedure
    .input(
      transactionInput
        .createSchema()
        .required({ id: true })
        .omit({ authorId: true })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db
        .update(transaction)
        .set({
          ...input,
          updatedAt: new Date()
        })
        .where(
          and(
            eq(transaction.id, input.id),
            eq(transaction.authorId, ctx.session.user.id)
          )
        )
        .returning()
    }),
  remove: protectedProcedure
    .input(transactionInput.removeSchema())
    .mutation(async ({ ctx, input }) => {
      return ctx.db
        .delete(transaction)
        .where(
          and(
            eq(transaction.id, input.id),
            eq(transaction.authorId, ctx.session.user.id)
          )
        )
        .returning()
    })
})
