"use client";

import type { ReactNode } from "react";

type MetricCardProps = {
  title: string;
  value: string;
  subtext: string;
  tone: "primary" | "success" | "info" | "warning";
  icon: ReactNode;
};

export function MetricCard({ title, value, subtext, tone, icon }: MetricCardProps) {
  const toneClasses = {
    primary: "bg-[#ecf5ff] text-[#0a4d8c]",
    success: "bg-emerald-100 text-emerald-700",
    info: "bg-sky-100 text-sky-700",
    warning: "bg-amber-100 text-amber-700",
  } as const;

  return (
    <div className="h-full rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-2">
        <span className="text-sm font-medium text-slate-600">{title}</span>
        <span className={`rounded-xl p-2 ${toneClasses[tone]}`}>{icon}</span>
      </div>
      <div className="text-2xl font-bold tracking-tight text-slate-900">{value}</div>
      <div className="mt-2 text-xs text-slate-500">{subtext}</div>
    </div>
  );
}

export default MetricCard;
