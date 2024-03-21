import { z } from "zod";
import dayjs from "dayjs";
import { randomUUID } from "node:crypto";
import { and, desc, eq, like, sql } from "drizzle-orm";

import {
  transactions,
  EnumTransaccionType,
  EnumTransaccionMethod,
} from "@/server/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const transactionsRouter = createTRPCRouter({
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
        eq(transactions.authorId, ctx.session.user.id),
        input?.search?.trim().length !== 0
          ? like(transactions.description, `%${input?.search}%`)
          : undefined,
      );

      const data = await ctx.db.query.transactions.findMany({
        where,
        orderBy: desc(transactions.createdAt),
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
        .from(transactions)
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
        categoryId: z.string(),
        description: z.string(),
        type: z.nativeEnum(EnumTransaccionType),
        method: z.nativeEnum(EnumTransaccionMethod),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const id = randomUUID();
      const data = await ctx.db
        .insert(transactions)
        .values({
          id,
          type: input.type,
          amount: input.amount,
          method: input.method,
          categoryId: input.categoryId,
          authorId: ctx.session.user.id,
          description: input.description,
          date: dayjs(input.date).toDate(),
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
        categoryId: z.string(),
        description: z.string(),
        type: z.nativeEnum(EnumTransaccionType),
        method: z.nativeEnum(EnumTransaccionMethod),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const data = await ctx.db
        .update(transactions)
        .set({
          type: input.type,
          method: input.method,
          amount: input.amount,
          categoryId: input.categoryId,
          description: input.description,
          date: dayjs(input.date).toDate(),
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(transactions.id, input.id),
            eq(transactions.authorId, ctx.session.user.id),
          ),
        )
        .returning();

      return data?.[0] ?? null;
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db
        .delete(transactions)
        .where(
          and(
            eq(transactions.id, input.id),
            eq(transactions.authorId, ctx.session.user.id),
          ),
        )
        .returning();
    }),
});
