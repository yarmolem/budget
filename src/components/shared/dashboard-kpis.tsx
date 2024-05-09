"use client";

import React from "react";
import { cn, currencyUtils } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { api } from "@/trpc/react";
import { Scale, TrendingDown, TrendingUp } from "lucide-react";
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
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {currencyUtils.format(data?.totalIncome ?? 0)}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {t("total_expense")}
          </CardTitle>
          <TrendingDown className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {currencyUtils.format(data?.totalExpenses ?? 0)}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{t("balance")}</CardTitle>
          <Scale className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {currencyUtils.format(data?.mostExpensiveCategory?.amount ?? 0)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export { DashboardKpis };
