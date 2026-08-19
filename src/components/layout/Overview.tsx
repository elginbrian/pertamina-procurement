"use client";

import React from "react";
import { MetricCard } from "@/components/widgets/overview/MetricCard";
import { TrendChartPanel } from "@/components/widgets/overview/TrendChartPanel";
import NextActionsPanel from "@/components/widgets/overview/NextActionsPanel";
import AlertsPanel from "@/components/widgets/overview/AlertsPanel";
import ExpiryPanel from "@/components/widgets/overview/ExpiryPanel";
import { ArrowUpRight, Download, Plus } from "lucide-react";

export function Overview() {
  const metrics = [
    { title: "Total Pengajuan", value: "1,284", subtext: "+12.4% vs bulan lalu", tone: "primary", icon: <ArrowUpRight size={16} /> },
    { title: "Nilai Proyek", value: "Rp 48.9 M", subtext: "+8.6% vs bulan lalu", tone: "success", icon: <ArrowUpRight size={16} /> },
    { title: "Vendor Aktif", value: "326", subtext: "+18 baru bulan ini", tone: "info", icon: <ArrowUpRight size={16} /> },
    { title: "PO Tertunda", value: "24", subtext: "6 butuh review", tone: "warning", icon: <ArrowUpRight size={16} /> },
  ] as const;

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];
  const demandBars = [42, 58, 64, 55, 74, 88, 69];

  return (
    <div className="space-y-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="text-sm font-semibold text-slate-700">Overview Pengadaan</div>
        <div className="flex items-center justify-end gap-2.5 pt-0.5">
          <button
            type="button"
            className="inline-flex items-center justify-center gap-1.5 rounded-[12px] border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <Download size={14} />
            Unduh
          </button>
          <button
            type="button"
            className="inline-flex items-center justify-center gap-1.5 rounded-[12px] bg-[#0a4d8c] px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[#0c6cb2]"
          >
            <Plus size={14} />
            Tambah Pengajuan
          </button>
        </div>
      </div>
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((m) => (
          <div key={m.title} className="h-full">
            <MetricCard {...m} />
          </div>
        ))}
      </section>

      <section className="grid items-stretch gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(300px,0.95fr)]">
        <div className="h-full">
          <TrendChartPanel months={months} demandBars={demandBars} />
        </div>

        <div className="h-full">
          <NextActionsPanel />
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <AlertsPanel />
        <ExpiryPanel />
      </section>
    </div>
  );
}

export default Overview;
