"use client";

import React from "react";

import { DashboardKpis } from "@/components/shared/dashboard-kpis";
import { DashboardOverview } from "@/components/shared/dashboard-overview";
import { DashboardRecentExpenses } from "@/components/shared/dashboard-recent-expenses";
import { DashboardExpensesHistory } from "@/components/shared/dashboard-expenses-history";

const DashboardHome = () => {
  return (
    <>
      <DashboardKpis className="mb-4" />
      <DashboardOverview className="mb-4" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <DashboardExpensesHistory className="lg:col-span-4" />
        <DashboardRecentExpenses className="lg:col-span-3" />
      </div>
    </>
  );
};

export default DashboardHome;
