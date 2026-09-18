"use client";

import { ReactNode } from "react";
import { SidebarProvider, useSidebar } from "@/context/SidebarContext";
import { ProcurementProvider } from "@/context/ProcurementContext";
import { SidebarNav } from "@/components/navigation/SidebarNav";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

function DashboardLayoutInner({ children }: { children: ReactNode }) {
  const { mobileOpen, setMobileOpen } = useSidebar();
  const pathname = usePathname();

  const getHeaderInfo = (path: string) => {
    if (path.includes("documents/upload")) return { title: "Upload Dokumen", subtitle: "Pemeriksaan cerdas dengan sistem PRIMA AI" };
    if (path.includes("documents/result")) return { title: "Hasil Pemeriksaan", subtitle: "Laporan otomatis verifikasi dokumen" };
    if (path.includes("documents")) return { title: "Dokumen", subtitle: "Review, kelengkapan, dan draft" };
    if (path.includes("overview")) return { title: "Pekerjaan", subtitle: "Status, timeline, dan SLA pengadaan" };
    if (path.includes("next-action")) return { title: "Tindakan (Next Action)", subtitle: "Daftar tindakan yang perlu ditangani" };
    if (path.includes("guarantees/upload")) return { title: "Upload Jaminan", subtitle: "Ekstraksi data jaminan cerdas via OCR PRIMA" };
    if (path.includes("guarantees")) return { title: "Jaminan", subtitle: "Status dan masa berlaku jaminan" };
    if (path.includes("notifications")) return { title: "Notifikasi", subtitle: "Pemberitahuan dan update sistem" };
    if (path.includes("settings")) return { title: "Pengaturan", subtitle: "Akses dan pengaturan sistem" };
    
    return { title: "Dashboard", subtitle: "Overview" };
  };

  const header = getHeaderInfo(pathname || "");

  const hideHeaderDesktop = ["/overview", "/documents", "/documents/upload", "/documents/result", "/guarantees", "/guarantees/upload", "/next-action", "/notifications"].some(route => pathname?.endsWith(route));

  return (
    <div className="flex h-screen overflow-hidden bg-[#f4f7fb] text-slate-900">
      <div
        className={cn(
          "fixed inset-0 z-30 bg-slate-900/30 transition-opacity duration-300 lg:hidden",
          mobileOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
      />

      <SidebarNav />

      <div className="flex min-w-0 flex-1 flex-col transition-all duration-300">
        <div className={cn(hideHeaderDesktop ? "lg:hidden" : "block")}>
          <DashboardHeader
            title={header.title}
            subtitle={header.subtitle}
            userLabel="AR"
            onOpenSidebar={() => setMobileOpen(true)}
            onCloseSidebar={() => setMobileOpen(false)}
          />
        </div>

        <main className="scrollbar-thin flex-1 overflow-y-auto px-4 py-3 sm:px-6 sm:py-4 lg:px-7 lg:py-5">
          <div className="animate-page-enter">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <ProcurementProvider>
      <SidebarProvider>
        <DashboardLayoutInner>{children}</DashboardLayoutInner>
      </SidebarProvider>
    </ProcurementProvider>
  );
}
