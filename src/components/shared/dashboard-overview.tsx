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
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { cn } from "@/lib/utils";
import { ReChartsTooltip } from "./recharts-tooltip";

const data = [
  {
    name: "Jan",
    income: Math.floor(Math.random() * 5000) + 1000,
    expense: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Feb",
    income: Math.floor(Math.random() * 5000) + 1000,
    expense: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Mar",
    income: Math.floor(Math.random() * 5000) + 1000,
    expense: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Apr",
    income: Math.floor(Math.random() * 5000) + 1000,
    expense: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "May",
    income: Math.floor(Math.random() * 5000) + 1000,
    expense: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Jun",
    income: Math.floor(Math.random() * 5000) + 1000,
    expense: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Jul",
    income: Math.floor(Math.random() * 5000) + 1000,
    expense: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Aug",
    income: Math.floor(Math.random() * 5000) + 1000,
    expense: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Sep",
    income: Math.floor(Math.random() * 5000) + 1000,
    expense: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Oct",
    income: Math.floor(Math.random() * 5000) + 1000,
    expense: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Nov",
    income: Math.floor(Math.random() * 5000) + 1000,
    expense: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Dec",
    income: Math.floor(Math.random() * 5000) + 1000,
    expense: Math.floor(Math.random() * 5000) + 1000,
  },
];

interface DashboardOverviewProps {
  className?: string;
}

export function DashboardOverview(props: DashboardOverviewProps) {
  return (
    <Fragment>
      <Card className={cn(props.className)}>
        <CardHeader>
          <CardTitle>Transactions</CardTitle>
        </CardHeader>
        <CardContent className="pl-2">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data}>
              <XAxis
                dataKey="name"
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
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip
                content={<ReChartsTooltip />}
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
