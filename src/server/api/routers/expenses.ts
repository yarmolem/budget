import { z } from "zod";
import { and, desc, eq, like, sql } from "drizzle-orm";
import { randomUUID } from "node:crypto";

import { type PayMethod, expenses } from "@/server/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import dayjs from "dayjs";

export const expensesRouter = createTRPCRouter({
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
        eq(expenses.authorId, ctx.session.user.id),
        input?.search?.trim().length !== 0
          ? like(expenses.description, `%${input?.search}%`)
          : undefined,
      );

      const data = await ctx.db.query.expenses.findMany({
        where,
        orderBy: desc(expenses.createdAt),
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
        .from(expenses)
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
        payMethod: z.string(),
        categoryId: z.string(),
        description: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const id = randomUUID();
      const data = await ctx.db
        .insert(expenses)
        .values({
          id,
          date: dayjs(input.date).toDate(),
          amount: input.amount,
          categoryId: input.categoryId,
          description: input.description,
          payMethod: input.payMethod as PayMethod,
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
        payMethod: z.string(),
        categoryId: z.string(),
        description: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const data = await ctx.db
        .update(expenses)
        .set({
          amount: input.amount,
          categoryId: input.categoryId,
          description: input.description,
          date: dayjs(input.date).toDate(),
          payMethod: input.payMethod as PayMethod,
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(expenses.id, input.id),
            eq(expenses.authorId, ctx.session.user.id),
          ),
        )
        .returning();

      return data?.[0] ?? null;
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db
        .delete(expenses)
        .where(
          and(
            eq(expenses.id, input.id),
            eq(expenses.authorId, ctx.session.user.id),
          ),
        )
        .returning();
    }),
});
