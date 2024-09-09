"use client";

import React, { useMemo } from "react";
import { Scale, TrendingDown, TrendingUp } from "lucide-react";

import { Skeleton } from "../ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

import { cn, currencyUtils } from "@/lib/utils";
import { EnumTransaccionType } from "@/interface";
import { useTranslation } from "@/hooks/use-translation";

import type { ITransaction } from "@/server/db/schema";

type DashboardKpisProps = {
  className?: string;
  isLoading?: boolean;
  data?: ITransaction[];
};
type KPICardProps = {
  title: string;
  amount?: number;
  icon: (props: React.ComponentProps<"svg">) => React.ReactNode;
};

export const KPICard = ({ title, amount, icon: Icon }: KPICardProps) => (
  <Card className="h-[110px]">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">
        {currencyUtils.format(amount ?? 0)}
      </div>
    </CardContent>
  </Card>
);

export const KPICardSkeleton = () => (
  <Card className="h-[110px]">
    <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0 pb-2">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-6" />
    </CardHeader>
    <CardContent>
      <Skeleton className="h-8 w-full" />
    </CardContent>
  </Card>
);

const DashboardKpis = (props: DashboardKpisProps) => {
  const { t } = useTranslation("dashboard-page");

  const totals = useMemo(() => {
    if (!props?.data) return { income: 0, expense: 0 };

    let income = 0;
    let expense = 0;

    for (const transaction of props?.data ?? []) {
      if (transaction.type === EnumTransaccionType.INCOME) {
        income += transaction.amount;
      } else {
        expense += transaction.amount;
      }
    }

    return { income, expense, balance: income - expense };
  }, [props?.data]);

  return (
    <div className={cn("grid gap-4 md:grid-cols-3", props.className)}>
      {!props.isLoading && (
        <>
          <KPICard
            title={t("total_income")}
            amount={totals.income}
            icon={TrendingUp}
          />
          <KPICard
            title={t("total_expense")}
            amount={totals.expense}
            icon={TrendingDown}
          />
          <KPICard title={t("balance")} amount={totals.balance} icon={Scale} />
        </>
      )}

      {props.isLoading && (
        <>
          <KPICardSkeleton />
          <KPICardSkeleton />
          <KPICardSkeleton />
        </>
      )}
    </div>
  );
};

export { DashboardKpis };
