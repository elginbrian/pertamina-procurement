"use client";

import { useState, useMemo, useEffect } from "react";
import { AlertCircle, ArrowRight, CheckCircle2, ChevronDown, ChevronRight, FileCheck2, Inbox, Sparkles, UploadCloud } from "lucide-react";
import { useRouter } from "next/navigation";
import { DocumentStatus } from "@/lib/types";
import { DocumentFilterBar } from "@/components/widgets/documents/DocumentFilterBar";
import { DocumentGroupRow } from "@/components/widgets/documents/DocumentGroupRow";
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
  const [expandedReviewId, setExpandedReviewId] = useState<string | null>(null);

  const readyCount = documents.filter(d => d.status === "Lulus Verifikasi").length;
  const attnCount = documents.filter(d => d.status === "Catatan Procurement").length;
  const notReadyCount = documents.filter(d => d.status === "Tindak Lanjut FPP").length;
  const totalCount = documents.length;
  
  const readyPct = totalCount ? (readyCount / totalCount) * 100 : 0;
  const attnPct = totalCount ? (attnCount / totalCount) * 100 : 0;
  const reviewQueue = documents.filter(doc => doc.status !== "Lulus Verifikasi");
  const readinessByType = ["Wajib", "Kondisional", "Dokumentasi", "Best Practice"].map(type => {
    const typeDocuments = documents.filter(document => document.type === type);
    const complete = typeDocuments.filter(document => document.status === "Lulus Verifikasi").length;
    return { type, total: typeDocuments.length, complete, percent: typeDocuments.length ? Math.round((complete / typeDocuments.length) * 100) : 0 };
  });

  // Reset pagination on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, typeFilter]);

  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      const request = state.requests.find(item => item.id === doc.requestId);
      const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            doc.pic.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            doc.requestId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            request?.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "All" || doc.status === statusFilter;
      const matchesType = typeFilter === "All" || doc.type === typeFilter;
      
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [documents, state.requests, searchQuery, statusFilter, typeFilter]);

  const documentGroups = useMemo(() => state.requests
    .map(request => ({
      request,
      documents: filteredDocuments.filter(document => document.requestId === request.id),
    }))
    .filter(group => group.documents.length > 0), [state.requests, filteredDocuments]);

  const totalPages = Math.ceil(documentGroups.length / itemsPerPage);
  
  const paginatedDocuments = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return documentGroups.slice(startIndex, startIndex + itemsPerPage);
  }, [documentGroups, currentPage, itemsPerPage]);

  return (
    <div className="flex flex-col gap-6 pb-12">

      <section className="order-1 relative overflow-hidden rounded-2xl bg-[#0a4d8c] px-6 py-7 text-white shadow-sm sm:px-8">
        <div className="relative z-10 max-w-3xl">
          <div className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-blue-100">
            <FileCheck2 size={16} />
            D1 / Document Readiness
          </div>
          <h1 className="max-w-2xl text-2xl font-semibold tracking-tight sm:text-3xl">Pastikan setiap dokumen siap sebelum proses bergerak.</h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-blue-100 sm:text-[15px]">Pantau kelengkapan DP3, temuan review, dan tindak lanjut FPP dari satu ruang kerja.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button onClick={() => router.push("/documents/upload")} className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-[#0a4d8c] shadow-sm transition hover:bg-blue-50">
              <UploadCloud size={16} /> Upload Dokumen
            </button>
          </div>
        </div>
        <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full border-[32px] border-blue-300/15" />
        <div className="pointer-events-none absolute -bottom-24 right-24 h-48 w-48 rounded-full border-[24px] border-cyan-300/10" />
      </section>

      <section className="order-3 grid grid-cols-1 gap-6 xl:grid-cols-[1.35fr_1fr]">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div><h2 className="text-base font-bold text-slate-800">Antrean review</h2><p className="mt-1 text-xs text-slate-500">Dokumen yang membutuhkan keputusan atau tindak lanjut hari ini.</p></div>
            <Sparkles className="text-[#0a4d8c]" size={20} />
          </div>
          <div className="mt-5 space-y-3">
            {reviewQueue.slice(0, 4).map(document => (
              <div key={document.id}>
                <button onClick={() => setExpandedReviewId(current => current === document.id ? null : document.id)} className="flex w-full items-center gap-3 rounded-lg border border-slate-200 p-3 text-left transition hover:border-[#0a4d8c]/40 hover:bg-blue-50/40">
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${document.status === "Tindak Lanjut FPP" ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-600"}`}><FileCheck2 size={17} /></div>
                  <div className="min-w-0 flex-1"><div className="truncate text-[13px] font-medium text-slate-800">{document.name}</div><div className="mt-1 truncate text-[11px] text-slate-500">{document.type} · {document.fileName || "File belum tersedia"} · {document.uploadDate}</div></div>
                  <span className={`hidden shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold sm:inline-flex ${document.status === "Tindak Lanjut FPP" ? "border-red-200 bg-red-50 text-red-700" : "border-amber-200 bg-amber-50 text-amber-700"}`}>{document.status}</span>
                  {expandedReviewId === document.id ? <ChevronDown className="shrink-0 text-slate-400" size={16} /> : <ChevronRight className="shrink-0 text-slate-400" size={16} />}
                </button>
                {expandedReviewId === document.id && (
                  <div className="border-x border-b border-slate-200 bg-slate-50 px-4 py-3 sm:px-12">
                    {document.issues.length > 0 ? <ul className="list-disc space-y-1 pl-4 text-xs leading-relaxed text-slate-600">{document.issues.map((issue, index) => <li key={`${document.id}-review-issue-${index}`}>{issue}</li>)}</ul> : <div className="text-xs text-emerald-700">Tidak ada temuan pemeriksaan.</div>}
                    {document.nextAction && <div className="mt-3 text-xs text-slate-600"><span className="font-semibold text-[#0a4d8c]">Next Action:</span> {document.nextAction}</div>}
                    <button onClick={() => router.push(`/documents/result?id=${document.id}`)} className="mt-3 text-xs font-semibold text-[#0a4d8c] hover:underline">Buka hasil pemeriksaan</button>
                  </div>
                )}
              </div>
            ))}
            {reviewQueue.length === 0 && <div className="rounded-lg border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500">Tidak ada dokumen yang menunggu review.</div>}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-start justify-between gap-4"><div><h2 className="text-base font-bold text-slate-800">Kelengkapan dokumen per kategori</h2><p className="mt-1 max-w-sm text-xs leading-relaxed text-slate-500">Dokumen Lulus Verifikasi dibandingkan dengan total dokumen pada setiap tipe.</p></div><CheckCircle2 className="text-emerald-500" size={20} /></div>
          <div className="mt-6 space-y-5">
            {readinessByType.map(item => <div key={item.type}><div className="mb-2 flex items-center justify-between text-xs"><span className="font-semibold text-slate-700">{item.type}</span><span className="font-bold text-slate-500">{item.complete} Lulus / {item.total} total</span></div><div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-[#0a4d8c] transition-all" style={{ width: `${item.percent}%` }} /></div><div className="mt-1 text-right text-[11px] font-medium text-slate-400">{item.percent}% siap</div></div>)}
          </div>
        </div>
      </section>

      {/* Statistics Header */}
      <div className="order-2 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
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
      <div className="order-4">
        <DocumentFilterBar 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        />
      </div>

      {/* Document List (Table Layout) */}
      <div className="order-5 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="px-4 py-3">Pengadaan</th>
                <th className="px-4 py-3">Isi Folder</th>
                <th className="px-4 py-3">PIC</th>
                <th className="px-4 py-3">Kesiapan</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {paginatedDocuments.length > 0 ? (
                paginatedDocuments.map((group) => (
                  <DocumentGroupRow key={group.request.id} request={group.request} documents={group.documents} />
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
            totalItems={documentGroups.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={setItemsPerPage}
            itemName="pengadaan"
          />
        </div>
      </div>
    </div>
  );
}
