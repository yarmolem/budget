"use client";

import { Fragment } from "react";
import { Card, CardTitle, CardHeader, CardContent } from "../ui/card";
import { cn, currencyUtils } from "@/lib/utils";
import { api } from "@/trpc/react";
import { EnumTransaccionType } from "@/interface";
import { useTranslation } from "@/hooks/use-translation";

interface DashboardRecentExpensesProps {
  className?: string;
}

export function DashboardRecentExpenses(props: DashboardRecentExpensesProps) {
  const { t } = useTranslation("dashboard-page");
  const { data } = api.transactions.getAll.useQuery({
    pagination: { page: 1, pageSize: 6 },
  });

  return (
    <Fragment>
      <Card className={cn(props.className)}>
        <CardHeader>
          <CardTitle>{t("recent_transactions")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {data?.data.map((transaction) => (
              <div key={transaction.id} className="flex items-center">
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {transaction.description}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {transaction?.category?.title}
                  </p>
                </div>
                <div className="ml-auto font-medium">
                  {transaction.type === EnumTransaccionType.EXPENSE ? "-" : "+"}
                  {currencyUtils.format(transaction.amount)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </Fragment>
  );
}
