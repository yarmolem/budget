"use client";

import React, { useMemo, useState } from "react";

import { DashboardKpis } from "@/components/shared/dashboard-kpis";
import { DateRangePicker } from "@/components/shared/date-range-picker";
import { DashboardCategories } from "@/components/shared/dashboard-categories";
import { DashboardTransactionHistory } from "@/components/shared/dashboard-transaction-history";

import { api } from "@/trpc/react";

import type { DateRange } from "react-day-picker";

const DashboardHome = () => {
  const [date, setDate] = useState<DateRange | undefined>(undefined);

  const { data, isLoading } = api.transactions.getAll.useQuery({
    filters: {
      date: useMemo(() => {
        if (date?.from) {
          if (date?.to) return { gte: date.from, lte: date.to };
          return { eq: date.from };
        }

        return undefined;
      }, [date]),
    },
  });

  return (
    <>
      <div className="mb-4 flex flex-col justify-between md:flex-row">
        <h1 className="mb-4 text-3xl font-bold tracking-tight md:mb-0">
          Dashboard
        </h1>
        <DateRangePicker
          value={date}
          onChange={setDate}
          className="md:max-w-[300px]"
        />
      </div>
      <DashboardKpis
        className="mb-4"
        isLoading={isLoading}
        data={data?.data ?? []}
      />
      <div className="grid grid-cols-12 gap-4">
        <DashboardTransactionHistory
          data={data?.data ?? []}
          className="col-span-12 md:col-span-7"
        />
        <DashboardCategories
          data={data?.data ?? []}
          className="col-span-12 md:col-span-5"
        />
      </div>
    </>
  );
};

export default DashboardHome;
