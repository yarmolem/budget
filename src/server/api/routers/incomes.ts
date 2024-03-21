import { z } from "zod";
import dayjs from "dayjs";
import { randomUUID } from "node:crypto";
import { and, desc, eq, like, sql } from "drizzle-orm";

import { incomes, type IncomeMethod } from "@/server/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const incomesRouter = createTRPCRouter({
  getAll: protectedProcedure
    .input(
      z
        .object({
          search: z.string().optional(),
          pagination: z
            .object({
              page: z.number().default(1),
              pageSize: z.number().default(10),
            })
            .optional(),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const where = and(
        eq(incomes.authorId, ctx.session.user.id),
        input?.search?.trim().length !== 0
          ? like(incomes.description, `%${input?.search}%`)
          : undefined,
      );

      const data = await ctx.db.query.incomes.findMany({
        where,
        orderBy: desc(incomes.createdAt),
        limit: input?.pagination?.pageSize,
        offset:
          ((input?.pagination?.page ?? 1) - 1) *
          (input?.pagination?.pageSize ?? 10),
        with: {
          category: true,
        },
      });

      const count = await ctx.db
        .select({ count: sql<number>`COUNT(*)` })
        .from(incomes)
        .where(where);

      return {
        data,
        meta: {
          pageCount: Math.ceil(
            (count?.[0]?.count ?? 0) / (input?.pagination?.pageSize ?? 10),
          ),
        },
      };
    }),
  create: protectedProcedure
    .input(
      z.object({
        date: z.string(),
        amount: z.number(),
        method: z.string(),
        categoryId: z.string(),
        description: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const id = randomUUID();
      const data = await ctx.db
        .insert(incomes)
        .values({
          id,
          date: dayjs(input.date).toDate(),
          amount: input.amount,
          categoryId: input.categoryId,
          description: input.description,
          method: input.method as IncomeMethod,
          authorId: ctx.session.user.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();

      return data?.[0] ?? null;
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        date: z.string(),
        amount: z.number(),
        method: z.string(),
        categoryId: z.string(),
        description: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const data = await ctx.db
        .update(incomes)
        .set({
          amount: input.amount,
          categoryId: input.categoryId,
          description: input.description,
          date: dayjs(input.date).toDate(),
          method: input.method as IncomeMethod,
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(incomes.id, input.id),
            eq(incomes.authorId, ctx.session.user.id),
          ),
        )
        .returning();

      return data?.[0] ?? null;
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db
        .delete(incomes)
        .where(
          and(
            eq(incomes.id, input.id),
            eq(incomes.authorId, ctx.session.user.id),
          ),
        )
        .returning();
    }),
});
