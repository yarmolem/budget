import { and, eq } from 'drizzle-orm'

import { InputBuilder } from '../utils/input-builder'
import { getPaginatedResults } from '../utils/pagination'
import { category, user } from '@/server/db/schema'
import { protectedProcedure, createTRPCRouter } from '@/server/api/trpc'

const categoryInput = new InputBuilder(category, {
  author: user
})

export const categoriesRouter = createTRPCRouter({
  getAll: protectedProcedure
    .input(categoryInput.getAllSchema())
    .query(async ({ ctx, input }) => {
      const populate = categoryInput.getWith(input.include)
      const orderBy = categoryInput.getOrderBy(input.sortBy)
      const pagination = categoryInput.getPagination(input.pagination)

      const where = categoryInput.getWhere({
        ...input.filters,
        authorId: eq(category.authorId, ctx.session.user.id)
      })

      return getPaginatedResults({
        where,
        pagination,
        table: category,
        query: () => {
          return ctx.db.query.category.findMany({
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
    .input(categoryInput.getOneSchema())
    .query(async ({ ctx, input }) => {
      const populate = categoryInput.getWith(input.include)
      const where = categoryInput.getWhere({
        ...input.filters,
        authorId: eq(category.authorId, ctx.session.user.id)
      })

      return ctx.db.query.category.findFirst({
        where,
        with: populate
      })
    }),

  create: protectedProcedure
    .input(
      categoryInput.createSchema().omit({
        authorId: true
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db
        .insert(category)
        .values({
          ...input,
          authorId: ctx.session.user.id
        })
        .returning()
    }),
  update: protectedProcedure
    .input(
      categoryInput
        .createSchema()
        .required({ id: true })
        .omit({ authorId: true })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db
        .update(category)
        .set({
          ...input,
          updatedAt: new Date()
        })
        .where(
          and(
            eq(category.id, input.id),
            eq(category.authorId, ctx.session.user.id)
          )
        )
        .returning()
    }),
  remove: protectedProcedure
    .input(categoryInput.removeSchema())
    .mutation(async ({ ctx, input }) => {
      return ctx.db
        .delete(category)
        .where(
          and(
            eq(category.id, input.id),
            eq(category.authorId, ctx.session.user.id)
          )
        )
        .returning()
    })
})
