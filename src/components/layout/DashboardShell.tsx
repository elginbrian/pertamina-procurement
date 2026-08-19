"use client";

import { useState, useEffect } from "react";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { DashboardToolbar } from "@/components/layout/DashboardToolbar";
import { SidebarNav } from "@/components/navigation/SidebarNav";
import OverviewPage from "@/components/pages/overview/OverviewPage";
import { TasksPage } from "@/components/pages/tasks/TasksPage";
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
    if (!path) return "overview";
    const parts = path.split("/").filter(Boolean);
    const first = parts[0] || "";
    switch (first) {
      case "tasks":
        return "tasks";
      case "items":
        return "items";
      case "calendar":
        return "calendar";
      case "notifications":
        return "notifications";
      case "reports":
        return "reports";
      case "templates":
        return "templates";
      case "audit":
        return "audit";
      case "admin":
        return "admin";
      default:
        return "overview";
    }
  };

  const [selectedTab, setSelectedTab] = useState<string>(() => deriveTabFromPath(pathname));

  useEffect(() => {
    setSelectedTab(deriveTabFromPath(pathname));
  }, [pathname]);

  const headerForTab = (tab: string) => {
    switch (tab) {
      case "overview":
        return { title: "Ringkasan Dashboard", subtitle: "Status dan aktivitas pengadaan" };
      case "tasks":
        return { title: "Tugas", subtitle: "Daftar tugas yang perlu ditangani" };
      case "items":
        return { title: "Barang", subtitle: "Master data barang pengadaan" };
      case "calendar":
        return { title: "Jatuh Tempo", subtitle: "Jadwal dan tenggat penting" };
      case "notifications":
        return { title: "Notifikasi", subtitle: "Pemberitahuan dan update sistem" };
      case "reports":
        return { title: "Laporan", subtitle: "Ringkasan performa dan analitik" };
      case "templates":
        return { title: "Template", subtitle: "Dokumen dan formulir standar" };
      case "audit":
        return { title: "Riwayat", subtitle: "Jejak aktivitas dan perubahan" };
      case "admin":
        return { title: "Pengaturan", subtitle: "Akses dan pengaturan sistem" };
      default:
        return { title: "Ringkasan Dashboard", subtitle: "Status dan aktivitas pengadaan" };
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
        <DashboardHeader
          title={header.title}
          subtitle={header.subtitle}
          userLabel="AR"
          onOpenSidebar={() => setMobileOpen(true)}
          onCloseSidebar={() => setMobileOpen(false)}
        />

        <main className="scrollbar-thin flex-1 overflow-y-auto px-4 py-3 sm:px-6 sm:py-4 lg:px-7 lg:py-5">
          <div key={pathname ?? selectedTab} className="animate-page-enter">
            <DashboardToolbar />

            {selectedTab === "overview" && <OverviewPage />}
            {selectedTab === "tasks" && <TasksPage />}
          </div>
        </main>
      </div>
    </div>
  );
}

export function DashboardShell() {
  return (
    <SidebarProvider>
      <DashboardShellInner />
    </SidebarProvider>
  );
}

export default DashboardShell;
