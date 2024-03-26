"use client";

import { Fragment } from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { ReChartsTooltip } from "./recharts-tooltip";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { EnumPeriod } from "@/interface";
import { useTranslation } from "@/hooks/use-translation";

interface DashboardOverviewProps {
  className?: string;
}

export function DashboardOverview(props: DashboardOverviewProps) {
  const { t } = useTranslation("dashboard-page");
  const { data } = api.transactions.getTransactionsHistory.useQuery({
    period: EnumPeriod.MONTH,
  });

  return (
    <Fragment>
      <Card className={cn(props.className)}>
        <CardHeader>
          <CardTitle>{t("transactions")}</CardTitle>
        </CardHeader>
        <CardContent className="pl-2">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data?.data ?? []}>
              <XAxis
                dataKey="label"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `S/ ${value}`}
              />
              <Tooltip
                content={<ReChartsTooltip formattedNumber />}
                cursor={{ fill: "transparent" }}
              />
              <Bar
                dataKey="income"
                fill="currentColor"
                radius={[4, 4, 0, 0]}
                className="fill-green-500"
              />
              <Bar
                dataKey="expense"
                fill="currentColor"
                radius={[4, 4, 0, 0]}
                className="fill-red-500"
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </Fragment>
  );
}
