"use client";

import { useState, useMemo, useEffect } from "react";
import { Inbox } from "lucide-react";
import { GuaranteeItem, GuaranteeStatus } from "./types";
import { GuaranteeFilterBar } from "@/components/widgets/guarantees/GuaranteeFilterBar";
import { GuaranteeRow } from "@/components/widgets/guarantees/GuaranteeRow";
import { TablePagination } from "@/components/widgets/TablePagination";

const mockGuarantees: GuaranteeItem[] = [
  {
    id: "GUAR-001",
    referenceNo: "BG-2026-089912",
    type: "Jaminan Pelaksanaan",
    value: "Rp 150.000.000",
    issueDate: "2026-01-10",
    expiryDate: "2026-12-31",
    remainingDays: 134,
    pic: "Budi Santoso",
    status: "Aktif",
  },
  {
    id: "GUAR-002",
    referenceNo: "BG-2026-078122",
    type: "Jaminan Masa Pemeliharaan",
    value: "Rp 45.000.000",
    issueDate: "2025-08-20",
    expiryDate: "2026-08-25",
    remainingDays: 6,
    pic: "Andi Wijaya",
    status: "Mendekati Expiry",
    nextAction: "Jaminan Masa Pemeliharaan akan berakhir dalam 6 hari. Koordinasikan perpanjangan atau pencairan dengan pihak vendor terkait."
  },
  {
    id: "GUAR-003",
    referenceNo: "BG-2025-011234",
    type: "Jaminan Uang Muka",
    value: "Rp 300.000.000",
    issueDate: "2025-02-15",
    expiryDate: "2026-08-15",
    remainingDays: -4,
    pic: "Citra Dewi",
    status: "Expired",
    nextAction: "Jaminan telah kedaluwarsa. Segera hubungi bank penerbit dan vendor untuk tindak lanjut penyelesaian."
  },
  ...Array.from({ length: 12 }).map((_, i) => ({
    id: `GUAR-00${i + 4}`,
    referenceNo: `BG-2026-10${100 + i}`,
    type: i % 2 === 0 ? "Jaminan Pelaksanaan" : "Jaminan Uang Muka",
    value: `Rp ${(i + 1) * 20}.000.000`,
    issueDate: `2026-01-0${(i % 9) + 1}`,
    expiryDate: `2026-12-${10 + i}`,
    remainingDays: 90 + i,
    pic: `Staff ${i + 1}`,
    status: (i % 5 === 0 ? "Expired" : i % 3 === 0 ? "Mendekati Expiry" : "Aktif") as GuaranteeStatus,
    nextAction: i % 5 === 0 ? "Tindaklanjuti jaminan expired" : i % 3 === 0 ? "Koordinasikan perpanjangan" : ""
  }))
];

