"use client";

import React from "react";
import { cn, currencyUtils } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { api } from "@/trpc/react";
import { EuroIcon } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";

type Props = {
  className?: string;
};

const DashboardKpis = (props: Props) => {
  const { t } = useTranslation("dashboard-page");
  const { data } = api.transactions.getKpis.useQuery();

  return (
    <div className={cn("grid gap-4 md:grid-cols-3", props.className)}>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {t("total_income")}
          </CardTitle>
          <EuroIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {currencyUtils.format(data?.totalIncome ?? 0)}
          </div>
          <p className="text-xs text-muted-foreground">
            {(data?.percentageIncomeDifference ?? 0) >= 0 ? "+" : "-"}
            {(data?.percentageIncomeDifference ?? 0).toFixed(1)}%{" "}
            {t("from_last_month")}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {t("total_expense")}
          </CardTitle>
          <EuroIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {currencyUtils.format(data?.totalExpenses ?? 0)}
          </div>
          <p className="text-xs text-muted-foreground">
            {(data?.percentageExpensesDifference ?? 0) >= 0 ? "+" : "-"}
            {(data?.percentageExpensesDifference ?? 0).toFixed(1)}%{" "}
            {t("from_last_month")}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {t("most_expensive_category")}
          </CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <rect width="20" height="14" x="2" y="5" rx="2" />
            <path d="M2 10h20" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {currencyUtils.format(data?.mostExpensiveCategory?.amount ?? 0)}
          </div>
          <p className="text-xs text-muted-foreground">
            {data?.mostExpensiveCategory?.title ?? ""}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export { DashboardKpis };
