"use client";

import React from "react";
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
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from "../ui/card";

import { api } from "@/trpc/react";
import { cn, currencyUtils } from "@/lib/utils";
import type { EnumPeriod } from "@/server/api/routers/transactions";

type Props = {
  className?: string;
};

const DashboardExpensesHistory = (props: Props) => {
  const { data } = api.transactions.getExpensesHistory.useQuery({
    period: "WEEK" as EnumPeriod,
  });

  return (
    <Card className={cn(props.className)}>
      <CardHeader>
        <CardDescription>Expense History</CardDescription>
        <CardTitle>{currencyUtils.format(data?.total ?? 0)}</CardTitle>
      </CardHeader>
      <CardContent className="h-[27.3rem] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data?.data ?? []}
            margin={{
              left: 12,
              right: 44,
              bottom: 10,
            }}
            className="[&_.recharts-cartesian-axis-tick-value]:fill-gray-500 rtl:[&_.recharts-cartesian-axis.yAxis]:-translate-x-12 [&_.recharts-cartesian-grid-vertical]:opacity-0"
          >
            <defs>
              <linearGradient id="amountCustomer" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#EE0000" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#EE0000" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="8 10" strokeOpacity={0.435} />
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tickMargin={20}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tickMargin={20}
              tickFormatter={(label) => `S/ ${label}`}
            />
            <Tooltip content={<ReChartsTooltip />} />
            <Area
              dataKey="amount"
              stroke="#EE0000"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#amountCustomer)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export { DashboardExpensesHistory };
