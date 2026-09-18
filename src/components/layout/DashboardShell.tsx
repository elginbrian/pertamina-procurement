"use client";

import { Suspense } from "react";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { SidebarNav } from "@/components/navigation/SidebarNav";
import TrackerPage from "@/components/pages/tracker/TrackerPage";
import DocumentsPage from "@/components/pages/documents/DocumentsPage";
import GuaranteesPage from "@/components/pages/guarantees/GuaranteesPage";
import NextActionPage from "@/components/pages/next-action/NextActionPage";
import NotificationsPage from "@/components/pages/notifications/NotificationsPage";
import DocumentUploadPage from "@/components/pages/documents/DocumentUploadPage";
import DocumentResultPage from "@/components/pages/documents/DocumentResultPage";
import GuaranteeUploadPage from "@/components/pages/guarantees/GuaranteeUploadPage";
import SettingsPage from "@/components/pages/settings/SettingsPage";
import { ProcurementProvider } from "@/context/ProcurementContext";

import { SidebarProvider, useSidebar } from "@/context/SidebarContext";

function DashboardShellInner({ routeSegments }: { routeSegments: string[] }) {
  const { mobileOpen, setMobileOpen, collapsed } = useSidebar();

  const deriveTabFromRoute = (segments: string[]) => {
    const [first = "overview", second] = segments;
    switch (first) {
      case "overview":
        return "overview";
      case "next-action":
        return "next-action";
      case "documents":
        if (second === "upload") return "documents/upload";
        if (second === "result") return "documents/result";
        return "documents";
      case "guarantees":
        if (second === "upload") return "guarantees/upload";
        return "guarantees";
      case "notifications":
        return "notifications";
      case "settings":
        return "settings";
      default:
        return "overview";
    }
  };

  // Params route diberikan oleh App Router, sehingga sidebar dan konten
  // selalu memakai sumber state yang sama pada setiap navigasi.
  const selectedTab = deriveTabFromRoute(routeSegments);

  const headerForTab = (tab: string) => {
    switch (tab) {
      case "overview":
        return { title: "Pekerjaan", subtitle: "Status, timeline, dan SLA pengadaan" };
      case "next-action":
        return { title: "Tindakan (Next Action)", subtitle: "Daftar tindakan yang perlu ditangani" };
      case "documents":
        return { title: "Dokumen", subtitle: "Review, kelengkapan, dan draft" };
      case "documents/upload":
        return { title: "Upload Dokumen", subtitle: "Pemeriksaan cerdas dengan sistem PRIMA AI" };
      case "documents/result":
        return { title: "Hasil Pemeriksaan", subtitle: "Laporan otomatis verifikasi dokumen" };
      case "guarantees":
        return { title: "Jaminan", subtitle: "Status dan masa berlaku jaminan" };
      case "guarantees/upload":
        return { title: "Upload Jaminan", subtitle: "Ekstraksi data jaminan cerdas via OCR PRIMA" };
      case "notifications":
        return { title: "Notifikasi", subtitle: "Pemberitahuan dan update sistem" };
      case "settings":
        return { title: "Pengaturan", subtitle: "Akses dan pengaturan sistem" };
      default:
        return { title: "Dokumen", subtitle: "Kesiapan dokumen dan antrean review" };
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

      <SidebarNav activeKey={selectedTab.split("/")[0]} />

        <div className={`flex min-w-0 flex-1 flex-col transition-all duration-300`}>
        <div className={["overview", "documents", "documents/upload", "documents/result", "guarantees", "guarantees/upload", "next-action", "notifications"].includes(selectedTab) ? "lg:hidden" : "block"}>
          <DashboardHeader
            title={header.title}
            subtitle={header.subtitle}
            userLabel="AR"
            onOpenSidebar={() => setMobileOpen(true)}
            onCloseSidebar={() => setMobileOpen(false)}
          />
        </div>

        <main className="scrollbar-thin flex-1 overflow-y-auto px-4 py-3 sm:px-6 sm:py-4 lg:px-7 lg:py-5">
          <div key={routeSegments.join("/")} className="animate-page-enter">

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
            {selectedTab === "guarantees/upload" && (
              <Suspense fallback={<div className="rounded-xl border border-slate-200 bg-white p-8 text-sm text-slate-500">Memuat formulir jaminan...</div>}>
                <GuaranteeUploadPage />
              </Suspense>
            )}
            {selectedTab === "notifications" && <NotificationsPage />}
            {selectedTab === "settings" && <SettingsPage />}
          </div>
        </main>
      </div>
    </div>
  );
}

export function DashboardShell({ routeSegments = ["overview"] }: { routeSegments?: string[] }) {
  return (
    <ProcurementProvider>
      <SidebarProvider>
        <DashboardShellInner routeSegments={routeSegments} />
      </SidebarProvider>
    </ProcurementProvider>
  );
}

export default DashboardShell;
