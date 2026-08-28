"use client";

import { useState, useMemo, useEffect } from "react";
import { Inbox } from "lucide-react";
import { useRouter } from "next/navigation";
import { DocumentItem, DocumentStatus } from "@/lib/types";
import { DocumentFilterBar } from "@/components/widgets/documents/DocumentFilterBar";
import { DocumentRow } from "@/components/widgets/documents/DocumentRow";
import { TablePagination } from "@/components/widgets/TablePagination";
import { useProcurement } from "@/context/ProcurementContext";

export default function DocumentsPage() {
  const router = useRouter();
  const { state } = useProcurement();
  const documents = state.documents;
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<DocumentStatus | "All">("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const readyCount = documents.filter(d => d.status === "Lulus Verifikasi").length;
  const attnCount = documents.filter(d => d.status === "Catatan Procurement").length;
  const notReadyCount = documents.filter(d => d.status === "Tindak Lanjut FPP").length;
  const totalCount = documents.length;
  
  const readyPct = totalCount ? (readyCount / totalCount) * 100 : 0;
  const attnPct = totalCount ? (attnCount / totalCount) * 100 : 0;

  // Reset pagination on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, typeFilter]);

  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            doc.pic.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "All" || doc.status === statusFilter;
      const matchesType = typeFilter === "All" || doc.type === typeFilter;
      
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [documents, searchQuery, statusFilter, typeFilter]);

  const totalPages = Math.ceil(filteredDocuments.length / itemsPerPage);
  
  const paginatedDocuments = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredDocuments.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredDocuments, currentPage]);

  return (
    <div className="space-y-6 pb-12">

      {/* Statistics Header */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
        {/* Total Documents */}
        <div className="p-5 flex-1 flex items-center justify-between">
          <div>
            <div className="text-[13px] font-medium text-slate-500 mb-1 uppercase tracking-wider">Total Dokumen</div>
            <div className="text-3xl font-black text-[#0a4d8c]">{totalCount}</div>
            <div className="text-[11px] text-slate-400 mt-1 font-medium">Tercatat dalam sistem</div>
          </div>
          <div className="w-14 h-14 rounded-full relative shadow-[inset_0_2px_8px_rgba(0,0,0,0.06)]" style={{
            background: `conic-gradient(#10b981 0% ${readyPct}%, #0a4d8c ${readyPct}% ${readyPct + attnPct}%, #ef4444 ${readyPct + attnPct}% 100%)`
          }}>
            <div className="absolute inset-2 bg-white rounded-full"></div>
          </div>
        </div>

        {/* Ready */}
        <div className="p-5 flex-1">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-[13px] font-medium text-slate-500 mb-1 flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                Aman (Lulus)
              </div>
              <div className="text-2xl font-bold text-slate-800 mt-2">{readyCount}</div>
            </div>
            <div className="bg-emerald-50 text-emerald-700 text-xs font-medium px-2.5 py-0.5 rounded-full border border-emerald-100">
              {readyPct.toFixed(0)}%
            </div>
          </div>
          <div className="text-[11px] text-slate-400 mt-1 font-medium">Lulus verifikasi DP3</div>
        </div>

        {/* Needs Attention */}
        <div className="p-5 flex-1">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-[13px] font-medium text-slate-500 mb-1 flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#0a4d8c]"></div>
                Perhatian (P3)
              </div>
              <div className="text-2xl font-bold text-slate-800 mt-2">{attnCount}</div>
            </div>
            <div className="bg-blue-50 text-[#0a4d8c] text-xs font-medium px-2.5 py-0.5 rounded-full border border-blue-100">
              {attnPct.toFixed(0)}%
            </div>
          </div>
          <div className="text-[11px] text-slate-400 mt-1 font-medium">Catatan Procurement</div>
        </div>

        {/* Not Ready */}
        <div className="p-5 flex-1">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-[13px] font-medium text-slate-500 mb-1 flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                Pending (FPP)
              </div>
              <div className="text-2xl font-bold text-slate-800 mt-2">{notReadyCount}</div>
            </div>
            <div className="bg-red-50 text-red-700 text-xs font-medium px-2.5 py-0.5 rounded-full border border-red-100">
              {(100 - readyPct - attnPct).toFixed(0)}%
            </div>
          </div>
          <div className="text-[11px] text-slate-400 mt-1 font-medium">Tindak lanjut kembali ke FPP</div>
        </div>
      </div>

      {/* Search and Filter */}
      <DocumentFilterBar 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
      />

      {/* Document List (Table Layout) */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="px-4 py-3">Nama Dokumen</th>
                <th className="px-4 py-3">Tipe</th>
                <th className="px-4 py-3">PIC</th>
                <th className="px-4 py-3">Diunggah</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {paginatedDocuments.length > 0 ? (
                paginatedDocuments.map((doc) => (
                  <DocumentRow key={doc.id} doc={doc} />
                ))
              ) : (
                <tr>
                  <td colSpan={5}>
                    <div className="flex flex-col items-center justify-center p-12 text-slate-500">
                      <Inbox size={48} className="text-slate-300 mb-4" />
                      <p className="text-lg font-medium text-slate-700">Dokumen tidak ditemukan</p>
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
            totalItems={filteredDocuments.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={setItemsPerPage}
            itemName="dokumen"
          />
        </div>
      </div>
    </div>
  );
}
