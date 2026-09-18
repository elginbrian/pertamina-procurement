import type { ReactNode } from "react";

export type MetricCardProps = {
  title: string;
  value: string;
  subtext: string;
  tone: "primary" | "success" | "info" | "warning";
  icon: ReactNode;
};

export type TrendChartPanelProps = {
  months: string[];
  demandBars: number[];
};
