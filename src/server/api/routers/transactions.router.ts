import { z } from "zod";
import dayjs from "dayjs";
import { randomUUID } from "node:crypto";
import { and, eq, sql, gte, lte } from "drizzle-orm";

import { transactions, tagsOnTransactions } from "@/server/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import {
  EnumPeriod,
  EnumTransaccionType,
  EnumTransaccionMethod,
} from "@/interface";
import {
  getSort,
  getWhere,
  getPageCount,
  getPagination,
  paginationInput,
  stringFilterInput,
  numberFilterInput,
  dateFilterInput,
} from "../utils";

const transactionsFilters = z
  .object({
    id: stringFilterInput,
    amount: numberFilterInput,
    description: stringFilterInput,
    authorId: stringFilterInput,
    categoryId: stringFilterInput,
    type: stringFilterInput,
    method: stringFilterInput,
    date: dateFilterInput,
    createdAt: dateFilterInput,
    updatedAt: dateFilterInput,
  })
  .optional();

const getAllInput = z
  .object({
    sort: z.string().optional(),
    search: z.string().optional(),
    filters: transactionsFilters,
    pagination: paginationInput,
  })
  .optional();

export const transactionsRouter = createTRPCRouter({
  getAll: protectedProcedure
    .input(getAllInput)
    .query(async ({ ctx, input }) => {
      const data = await ctx.db.query.transactions.findMany({
        orderBy: getSort(input?.sort),
        where: getWhere(input?.filters),
        with: {
          category: true,
          tags: {
            columns: {
              tagId: false,
              transactionId: false,
            },
            with: {
              tag: true,
            },
          },
        },
        ...getPagination(input?.pagination),
      });

      const count = await ctx.db.query.transactions.findFirst({
        where: getWhere(input?.filters),
        extras: { count: sql<number>`COUNT(*)`.as("count") },
      });

      return {
        data,
        meta: {
          pageCount: getPageCount(count?.count, input?.pagination?.pageSize),
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
        tagIds: z.array(z.string()).optional(),
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

      if (Array.isArray(input?.tagIds) && input.tagIds.length > 0) {
        await ctx.db.insert(tagsOnTransactions).values(
          input.tagIds.map((tagId) => ({
            tagId,
            transactionId: id,
          })),
        );
      }

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
        tagIds: z.array(z.string()).optional(),
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

      if (Array.isArray(input?.tagIds)) {
        await ctx.db
          .delete(tagsOnTransactions)
          .where(eq(tagsOnTransactions.transactionId, input.id));

        if (input.tagIds.length > 0) {
          await ctx.db.insert(tagsOnTransactions).values(
            input.tagIds.map((tagId) => ({
              tagId,
              transactionId: input.id,
            })),
          );
        }
      }

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
  getKpis: protectedProcedure.query(async ({ ctx }) => {
    const currentMonthEnd = dayjs().endOf("month").toDate();
    const previousMonthStart = dayjs()
      .subtract(1, "month")
      .startOf("month")
      .toDate();

    const data = await ctx.db.query.transactions.findMany({
      where: and(
        eq(transactions.authorId, ctx.session.user.id),
        gte(transactions.date, previousMonthStart),
        lte(transactions.date, currentMonthEnd),
      ),
      with: {
        category: true,
      },
    });

    const currentMonthIncome = data.reduce((acc, transaction) => {
      if (transaction.type === EnumTransaccionType.INCOME) {
        return acc + transaction.amount;
      }

      return acc;
    }, 0);

    const currentMonthExpenses = data.reduce((acc, transaction) => {
      if (transaction.type === EnumTransaccionType.EXPENSE) {
        return acc + transaction.amount;
      }

      return acc;
    }, 0);

    const recordCategoryExpenses = data.reduce(
      (acc, transaction) => {
        if (transaction.type === EnumTransaccionType.EXPENSE) {
          if (!acc?.[transaction.categoryId]) {
            acc[transaction.categoryId] = {
              amount: 0,
              title: transaction.category.title,
            };
          }

          acc[transaction.categoryId] = {
            ...acc[transaction.categoryId]!,
            amount: acc[transaction.categoryId]!.amount + transaction.amount,
          };
        }

        return acc;
      },
      {} as Record<string, { title: string; amount: number }>,
    );

    const mostExpensiveCategory = Object.entries(recordCategoryExpenses).reduce(
      (acc, [categoryId, { title, amount }]) => {
        if (amount > acc.amount) {
          return { categoryId, title, amount };
        }

        return acc;
      },
      { categoryId: "", title: "", amount: 0 },
    );

    return {
      totalIncome: currentMonthIncome,
      totalExpenses: currentMonthExpenses,
      mostExpensiveCategory,
    };
  }),
  getTransactionsHistory: protectedProcedure
    .input(
      z.object({
        type: z.nativeEnum(EnumTransaccionType).optional(),
        period: z.nativeEnum(EnumPeriod).default(EnumPeriod.WEEK),
      }),
    )
    .query(async ({ ctx, input }) => {
      if (input.period === EnumPeriod.WEEK) {
        const res = await ctx.db.query.transactions.findMany({
          where: and(
            eq(transactions.authorId, ctx.session.user.id),
            gte(transactions.date, dayjs().subtract(7, "days").toDate()),
            input.type ? eq(transactions.type, input.type) : undefined,
          ),
        });

        // Group by date
        const groupedData = res.reduce(
          (acc, transaction) => {
            const date = dayjs(transaction.date).format("YYYY-MM-DD");

            if (!acc[date]) {
              acc[date] = { income: 0, expense: 0 };
            }

            const item = acc[date];

            acc[date] = {
              income:
                transaction.type === EnumTransaccionType.INCOME
                  ? item.income + transaction.amount
                  : item.income,
              expense:
                transaction.type === EnumTransaccionType.EXPENSE
                  ? item.expense + transaction.amount
                  : item.expense,
            };

            return acc;
          },
          {} as Record<string, { income: number; expense: number }>,
        );

        // Fill missing days
        const data: { label: string; income: number; expense: number }[] = [];
        const weekDays = 7;
        const currentDate = dayjs();
        const dayStart = currentDate.subtract(7, "days");

        for (let i = 1; i <= weekDays; i++) {
          const date = dayStart.add(i, "day").format("YYYY-MM-DD");

          if (!groupedData[date]) {
            data.push({
              label: dayjs(date).format("ddd"),
              income: 0,
              expense: 0,
            });
          } else {
            const item = groupedData?.[date] ?? null;

            data.push({
              income: item?.income ?? 0,
              expense: item?.expense ?? 0,
              label: dayjs(date).format("ddd"),
            });
          }
        }

        return {
          data,
          total: 0,
        };
      }

      if (input.period === EnumPeriod.MONTH) {
        const res = await ctx.db.query.transactions.findMany({
          where: and(
            eq(transactions.authorId, ctx.session.user.id),
            gte(transactions.date, dayjs().subtract(1, "year").toDate()),
            input.type ? eq(transactions.type, input.type) : undefined,
          ),
        });

        // Group by date
        const groupedData = res.reduce(
          (acc, transaction) => {
            const date = dayjs(transaction.date).format("YYYY-MM");

            if (!acc[date]) {
              acc[date] = {
                income: 0,
                expense: 0,
              };
            }

            const item = acc[date];

            acc[date] = {
              income:
                transaction.type === EnumTransaccionType.INCOME
                  ? item.income + transaction.amount
                  : item.income,
              expense:
                transaction.type === EnumTransaccionType.EXPENSE
                  ? item.expense + transaction.amount
                  : item.expense,
            };

            return acc;
          },
          {} as Record<string, { income: number; expense: number }>,
        );

        // Fill missing days

        const monthsYear = 12;
        const currentDate = dayjs();
        const dayStart = currentDate.subtract(1, "year");
        const data: { label: string; income: number; expense: number }[] = [];

        for (let i = 1; i <= monthsYear; i++) {
          const date = dayStart.add(i, "month").format("YYYY-MM");

          if (!groupedData[date]) {
            data.push({
              label: dayjs(date).format("MMM"),
              income: 0,
              expense: 0,
            });
          } else {
            const item = groupedData?.[date] ?? null;

            data.push({
              expense: item?.expense ?? 0,
              income: item?.income ?? 0,
              label: dayjs(date).format("MMM"),
            });
          }
        }

        return {
          data,
          total: 0,
        };
      }

      return { data: [], total: 0 };
    }),
});
