"use client";

import { useState, useMemo, useEffect } from "react";
import { createPortal } from "react-dom";
import { FileText, Inbox, XCircle } from "lucide-react";
import { GuaranteeItem, GuaranteeStatus } from "@/types";
import { GuaranteeFilterBar } from "@/components/widgets/guarantees/GuaranteeFilterBar";
import { GuaranteeStats } from "@/components/widgets/stats/GuaranteeStats";
import { GuaranteeGroupRow } from "@/components/widgets/guarantees/GuaranteeGroupRow";
import { TablePagination } from "@/components/widgets/TablePagination";
import { useProcurement } from "@/context/ProcurementContext";

export default function GuaranteesPage() {
  const { state, updateGuarantee } = useProcurement();
  const guarantees = state.guarantees;
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<GuaranteeStatus | "All">("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [editingGuarantee, setEditingGuarantee] = useState<GuaranteeItem | null>(null);

  const aktifCount = guarantees.filter(d => d.status === "Aktif").length;
  const mendekatiCount = guarantees.filter(d => d.status === "Mendekati Expiry").length;
  const expiredCount = guarantees.filter(d => d.status === "Expired").length;
  const totalCount = guarantees.length;
  
  const aktifPct = totalCount ? (aktifCount / totalCount) * 100 : 0;
  const mendekatiPct = totalCount ? (mendekatiCount / totalCount) * 100 : 0;

  const [prevFilters, setPrevFilters] = useState({ searchQuery, statusFilter, typeFilter });
  if (searchQuery !== prevFilters.searchQuery || statusFilter !== prevFilters.statusFilter || typeFilter !== prevFilters.typeFilter) {
    setPrevFilters({ searchQuery, statusFilter, typeFilter });
    setCurrentPage(1);
  }

  const filteredGuarantees = useMemo(() => {
    return guarantees.filter((item) => {
      const request = state.requests.find(requestItem => requestItem.id === item.requestId);
      const matchesSearch = item.referenceNo.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.pic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.requestId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            request?.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "All" || item.status === statusFilter;
      const matchesType = typeFilter === "All" || item.type === typeFilter;
      
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [guarantees, state.requests, searchQuery, statusFilter, typeFilter]);

  const guaranteeGroups = useMemo(() => state.requests
    .map(request => ({
      request,
      guarantees: filteredGuarantees.filter(guarantee => guarantee.requestId === request.id),
    }))
    .filter(group => {
      const requestMatchesSearch = !searchQuery || [group.request.id, group.request.title, group.request.pic.name]
        .some(value => value.toLowerCase().includes(searchQuery.toLowerCase()));
      const hasActiveFilters = statusFilter !== "All" || typeFilter !== "All";
      return hasActiveFilters ? group.guarantees.length > 0 : requestMatchesSearch || group.guarantees.length > 0;
    }), [state.requests, filteredGuarantees, searchQuery, statusFilter, typeFilter]);

  const totalPages = Math.ceil(guaranteeGroups.length / itemsPerPage);
  
  const paginatedGuarantees = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return guaranteeGroups.slice(startIndex, startIndex + itemsPerPage);
  }, [guaranteeGroups, currentPage, itemsPerPage]);

  return (
    <div className="space-y-6 pb-12">
      <GuaranteeStats 
        totalCount={totalCount}
        aktifCount={aktifCount}
        mendekatiCount={mendekatiCount}
        expiredCount={expiredCount}
        aktifPct={aktifPct}
        mendekatiPct={mendekatiPct}
      />

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
                <th className="px-4 py-3">Pengadaan</th>
                <th className="px-4 py-3">Isi Folder</th>
                <th className="px-4 py-3">Nilai Jaminan</th>
                <th className="px-4 py-3">Expiry Terdekat</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Aksi</th>
                <th className="w-14 px-2 py-3"><span className="sr-only">Buka folder</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {paginatedGuarantees.length > 0 ? (
                paginatedGuarantees.map((group) => (
                  <GuaranteeGroupRow key={group.request.id} request={group.request} guarantees={group.guarantees} onEdit={setEditingGuarantee} />
                ))
              ) : (
                <tr>
                  <td colSpan={7}>
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
            totalItems={guaranteeGroups.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={setItemsPerPage}
            itemName="pengadaan"
          />
        </div>
      </div>

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div><h2 className="text-sm font-bold text-slate-800">Dokumen Pendukung per Pekerjaan</h2><p className="mt-1 text-xs text-slate-500">File TKDN dan dokumen lain yang disimpan tanpa ekstraksi OCR.</p></div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{state.attachments.length} dokumen</span>
        </div>
        {state.attachments.length > 0 ? <div className="divide-y divide-slate-100">{state.attachments.map(attachment => {
          const request = state.requests.find(item => item.id === attachment.requestId);
          return <div key={attachment.id} className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"><div className="flex min-w-0 items-center gap-3"><FileText size={18} className="shrink-0 text-[#0a4d8c]" /><div className="min-w-0"><div className="truncate text-sm font-semibold text-slate-800">{attachment.fileUrl ? attachment.fileUrl.split('/').pop() : "File belum tersedia"}</div><div className="mt-1 text-xs text-slate-500">{request?.title ?? attachment.requestId} · {attachment.type} · {attachment.uploadedAt}</div></div></div><span className="shrink-0 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-600">Tanpa ekstraksi</span></div>;
        })}</div> : <div className="px-5 py-10 text-center text-sm text-slate-500">Belum ada dokumen pendukung yang disimpan.</div>}
      </section>
      {editingGuarantee && createPortal(<div className="fixed inset-0 z-[100] flex min-h-dvh items-center justify-center overflow-y-auto bg-slate-950/50 p-4" onClick={() => setEditingGuarantee(null)}><form className="w-full max-w-2xl overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl" onClick={event => event.stopPropagation()} onSubmit={event => { event.preventDefault(); const formData = new FormData(event.currentTarget); updateGuarantee(editingGuarantee.id, { issuerType: formData.get("issuerType") as GuaranteeItem["issuerType"], issuer: String(formData.get("issuer")), referenceNo: String(formData.get("referenceNo")), beneficiary: String(formData.get("beneficiary")), vendor: { id: "VND-EDIT", name: String(formData.get("vendor")) }, value: Number(String(formData.get("value")).replace(/\D/g, "")), issueDate: String(formData.get("issueDate")), expiryDate: String(formData.get("expiryDate")) }); setEditingGuarantee(null); }}><div className="flex items-center justify-between bg-[#0a4d8c] px-5 py-4 text-white"><div><h2 className="text-sm font-bold">Koreksi Data Ekstraksi</h2><p className="mt-1 text-xs text-blue-100">Periksa dan ubah hasil baca OCR sebelum digunakan.</p></div><button type="button" onClick={() => setEditingGuarantee(null)} className="text-blue-100 hover:text-white"><XCircle size={20} /></button></div><div className="grid gap-4 p-5 sm:grid-cols-2"><label><span className="mb-1 block text-xs font-semibold text-slate-700">Jenis penerbit</span><select name="issuerType" defaultValue={editingGuarantee.issuerType ?? "Bank"} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"><option>Bank</option><option>Asuransi</option><option>Lainnya</option></select></label><label><span className="mb-1 block text-xs font-semibold text-slate-700">Nama penerbit</span><input required name="issuer" defaultValue={editingGuarantee.issuer} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" /></label><label><span className="mb-1 block text-xs font-semibold text-slate-700">Nomor jaminan</span><input required name="referenceNo" defaultValue={editingGuarantee.referenceNo} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" /></label><label><span className="mb-1 block text-xs font-semibold text-slate-700">Penerima jaminan</span><input name="beneficiary" defaultValue={editingGuarantee.beneficiary ?? ""} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" /></label><label><span className="mb-1 block text-xs font-semibold text-slate-700">Vendor</span><input required name="vendor" defaultValue={editingGuarantee.vendor.name} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" /></label><label><span className="mb-1 block text-xs font-semibold text-slate-700">Nilai jaminan</span><input required name="value" defaultValue={editingGuarantee.value} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" /></label><label><span className="mb-1 block text-xs font-semibold text-slate-700">Tanggal terbit</span><input required type="date" name="issueDate" defaultValue={editingGuarantee.issueDate} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" /></label><label><span className="mb-1 block text-xs font-semibold text-slate-700">Expiry date</span><input required type="date" name="expiryDate" defaultValue={editingGuarantee.expiryDate} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" /></label></div><div className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50 px-5 py-4"><button type="button" onClick={() => setEditingGuarantee(null)} className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-200">Batal</button><button type="submit" className="rounded-lg bg-[#0a4d8c] px-4 py-2 text-sm font-semibold text-white hover:bg-[#093e6f]">Simpan Koreksi</button></div></form></div>, document.body)}
    </div>
  );
}
