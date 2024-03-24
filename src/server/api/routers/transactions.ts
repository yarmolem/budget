import { z } from "zod";
import dayjs from "dayjs";
import { randomUUID } from "node:crypto";
import { and, desc, eq, like, sql, gte, lte } from "drizzle-orm";

import {
  transactions,
  EnumTransaccionType,
  EnumTransaccionMethod,
  tagsOnTransactions,
} from "@/server/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export enum EnumPeriod {
  WEEK = "WEEK",
  MONTH = "MONTH",
  YEAR = "YEAR",
}

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

    const currentMonthTransactions = data.filter(({ date }) => {
      return dayjs(date).month() === dayjs().month();
    });

    const previousMonthTransactions = data.filter(({ date }) => {
      return dayjs(date).month() === dayjs().subtract(1, "month").month();
    });

    const currentMonthIncome = currentMonthTransactions.reduce(
      (acc, transaction) => {
        if (transaction.type === EnumTransaccionType.INCOME) {
          return acc + transaction.amount;
        }

        return acc;
      },
      0,
    );

    const currentMonthExpenses = currentMonthTransactions.reduce(
      (acc, transaction) => {
        if (transaction.type === EnumTransaccionType.EXPENSE) {
          return acc + transaction.amount;
        }

        return acc;
      },
      0,
    );

    const previousMonthIncome = previousMonthTransactions.reduce(
      (acc, transaction) => {
        if (transaction.type === EnumTransaccionType.INCOME) {
          return acc + transaction.amount;
        }

        return acc;
      },
      0,
    );

    const previousMonthExpenses = previousMonthTransactions.reduce(
      (acc, transaction) => {
        if (transaction.type === EnumTransaccionType.EXPENSE) {
          return acc + transaction.amount;
        }

        return acc;
      },
      0,
    );

    const recordCategoryExpenses = currentMonthTransactions.reduce(
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

    const percentageIncomeDifference =
      (currentMonthIncome - previousMonthIncome * 100) /
      (previousMonthIncome === 0 ? 1 : previousMonthIncome);

    const percentageExpensesDifference =
      (currentMonthExpenses - previousMonthExpenses * 100) /
      (previousMonthExpenses === 0 ? 1 : previousMonthExpenses);

    return {
      totalIncome: currentMonthIncome,
      totalExpenses: currentMonthExpenses,
      percentageIncomeDifference,
      percentageExpensesDifference,
      mostExpensiveCategory,
    };
  }),
  getExpensesHistory: protectedProcedure
    .input(
      z.object({
        period: z.nativeEnum(EnumPeriod).default(EnumPeriod.WEEK),
      }),
    )
    .query(async ({ ctx, input }) => {
      if (input.period === EnumPeriod.WEEK) {
        const res = await ctx.db.query.transactions.findMany({
          where: and(
            eq(transactions.authorId, ctx.session.user.id),
            eq(transactions.type, EnumTransaccionType.EXPENSE),
            gte(transactions.date, dayjs().subtract(7, "days").toDate()),
          ),
        });

        // Group by date
        const groupedData = res.reduce(
          (acc, transaction) => {
            const date = dayjs(transaction.date).format("YYYY-MM-DD");

            if (!acc[date]) {
              acc[date] = 0;
            }

            acc[date] += transaction.amount;

            return acc;
          },
          {} as Record<string, number>,
        );

        // Fill missing days
        let total = 0;
        const data: { label: string; amount: number }[] = [];
        const currentDate = dayjs();
        const weekDays = 7;
        const dayStart = currentDate.subtract(7, "days");

        for (let i = 1; i <= weekDays; i++) {
          const date = dayStart.add(i, "day").format("YYYY-MM-DD");

          if (!groupedData[date]) {
            data.push({ label: dayjs(date).format("ddd"), amount: 0 });
          } else {
            const amount = groupedData?.[date] ?? 0;
            total += amount;

            data.push({ amount, label: dayjs(date).format("ddd") });
          }
        }

        return {
          data,
          total,
        };
      }

      if (input.period === EnumPeriod.MONTH) {
        const res = await ctx.db.query.transactions.findMany({
          where: and(
            eq(transactions.authorId, ctx.session.user.id),
            eq(transactions.type, EnumTransaccionType.EXPENSE),
            gte(transactions.date, dayjs().subtract(1, "year").toDate()),
          ),
        });

        // Group by date
        const groupedData = res.reduce(
          (acc, transaction) => {
            const date = dayjs(transaction.date).format("YYYY-MM");

            if (!acc[date]) {
              acc[date] = 0;
            }

            acc[date] += transaction.amount;

            return acc;
          },
          {} as Record<string, number>,
        );

        // Fill missing days
        let total = 0;
        const data: { label: string; amount: number }[] = [];
        const monthsYear = 12;
        const currentDate = dayjs();
        const dayStart = currentDate.subtract(1, "year");

        for (let i = 1; i <= monthsYear; i++) {
          const date = dayStart.add(i, "month").format("YYYY-MM");

          if (!groupedData[date]) {
            data.push({ label: dayjs(date).format("mmm"), amount: 0 });
          } else {
            const amount = groupedData?.[date] ?? 0;
            total += amount;

            data.push({ amount, label: dayjs(date).format("mmm") });
          }
        }

        return {
          data,
          total,
        };
      }

      return { data: [], total: 0 };
    }),
});