export default function GuaranteesPage() {
  const [guarantees] = useState<GuaranteeItem[]>(mockGuarantees);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<GuaranteeStatus | "All">("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const aktifCount = guarantees.filter(d => d.status === "Aktif").length;
  const mendekatiCount = guarantees.filter(d => d.status === "Mendekati Expiry").length;
  const expiredCount = guarantees.filter(d => d.status === "Expired").length;
  const totalCount = guarantees.length;
  
  const aktifPct = totalCount ? (aktifCount / totalCount) * 100 : 0;
  const mendekatiPct = totalCount ? (mendekatiCount / totalCount) * 100 : 0;

  // Reset pagination on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, typeFilter]);

  const filteredGuarantees = useMemo(() => {
    return guarantees.filter((item) => {
      const matchesSearch = item.referenceNo.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.pic.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.type.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "All" || item.status === statusFilter;
      const matchesType = typeFilter === "All" || item.type === typeFilter;
      
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [guarantees, searchQuery, statusFilter, typeFilter]);

  const totalPages = Math.ceil(filteredGuarantees.length / itemsPerPage);
  
  const paginatedGuarantees = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredGuarantees.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredGuarantees, currentPage]);

  return (
    <div className="space-y-6 pb-12">
      {/* Statistics Header */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
        {/* Total Guarantees */}
        <div className="p-5 flex-1 flex items-center justify-between">
          <div>
            <div className="text-[13px] font-medium text-slate-500 mb-1 uppercase tracking-wider">Total Jaminan</div>
            <div className="text-3xl font-black text-[#0a4d8c]">{totalCount}</div>
            <div className="text-[11px] text-slate-400 mt-1 font-medium">Tercatat dalam sistem</div>
          </div>
          <div className="w-14 h-14 rounded-full relative shadow-[inset_0_2px_8px_rgba(0,0,0,0.06)]" style={{
            background: `conic-gradient(#10b981 0% ${aktifPct}%, #f59e0b ${aktifPct}% ${aktifPct + mendekatiPct}%, #ef4444 ${aktifPct + mendekatiPct}% 100%)`
          }}>
            <div className="absolute inset-2 bg-white rounded-full"></div>
          </div>
        </div>

        {/* Aktif */}
        <div className="p-5 flex-1">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-[13px] font-medium text-slate-500 mb-1 flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                Aktif
              </div>
              <div className="text-2xl font-bold text-slate-800 mt-2">{aktifCount}</div>
            </div>
            <div className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2 py-1 rounded-md border border-emerald-100">
              {aktifPct.toFixed(0)}%
            </div>
          </div>
          <div className="text-[11px] text-slate-400 mt-1 font-medium">Masa berlaku masih panjang</div>
        </div>

        {/* Mendekati Expiry */}
        <div className="p-5 flex-1">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-[13px] font-medium text-slate-500 mb-1 flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                Mendekati Expiry
              </div>
              <div className="text-2xl font-bold text-slate-800 mt-2">{mendekatiCount}</div>
            </div>
            <div className="bg-amber-50 text-amber-700 text-xs font-bold px-2 py-1 rounded-md border border-amber-100">
              {mendekatiPct.toFixed(0)}%
            </div>
          </div>
          <div className="text-[11px] text-slate-400 mt-1 font-medium">Kurang dari 30 hari</div>
        </div>

        {/* Expired */}
        <div className="p-5 flex-1">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-[13px] font-medium text-slate-500 mb-1 flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                Expired
              </div>
              <div className="text-2xl font-bold text-slate-800 mt-2">{expiredCount}</div>
            </div>
            <div className="bg-red-50 text-red-700 text-xs font-bold px-2 py-1 rounded-md border border-red-100">
              {(100 - aktifPct - mendekatiPct).toFixed(0)}%
            </div>
          </div>
          <div className="text-[11px] text-slate-400 mt-1 font-medium">Masa berlaku habis</div>
        </div>
      </div>

      {/* Search and Filter */}
      <GuaranteeFilterBar 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
      />

      {/* Guarantees List (Table Layout) */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="px-4 py-3">Referensi</th>
                <th className="px-4 py-3">Nilai Jaminan</th>
                <th className="px-4 py-3">PIC</th>
                <th className="px-4 py-3">Jatuh Tempo</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {paginatedGuarantees.length > 0 ? (
                paginatedGuarantees.map((item) => (
                  <GuaranteeRow key={item.id} guarantee={item} />
                ))
              ) : (
                <tr>
                  <td colSpan={5}>
                    <div className="flex flex-col items-center justify-center p-12 text-slate-500">
                      <Inbox size={48} className="text-slate-300 mb-4" />
                      <p className="text-lg font-medium text-slate-700">Data jaminan tidak ditemukan</p>
                      <p className="text-sm">Coba ubah kata kunci pencarian atau filter status.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          
          <TablePagination 
            currentPage={currentPage}
            totalPages={Math.max(totalPages, 1)}
            totalItems={filteredGuarantees.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={setItemsPerPage}
            itemName="jaminan"
          />
        </div>
      </div>
    </div>
  );
}
