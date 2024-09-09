import { z } from "zod";
import { randomUUID } from "node:crypto";
import { and, eq, sql } from "drizzle-orm";

import { tags } from "@/server/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import {
  getSort,
  getWhere,
  getPageCount,
  getPagination,
  paginationInput,
  stringFilterInput,
  dateFilterInput,
} from "../utils";

const tagsFilters = z
  .object({
    id: stringFilterInput,
    title: stringFilterInput,
    authorId: stringFilterInput,
    createdAt: dateFilterInput,
    updatedAt: dateFilterInput,
  })
  .optional();

const getAllInput = z
  .object({
    sort: z.string().optional(),
    search: z.string().optional(),
    filters: tagsFilters,
    pagination: paginationInput,
  })
  .optional();

export const tagsRouter = createTRPCRouter({
  getAll: protectedProcedure
    .input(getAllInput)
    .query(async ({ ctx, input }) => {
      const data = await ctx.db.query.tags.findMany({
        orderBy: getSort(input?.sort),
        where: getWhere(input?.filters),
        ...getPagination(input?.pagination),
      });

      const count = await ctx.db.query.tags.findFirst({
        where: getWhere(input?.filters),
        extras: { count: sql<number>`COUNT(*)`.as("count") },
      });

      return {
        data,
        meta: {
          pageCount: getPageCount(
            count?.count ?? 0,
            input?.pagination?.pageSize,
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
