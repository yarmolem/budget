"use client";

import React from "react";

import { DashboardKpis } from "@/components/shared/dashboard-kpis";
import { DashboardOverview } from "@/components/shared/dashboard-overview";
import { DateRangePicker } from "@/components/shared/date-range-picker";

const DashboardHome = () => {
  return (
    <>
      <div className="mb-4 flex flex-col justify-between md:flex-row">
        <h1 className="mb-4 text-3xl font-bold tracking-tight md:mb-0">
          Dashboard
        </h1>
        <DateRangePicker className="md:max-w-[300px]" />
      </div>
      <DashboardKpis className="mb-4" />
      <DashboardOverview />
    </>
  );
};

export default DashboardHome;
