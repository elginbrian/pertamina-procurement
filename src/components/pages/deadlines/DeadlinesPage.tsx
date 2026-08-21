"use client";

import { useState, useMemo, useEffect } from "react";
import { Clock } from "lucide-react";
import { DeadlineItem, DeadlineStatus } from "./types";
import { DeadlineFilterBar } from "@/components/widgets/deadlines/DeadlineFilterBar";
import { DeadlineRow } from "@/components/widgets/deadlines/DeadlineRow";
import { TablePagination } from "@/components/widgets/TablePagination";

const mockDeadlines: DeadlineItem[] = [
  {
    id: "DL-001",
    taskName: "Klarifikasi Teknis Vendor",
    relatedId: "REQ-2026-101",
    pic: "Budi Santoso",
    department: "IT Infrastructure",
    targetDate: "2026-08-25",
    daysRemaining: 5,
    status: "On Track",
    urgencyLevel: "Low",
    milestone: "Evaluasi Teknis",
    nextAction: "Hubungi vendor terkait untuk memastikan kelengkapan dokumen teknis server.",
  },
  {
    id: "DL-002",
    taskName: "Persetujuan RAB",
    relatedId: "REQ-2026-103",
    pic: "Citra Dewi",
    department: "General Affairs",
    targetDate: "2026-08-21",
    daysRemaining: 1,
    status: "At Risk",
    urgencyLevel: "High",
    milestone: "Proses CS30",
    nextAction: "SLA persetujuan hampir habis. Segera minta *approval* dari VP General Affairs.",
  },
  {
    id: "DL-003",
    taskName: "Negosiasi Harga",
    relatedId: "REQ-2026-102",
    pic: "Andi Wijaya",
    department: "Creative",
    targetDate: "2026-08-15",
    daysRemaining: -5,
    status: "Overdue",
    urgencyLevel: "Critical",
    milestone: "Negosiasi & Klarifikasi",
    nextAction: "Negosiasi melewati batas SLA 5 hari. Lakukan eskalasi atau jadwalkan ulang *meeting* negosiasi final secepatnya.",
  },
  ...Array.from({ length: 15 }).map((_, i) => ({
    id: `DL-2026-00${i + 4}`,
    taskName: i % 2 === 0 ? "Review Legal" : "Penerbitan PO",
    relatedId: `REQ-2026-20${i}`,
    pic: `Staff ${i + 1}`,
    department: i % 3 === 0 ? "HR" : "Operations",
    targetDate: `2026-08-${(10 + i * 2) % 30 + 1}`,
    daysRemaining: (i % 4 === 0 ? -2 : i % 3 === 0 ? 2 : 10 + i),
    status: (i % 4 === 0 ? "Overdue" : i % 3 === 0 ? "At Risk" : "On Track") as DeadlineStatus,
    urgencyLevel: (i % 4 === 0 ? "Critical" : i % 3 === 0 ? "High" : "Medium") as "Low" | "Medium" | "High" | "Critical",
    milestone: i % 2 === 0 ? "Legal Drafting" : "Pembuatan PO",
    nextAction: i % 4 === 0 ? "SLA terlewati. Lakukan percepatan." : "Pantau progres secara berkala."
  }))
];

