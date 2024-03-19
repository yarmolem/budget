import { z } from "zod";
import { and, desc, eq, like, sql } from "drizzle-orm";
import { randomUUID } from "node:crypto";

import { categories } from "@/server/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const categoriesRouter = createTRPCRouter({
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

          filters: z
            .object({
              title: z.string().optional(),
              color: z.string().optional(),
            })
            .optional(),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const where = and(
        eq(categories.authorId, ctx.session.user.id),
        input?.search && input?.search?.trim().length !== 0
          ? like(categories.title, `%${input?.search}%`)
          : undefined,
        input?.filters?.title
          ? eq(categories.title, input.filters.title)
          : undefined,
        input?.filters?.color
          ? eq(categories.color, input.filters.color)
          : undefined,
      );

      const data = await ctx.db.query.categories.findMany({
        where,
        orderBy: desc(categories.createdAt),
        limit: input?.pagination?.pageSize,
        offset:
          ((input?.pagination?.page ?? 1) - 1) *
          (input?.pagination?.pageSize ?? 10),
      });

      const count = await ctx.db
        .select({ count: sql<number>`COUNT(*)` })
        .from(categories)
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
        title: z.string(),
        color: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const exist = await ctx.db.query.categories.findFirst({
        where: and(
          eq(categories.title, input.title),
          eq(categories.authorId, ctx.session.user.id),
        ),
      });

      if (exist) {
        throw new Error("Category already exists");
      }

      const id = randomUUID();
      const data = await ctx.db
        .insert(categories)
        .values({
          id,
          title: input.title,
          color: input.color,
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
        title: z.string(),
        color: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const exist = await ctx.db.query.categories.findFirst({
        where: and(
          eq(categories.title, input.title),
          eq(categories.authorId, ctx.session.user.id),
        ),
      });

      if (exist && exist.id !== input.id) {
        throw new Error("Category already exists");
      }

      const data = await ctx.db
        .update(categories)
        .set({
          title: input.title,
          color: input.color,
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(categories.id, input.id),
            eq(categories.authorId, ctx.session.user.id),
          ),
        )
        .returning();

      return data?.[0] ?? null;
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db
        .delete(categories)
        .where(
          and(
            eq(categories.id, input.id),
            eq(categories.authorId, ctx.session.user.id),
          ),
        )
        .returning();
    }),
});
