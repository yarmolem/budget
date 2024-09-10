"use client";

import React, { useMemo } from "react";
import {
  Area,
  YAxis,
  XAxis,
  Tooltip,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

import { ReChartsTooltip } from "./recharts-tooltip";
import { Card, CardTitle, CardHeader, CardContent } from "../ui/card";

import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/use-translation";

import type { ITransaction } from "@/server/db/schema";
import dayjs from "dayjs";
import { EnumTransaccionType } from "@/interface";

type HistoryData = {
  label: string;
  income: number;
  expense: number;
};

type Props = {
  className?: string;
  data: ITransaction[];
};

const DashboardTransactionHistory = (props: Props) => {
  const { t } = useTranslation("dashboard-page");

  const data = useMemo(() => {
    if (!props?.data) return [];

    const record: Record<string, HistoryData> = {};

    for (const item of props?.data ?? []) {
      const key = dayjs(item.date).format("DD/MM/YYYY");

      if (!record[key]) {
        record[key] = {
          label: key,
          income: 0,
          expense: 0,
        };
      }

      if (item.type === EnumTransaccionType.INCOME) {
        record[key] = {
          ...record[key],
          income: (record?.[key]?.income ?? 0) + item.amount,
        };
      } else {
        record[key] = {
          ...record[key],
          expense: (record?.[key]?.expense ?? 0) + item.amount,
        };
      }
    }

    return Object.values(record);
  }, [props?.data]);

  return (
    <Card className={cn(props.className)}>
      <CardHeader>
        <CardTitle>{t("expense_history")}</CardTitle>
      </CardHeader>
      <CardContent className="h-[27.3rem] w-full">
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart
            data={data ?? []}
            margin={{ left: 12, right: 0, bottom: 12 }}
            className="[&_.recharts-cartesian-axis-tick-value]:fill-gray-500 rtl:[&_.recharts-cartesian-axis.yAxis]:-translate-x-12 [&_.recharts-cartesian-grid-vertical]:opacity-0"
          >
            <defs>
              <linearGradient id="expenseAmount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#EE0000" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#EE0000" stopOpacity={0} />
              </linearGradient>
            </defs>
            <defs>
              <linearGradient id="incomeAmount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2ec4b6" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#2ec4b6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="8 10" strokeOpacity={0.435} />
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tickMargin={20}
              fontSize={14}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tickMargin={20}
              fontSize={14}
              tickFormatter={(label) => `S/ ${label}`}
            />
            <Tooltip content={<ReChartsTooltip formattedNumber />} />
            <Area
              dataKey="expense"
              stroke="#EE0000"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#expenseAmount)"
            />
            <Area
              dataKey="income"
              stroke="#2ec4b6"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#incomeAmount)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export { DashboardTransactionHistory };