export default function DeadlinesPage() {
  const [deadlines] = useState<DeadlineItem[]>(mockDeadlines);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<DeadlineStatus | "All">("All");
  const [urgencyFilter, setUrgencyFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const onTrackCount = deadlines.filter(d => d.status === "On Track").length;
  const atRiskCount = deadlines.filter(d => d.status === "At Risk").length;
  const overdueCount = deadlines.filter(d => d.status === "Overdue").length;
  const totalCount = deadlines.length;
  
  const onTrackPct = totalCount ? (onTrackCount / totalCount) * 100 : 0;
  const atRiskPct = totalCount ? (atRiskCount / totalCount) * 100 : 0;

  // Reset pagination on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, urgencyFilter]);

  const filteredDeadlines = useMemo(() => {
    return deadlines.filter((item) => {
      const matchesSearch = item.relatedId.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.pic.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.taskName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "All" || item.status === statusFilter;
      const matchesUrgency = urgencyFilter === "All" || item.urgencyLevel === urgencyFilter;
      
      return matchesSearch && matchesStatus && matchesUrgency;
    });
  }, [deadlines, searchQuery, statusFilter, urgencyFilter]);

  const totalPages = Math.ceil(filteredDeadlines.length / itemsPerPage);
  
  const paginatedDeadlines = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredDeadlines.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredDeadlines, currentPage]);

  return (
    <div className="space-y-6 pb-12">
      {/* Statistics Header */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
        {/* Total Monitored */}
        <div className="p-5 flex-1 flex items-center justify-between">
          <div>
            <div className="text-[13px] font-medium text-slate-500 mb-1 uppercase tracking-wider">Total SLA</div>
            <div className="text-3xl font-black text-[#0a4d8c]">{totalCount}</div>
            <div className="text-[11px] text-slate-400 mt-1 font-medium">Tugas dalam pemantauan</div>
          </div>
          <div className="w-14 h-14 rounded-full relative shadow-[inset_0_2px_8px_rgba(0,0,0,0.06)]" style={{
            background: `conic-gradient(#10b981 0% ${onTrackPct}%, #f59e0b ${onTrackPct}% ${onTrackPct + atRiskPct}%, #ef4444 ${onTrackPct + atRiskPct}% 100%)`
          }}>
            <div className="absolute inset-2 bg-white rounded-full"></div>
          </div>
        </div>

        {/* On Track */}
        <div className="p-5 flex-1">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-[13px] font-medium text-slate-500 mb-1 flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                Aman (On Track)
              </div>
              <div className="text-2xl font-bold text-slate-800 mt-2">{onTrackCount}</div>
            </div>
            <div className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2 py-1 rounded-md border border-emerald-100">
              {onTrackPct.toFixed(0)}%
            </div>
          </div>
          <div className="text-[11px] text-slate-400 mt-1 font-medium">Sesuai jadwal SLA</div>
        </div>

        {/* At Risk */}
        <div className="p-5 flex-1">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-[13px] font-medium text-slate-500 mb-1 flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                Berisiko (At Risk)
              </div>
              <div className="text-2xl font-bold text-slate-800 mt-2">{atRiskCount}</div>
            </div>
            <div className="bg-amber-50 text-amber-700 text-xs font-bold px-2 py-1 rounded-md border border-amber-100">
              {atRiskPct.toFixed(0)}%
            </div>
          </div>
          <div className="text-[11px] text-slate-400 mt-1 font-medium">Mendekati batas waktu</div>
        </div>

        {/* Overdue */}
        <div className="p-5 flex-1">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-[13px] font-medium text-slate-500 mb-1 flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                Terlambat (Overdue)
              </div>
              <div className="text-2xl font-bold text-slate-800 mt-2">{overdueCount}</div>
            </div>
            <div className="bg-red-50 text-red-700 text-xs font-bold px-2 py-1 rounded-md border border-red-100">
              {(100 - onTrackPct - atRiskPct).toFixed(0)}%
            </div>
          </div>
          <div className="text-[11px] text-slate-400 mt-1 font-medium">SLA telah terlewati</div>
        </div>
      </div>

      {/* Search and Filter */}
      <DeadlineFilterBar 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        urgencyFilter={urgencyFilter}
        setUrgencyFilter={setUrgencyFilter}
      />

      {/* Deadlines List (Table Layout) */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="px-4 py-3">Tugas & ID Ref</th>
                <th className="px-4 py-3">Milestone & Urgensi</th>
                <th className="px-4 py-3">PIC / Dept</th>
                <th className="px-4 py-3">Jatuh Tempo</th>
                <th className="px-4 py-3">Status SLA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {paginatedDeadlines.length > 0 ? (
                paginatedDeadlines.map((item) => (
                  <DeadlineRow key={item.id} item={item} />
                ))
              ) : (
                <tr>
                  <td colSpan={6}>
                    <div className="flex flex-col items-center justify-center p-12 text-slate-500">
                      <Clock size={48} className="text-slate-300 mb-4" />
                      <p className="text-lg font-medium text-slate-700">Tugas tidak ditemukan</p>
                      <p className="text-sm">Coba ubah kata kunci pencarian atau filter.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          
          <TablePagination 
            currentPage={currentPage}
            totalPages={Math.max(totalPages, 1)}
            totalItems={filteredDeadlines.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={setItemsPerPage}
            itemName="tugas"
          />
        </div>
      </div>
    </div>
  );
}
