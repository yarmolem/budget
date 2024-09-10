"use client";

import { Fragment, useMemo } from "react";
import { Pie, Cell, Legend, PieChart, ResponsiveContainer } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/use-translation";
import type { ITransaction } from "@/server/db/schema";

interface DashboardCategoriesProps {
  className?: string;
  data?: ITransaction[];
}

/* const data = [
  { name: "Group A", value: 400 },
  { name: "Group B", value: 300 },
  { name: "Group C", value: 300 },
  { name: "Group D", value: 200 },
]; */

/* const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]; */

/* const RADIAN = Math.PI / 180; */

/* interface CustomizedLabelProps {
  cx: number;
  cy: number;
  index: number;
  percent: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
} */

/* const CustomizedLabel = ({
  cx,
  cy,
  percent,
  midAngle,
  innerRadius,
  outerRadius,
}: CustomizedLabelProps) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      dominantBaseline="central"
      textAnchor={x > cx ? "start" : "end"}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
}; */

export function DashboardCategories(props: DashboardCategoriesProps) {
  const { t } = useTranslation("dashboard-page");

  const data = useMemo(() => {
    if (!props?.data) return [];
    const categories = new Map<string, { color: string; amount: number }>();

    props.data.forEach((transaction) => {
      if (!transaction?.category) return;

      const key = transaction.category?.title;
      categories.set(key, {
        color: transaction.category?.color,
        amount: (categories.get(key)?.amount ?? 0) + (transaction?.amount ?? 0),
      });
    });

    return Array.from(categories.entries())
      .map(([key, { amount, color }]) => ({
        name: key,
        value: amount,
        color,
      }))
      .slice(0, 10);
  }, [props?.data]);

  return (
    <Fragment>
      <Card className={cn(props.className)}>
        <CardHeader>
          <CardTitle>{t("categories")}</CardTitle>
        </CardHeader>
        <CardContent className="pl-2">
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                fill="#8884d8"
                dataKey="value"
                outerRadius={80}
                labelLine={false}
                /* label={CustomizedLabel} */
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Legend iconSize={8} layout="horizontal" verticalAlign="bottom" />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </Fragment>
  );
}
