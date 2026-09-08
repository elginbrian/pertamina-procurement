"use client";

import { useState, useEffect, Suspense } from "react";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { DashboardToolbar } from "@/components/layout/DashboardToolbar";
import { SidebarNav } from "@/components/navigation/SidebarNav";
import TrackerPage from "@/components/pages/tracker/TrackerPage";
import DocumentsPage from "@/components/pages/documents/DocumentsPage";
import GuaranteesPage from "@/components/pages/guarantees/GuaranteesPage";
import DeadlinesPage from "@/components/pages/deadlines/DeadlinesPage";
import NextActionPage from "@/components/pages/next-action/NextActionPage";
import NotificationsPage from "@/components/pages/notifications/NotificationsPage";
import DocumentUploadPage from "@/components/pages/documents/DocumentUploadPage";
import DocumentResultPage from "@/components/pages/documents/DocumentResultPage";
import GuaranteeUploadPage from "@/components/pages/guarantees/GuaranteeUploadPage";
import SettingsPage from "@/components/pages/settings/SettingsPage";
import { ProcurementProvider } from "@/context/ProcurementContext";

import { SidebarProvider, useSidebar } from "@/context/SidebarContext";

type ProcurementRow = {
  no: string;
  item: string;
  vendor: string;
  amount: string;
  status: string;
  badge: "approved" | "pending" | "review" | "rejected";
};

const rows: ProcurementRow[] = [
  { no: "PR-2041", item: "Laptop Pro 14", vendor: "PT Teknologi Prima", amount: "Rp 44.0 Jt", status: "Disetujui", badge: "approved" },
  { no: "PR-2048", item: "Server Rack 42U", vendor: "CV Infra Digital", amount: "Rp 118.0 Jt", status: "Dalam Proses", badge: "pending" },
  { no: "PR-2052", item: "Tablet Field Ops", vendor: "PT Global Worktech", amount: "Rp 29.5 Jt", status: "Review", badge: "review" },
  { no: "PR-2057", item: "UPS 20KVA", vendor: "PT Energi Lestari", amount: "Rp 66.2 Jt", status: "Ditolak", badge: "rejected" },
];

const approvals: { title: string; owner: string; time: string }[] = [];

import { usePathname } from "next/navigation";

function DashboardShellInner() {
  const { mobileOpen, setMobileOpen, collapsed } = useSidebar();
  const pathname = usePathname();

  const deriveTabFromPath = (path?: string) => {
    if (!path) return "documents";
    const parts = path.split("/").filter(Boolean);
    const first = parts[0] || "";
    switch (first) {
      case "overview":
        return "overview";
      case "next-action":
        return "next-action";
      case "documents":
        if (path.includes("upload")) return "documents/upload";
        if (path.includes("result")) return "documents/result";
        return "documents";
      case "guarantees":
        if (path.includes("upload")) return "guarantees/upload";
        return "guarantees";
      case "deadlines":
        return "deadlines";
      case "notifications":
        return "notifications";
      case "settings":
        return "settings";
      default:
        return "documents";
    }
  };

  const [selectedTab, setSelectedTab] = useState<string>(() => deriveTabFromPath(pathname));

  useEffect(() => {
    setSelectedTab(deriveTabFromPath(pathname));
  }, [pathname]);

  const headerForTab = (tab: string) => {
    switch (tab) {
      case "overview":
        return { title: "Tracker Dokumen & Item", subtitle: "Status keseluruhan pengadaan (D3)" };
      case "next-action":
        return { title: "Tindakan (Next Action)", subtitle: "Daftar tindakan yang perlu ditangani" };
      case "documents":
        return { title: "Pemeriksaan Dokumen", subtitle: "Review, kelengkapan, dan draft (D1)" };
      case "documents/upload":
        return { title: "Upload Dokumen (D1)", subtitle: "Pemeriksaan cerdas dengan sistem PRIMA AI" };
      case "documents/result":
        return { title: "Hasil Pemeriksaan (D1)", subtitle: "Laporan otomatis verifikasi dokumen" };
      case "guarantees":
        return { title: "Pantau Jaminan", subtitle: "Status dan masa berlaku jaminan (D2)" };
      case "guarantees/upload":
        return { title: "Upload Jaminan (D2)", subtitle: "Ekstraksi data jaminan cerdas via OCR PRIMA" };
      case "deadlines":
        return { title: "Jatuh Tempo", subtitle: "SLA timer dan pengingat batas waktu (D4)" };
      case "notifications":
        return { title: "Notifikasi", subtitle: "Pemberitahuan dan update sistem" };
      case "settings":
        return { title: "Pengaturan", subtitle: "Akses dan pengaturan sistem" };
      default:
        return { title: "Pemeriksaan Dokumen", subtitle: "Kesiapan dokumen dan antrean review (D1)" };
    }
  };

  const header = headerForTab(selectedTab);

  return (
    <div className="flex h-screen overflow-hidden bg-[#f4f7fb] text-slate-900">
      <div
        className={`fixed inset-0 z-30 bg-slate-900/30 transition-opacity duration-300 lg:hidden ${mobileOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
      />

      {/* SidebarNav derives active state from the URL; do not force a selectedKey from local state */}
      <SidebarNav onSelect={(k) => setSelectedTab(k)} />

        <div className={`flex min-w-0 flex-1 flex-col transition-all duration-300`}>
        <div className={["overview", "documents", "documents/upload", "documents/result", "guarantees", "guarantees/upload", "deadlines", "next-action", "notifications"].includes(selectedTab) ? "lg:hidden" : "block"}>
          <DashboardHeader
            title={header.title}
            subtitle={header.subtitle}
            userLabel="AR"
            onOpenSidebar={() => setMobileOpen(true)}
            onCloseSidebar={() => setMobileOpen(false)}
          />
        </div>

        <main className="scrollbar-thin flex-1 overflow-y-auto px-4 py-3 sm:px-6 sm:py-4 lg:px-7 lg:py-5">
          <div key={pathname ?? selectedTab} className="animate-page-enter">

            {selectedTab === "overview" && <TrackerPage />}
            {selectedTab === "next-action" && <NextActionPage />}
            {selectedTab === "documents" && <DocumentsPage />}
            {selectedTab === "documents/upload" && <DocumentUploadPage />}
            {selectedTab === "documents/result" && (
              <Suspense fallback={<div className="rounded-xl border border-slate-200 bg-white p-8 text-sm text-slate-500">Memuat hasil pemeriksaan...</div>}>
                <DocumentResultPage />
              </Suspense>
            )}
            {selectedTab === "guarantees" && <GuaranteesPage />}
            {selectedTab === "guarantees/upload" && <GuaranteeUploadPage />}
            {selectedTab === "deadlines" && <DeadlinesPage />}
            {selectedTab === "notifications" && <NotificationsPage />}
            {selectedTab === "settings" && <SettingsPage />}
          </div>
        </main>
      </div>
    </div>
  );
}

export function DashboardShell() {
  return (
    <ProcurementProvider>
      <SidebarProvider>
        <DashboardShellInner />
      </SidebarProvider>
    </ProcurementProvider>
  );
}

export default DashboardShell;
