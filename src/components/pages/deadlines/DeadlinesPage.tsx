"use client";

import { useState, useMemo, useEffect } from "react";
import { Clock, XCircle, PlusCircle, AlertCircle } from "lucide-react";
import { DeadlineItem, DeadlineStatus } from "@/lib/types";
import { DeadlineFilterBar } from "@/components/widgets/deadlines/DeadlineFilterBar";
import { DeadlineRow } from "@/components/widgets/deadlines/DeadlineRow";
import { TablePagination } from "@/components/widgets/TablePagination";
import { useProcurement } from "@/context/ProcurementContext";
import { getDeadlineTiming } from "@/lib/deadlineUtils";

export default function DeadlinesPage() {
  const { state, addDeadline } = useProcurement();
  const deadlines = useMemo(() => state.deadlines.map(deadline => ({
    ...deadline,
    ...getDeadlineTiming(deadline.targetDate, state.settings.slaWarningDays, deadline.status),
  })), [state.deadlines, state.settings.slaWarningDays]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<DeadlineStatus | "All">("All");
  const [urgencyFilter, setUrgencyFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showAddModal, setShowAddModal] = useState(false);

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
      const matchesSearch = item.requestId.toLowerCase().includes(searchQuery.toLowerCase()) || 
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
            background: `conic-gradient(#10b981 0% ${onTrackPct}%, #0a4d8c ${onTrackPct}% ${onTrackPct + atRiskPct}%, #ef4444 ${onTrackPct + atRiskPct}% 100%)`
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
            <div className="bg-emerald-50 text-emerald-700 text-xs font-medium px-2.5 py-0.5 rounded-full border border-emerald-100">
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
                <div className="w-2.5 h-2.5 rounded-full bg-[#0a4d8c]"></div>
                Berisiko (At Risk)
              </div>
              <div className="text-2xl font-bold text-slate-800 mt-2">{atRiskCount}</div>
            </div>
            <div className="bg-blue-50 text-[#0a4d8c] text-xs font-medium px-2.5 py-0.5 rounded-full border border-blue-100">
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
            <div className="bg-red-50 text-red-700 text-xs font-medium px-2.5 py-0.5 rounded-full border border-red-100">
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
        onAddDeadline={() => setShowAddModal(true)}
      />

      {/* Deadlines List (Table Layout) */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="px-4 py-3">Pengadaan & ID Ref</th>
                <th className="px-4 py-3">Milestone & Urgensi</th>
                <th className="px-4 py-3">PIC / Dept</th>
                <th className="px-4 py-3">Jatuh Tempo</th>
                <th className="px-4 py-3">Status SLA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {paginatedDeadlines.length > 0 ? (
                paginatedDeadlines.map((item) => (
                  <DeadlineRow key={item.id} item={item} requestTitle={state.requests.find(request => request.id === item.requestId)?.title} milestones={state.milestones.filter(milestone => milestone.requestId === item.requestId)} />
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
      {/* ADD SLA MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-transparent pointer-events-none">
          <div className="bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col pointer-events-auto animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-[#0a4d8c]">
              <div className="flex items-center gap-2">
                <PlusCircle size={18} className="text-white" />
                <h3 className="font-bold text-white text-sm">Tambah SLA & Target Baru</h3>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-blue-200 hover:text-white transition-colors">
                <XCircle size={20} />
              </button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              
              if (addDeadline) {
                const targetDateRaw = formData.get('targetDate') as string;
                // Calculate days remaining roughly
                const targetTime = new Date(targetDateRaw).getTime();
                const nowTime = new Date().getTime();
                const diffDays = Math.ceil((targetTime - nowTime) / (1000 * 60 * 60 * 24));
                
                addDeadline({
                  id: `SLA-${Date.now()}`,
                  requestId: formData.get('requestId') as string,
                  taskName: formData.get('taskName') as string,
                  milestone: formData.get('milestone') as string,
                  pic: formData.get('pic') as string,
                  department: formData.get('department') as string,
                  targetDate: targetDateRaw,
                  daysRemaining: diffDays,
                  status: "On Track",
                  urgencyLevel: formData.get('urgencyLevel') as any,
                  nextAction: formData.get('nextAction') as string,
                });
                alert('SLA baru berhasil ditambahkan!');
                setShowAddModal(false);
              }
            }}>
              <div className="p-6">
                <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-3 mb-5 flex items-start gap-3">
                  <AlertCircle size={16} className="text-blue-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-800 leading-relaxed">
                    SLA (Service Level Agreement) baru akan dimasukkan ke tracker dan membantu notifikasi peringatan. Pastikan <strong className="font-bold">Request ID</strong> sesuai (contoh: REQ-2026-101).
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-5">
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Nama Tugas / Aktivitas <span className="text-red-500">*</span></label>
                    <input required name="taskName" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#0a4d8c] focus:ring-1 focus:ring-[#0a4d8c]" placeholder="Contoh: Approval Direksi" />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Pengadaan <span className="text-red-500">*</span></label>
                    <select required name="requestId" defaultValue="" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#0a4d8c] focus:ring-1 focus:ring-[#0a4d8c] bg-white">
                      <option value="" disabled>Pilih pengadaan...</option>
                      {state.requests.map(request => <option key={request.id} value={request.id}>{request.id} - {request.title}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">PIC <span className="text-red-500">*</span></label>
                    <input required name="pic" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#0a4d8c] focus:ring-1 focus:ring-[#0a4d8c]" placeholder="Contoh: Budi Santoso" />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Next Action <span className="text-red-500">*</span></label>
                    <textarea required name="nextAction" rows={2} className="w-full resize-none px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#0a4d8c] focus:ring-1 focus:ring-[#0a4d8c]" placeholder="Contoh: Minta approval VP General Affairs sebelum batas SLA." />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Target Tanggal Selesai <span className="text-red-500">*</span></label>
                    <input required type="date" name="targetDate" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#0a4d8c] focus:ring-1 focus:ring-[#0a4d8c]" defaultValue={new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0]} />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Milestone Tahapan <span className="text-red-500">*</span></label>
                    <select required name="milestone" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#0a4d8c] focus:ring-1 focus:ring-[#0a4d8c] bg-white">
                      <option value="Rapat Pra-Tender">Rapat Pra-Tender</option>
                      <option value="Pengumuman Pengadaan">Pengumuman Pengadaan</option>
                      <option value="Prebid Meeting">Prebid Meeting</option>
                      <option value="Pemasukan Dokumen Penawaran">Pemasukan Dokumen Penawaran</option>
                      <option value="Pembukaan Penawaran">Pembukaan Penawaran</option>
                      <option value="Evaluasi Dokumen Penawaran">Evaluasi Dokumen Penawaran</option>
                      <option value="Sosialisasi e-Auction">Sosialisasi e-Auction</option>
                      <option value="Negosiasi e-Auction">Negosiasi e-Auction</option>
                      <option value="Negosiasi Manual">Negosiasi Manual</option>
                      <option value="Laporan Hasil Pemilihan">Laporan Hasil Pemilihan</option>
                      <option value="Pengumuman Pemenang">Pengumuman Pemenang</option>
                      <option value="Penunjukan Pemenang">Penunjukan Pemenang</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Fungsi / Departemen PIC <span className="text-red-500">*</span></label>
                    <select required name="department" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#0a4d8c] focus:ring-1 focus:ring-[#0a4d8c] bg-white">
                      <option value="Procurement">Procurement</option>
                      <option value="User/Peminta">User/Peminta</option>
                      <option value="Legal">Legal</option>
                      <option value="Finance">Finance</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Tingkat Urgensi <span className="text-red-500">*</span></label>
                    <select required name="urgencyLevel" defaultValue="Medium" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#0a4d8c] focus:ring-1 focus:ring-[#0a4d8c] bg-white">
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Critical">Critical</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end">
                <button type="submit" className="px-6 py-2.5 bg-[#0a4d8c] hover:bg-[#093e6f] text-white text-sm font-bold rounded-lg transition-all shadow-sm hover:shadow flex items-center gap-2">
                  <PlusCircle size={16} />
                  Simpan SLA Baru
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
