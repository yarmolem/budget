"use client";

import { createChart, ColorType, TimeChartOptions } from "lightweight-charts";
import React, { useEffect, useRef } from "react";
import { useLanguageCtx } from "../providers";
import { currencyUtils } from "@/lib/utils";

interface ChartProps {
  data: { time: string; value: number }[];
  colors?: {
    lineColor?: string;
    textColor?: string;
    areaTopColor?: string;
    areaBottomColor?: string;
    backgroundColor?: string;
  };
}

export const Chart = (props: ChartProps) => {
  const { lng } = useLanguageCtx();

  const {
    data,
    colors: {
      textColor = "white",
      lineColor = "#2962FF",
      areaTopColor = "#2962FF",
      backgroundColor = "transparent",
      areaBottomColor = "rgba(41, 98, 255, 0.28)",
    } = {},
  } = props;

  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const chart = createChart(chartContainerRef.current!, {
      height: 300,
      width: chartContainerRef?.current?.clientWidth,
      grid: {
        horzLines: { visible: false },
        vertLines: { visible: false },
      },
      localization: {
        locale: lng ?? "es",
      },

      layout: {
        textColor,
        background: { type: ColorType.Solid, color: backgroundColor },
      },
    });

    chart.timeScale().fitContent();

    const newSeries = chart.addAreaSeries({
      lineColor,
      topColor: areaTopColor,
      bottomColor: areaBottomColor,
      priceLineVisible: false,
      lastValueVisible: false,
    });

    newSeries.setData(data);

    const handleResize = () => {
      chart.applyOptions({ width: chartContainerRef?.current?.clientWidth });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, [
    data,
    backgroundColor,
    lineColor,
    textColor,
    areaTopColor,
    areaBottomColor,
  ]);

  return <div ref={chartContainerRef} />;
};
