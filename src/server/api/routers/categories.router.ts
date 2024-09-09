import { z } from "zod";
import { and, eq, sql } from "drizzle-orm";
import { randomUUID } from "node:crypto";

import { categories } from "@/server/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import {
  getSort,
  getWhere,
  getPageCount,
  getPagination,
  paginationInput,
  stringFilterInput,
  booleanFilterInput,
  dateFilterInput,
} from "../utils";

const categoriesFilters = z
  .object({
    id: stringFilterInput,
    title: stringFilterInput,
    color: stringFilterInput,
    authorId: stringFilterInput,
    isIncome: booleanFilterInput,
    createdAt: dateFilterInput,
    updatedAt: dateFilterInput,
  })
  .optional();

const getAllInput = z
  .object({
    sort: z.string().optional(),
    search: z.string().optional(),
    filters: categoriesFilters,
    pagination: paginationInput,
  })
  .optional();

export const categoriesRouter = createTRPCRouter({
  getAll: protectedProcedure
    .input(getAllInput)
    .query(async ({ ctx, input }) => {
      const data = await ctx.db.query.categories.findMany({
        orderBy: getSort(input?.sort),
        where: getWhere(input?.filters),
        ...getPagination(input?.pagination),
      });

      const count = await ctx.db.query.categories.findFirst({
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
    .input(
      z.object({
        title: z.string(),
        color: z.string(),
        isIncome: z.boolean(),
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
          isIncome: input.isIncome,
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
        isIncome: z.boolean(),
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
          isIncome: input.isIncome,
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
