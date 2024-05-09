import { z } from "zod";
import { and, desc, eq, like, sql } from "drizzle-orm";
import { randomUUID } from "node:crypto";

import { tags } from "@/server/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const tagsRouter = createTRPCRouter({
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
        eq(tags.authorId, ctx.session.user.id),
        input?.search && input?.search?.trim().length !== 0
          ? like(tags.title, `%${input?.search}%`)
          : undefined,
      );

      const data = await ctx.db.query.tags.findMany({
        where,
        orderBy: desc(tags.createdAt),
        limit: input?.pagination?.pageSize,
        offset:
          ((input?.pagination?.page ?? 1) - 1) *
          (input?.pagination?.pageSize ?? 10),
      });

      const count = await ctx.db
        .select({ count: sql<number>`COUNT(*)` })
        .from(tags)
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
    .input(z.object({ title: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const exist = await ctx.db.query.tags.findFirst({
        where: and(
          eq(tags.title, input.title),
          eq(tags.authorId, ctx.session.user.id),
        ),
      });

      if (exist) {
        throw new Error("Tag already exists");
      }

      const id = randomUUID();

      const data = await ctx.db
        .insert(tags)
        .values({
          id,
          title: input.title,
          authorId: ctx.session.user.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();

      return data?.[0] ?? null;
    }),
  update: protectedProcedure
    .input(z.object({ id: z.string(), title: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const exist = await ctx.db.query.tags.findFirst({
        where: and(
          eq(tags.title, input.title),
          eq(tags.authorId, ctx.session.user.id),
        ),
      });

      if (exist && exist.id !== input.id) {
        throw new Error("Tag already exists");
      }

      const data = await ctx.db
        .update(tags)
        .set({ title: input.title, updatedAt: new Date() })
        .where(
          and(eq(tags.id, input.id), eq(tags.authorId, ctx.session.user.id)),
        )
        .returning();

      return data?.[0] ?? null;
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db
        .delete(tags)
        .where(
          and(eq(tags.id, input.id), eq(tags.authorId, ctx.session.user.id)),
        )
        .returning();
    }),
});
