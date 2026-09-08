"use client";

import { useState, useMemo } from "react";
import { Search, Filter, AlertCircle, Clock, CheckCircle2, ChevronDown, ChevronRight, GripVertical, XCircle, FileText, LayoutList, CalendarClock, ShieldCheck, PlusCircle } from "lucide-react";
import { TrackerItem, TrackerStage } from "./types";
import { useProcurement } from "@/context/ProcurementContext";
import { useRouter } from "next/navigation";
import type { ProcurementStep } from "@/lib/types";
import { getDeadlineTiming } from "@/lib/deadlineUtils";

const PROCUREMENT_STEPS: ProcurementStep[] = [
  "Rapat Pra-Tender",
  "Pengumuman Pengadaan",
  "Prebid Meeting",
  "Pemasukan Dokumen Penawaran",
  "Pembukaan Penawaran",
  "Evaluasi Dokumen Penawaran",
  "Sosialisasi e-Auction",
  "Negosiasi e-Auction",
  "Negosiasi Manual",
  "Laporan Hasil Pemilihan",
  "Pengumuman Pemenang",
  "Penunjukan Pemenang",
];

const COLUMNS: { id: TrackerStage; title: string; color: string; bg: string; border: string; headerBg: string }[] = [
  { id: "Persiapan", title: "Persiapan", color: "text-white", bg: "bg-white", border: "border-slate-200", headerBg: "bg-[#0a4d8c]" },
  { id: "Sourcing", title: "Sourcing", color: "text-white", bg: "bg-white", border: "border-slate-200", headerBg: "bg-[#0a4d8c]" },
  { id: "Evaluasi", title: "Evaluasi", color: "text-white", bg: "bg-white", border: "border-slate-200", headerBg: "bg-[#0a4d8c]" },
  { id: "Contracting", title: "Contracting / PO", color: "text-white", bg: "bg-white", border: "border-slate-200", headerBg: "bg-[#0a4d8c]" },
  { id: "Selesai", title: "Selesai", color: "text-white", bg: "bg-white", border: "border-slate-200", headerBg: "bg-[#0a4d8c]" },
];

export default function TrackerPage() {
  const { state, moveRequest, moveRequestStep, addRequest } = useProcurement();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [expandedRelatedId, setExpandedRelatedId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Compute Time Status per request from D4 deadlines
  const timeStatusMap = useMemo(() => {
    const map: Record<string, "On Track" | "At Risk" | "Overdue" | "Selesai"> = {};
    state.deadlines.forEach(d => {
      const prev = map[d.requestId];
      const timing = getDeadlineTiming(d.targetDate, state.settings.slaWarningDays, d.status);
      // Worse status wins: Overdue > At Risk > On Track > Selesai
      const rank = { "Overdue": 3, "At Risk": 2, "On Track": 1, "Selesai": 0 } as const;
      if (!prev || rank[timing.status] > rank[prev]) {
        map[d.requestId] = timing.status;
      }
    });
    return map;
  }, [state.deadlines, state.settings.slaWarningDays]);

  // Map context requests to TrackerItem shape
  const items: TrackerItem[] = useMemo(() => state.requests.map(r => ({
    id: r.id,
    title: r.title,
    pic: r.pic,
    amount: r.amount,
    stage: r.stage as TrackerStage,
    currentStep: r.currentStep,
    department: r.department,
    daysInStage: r.daysInStage,
    isUrgent: r.isUrgent,
  })), [state.requests]);

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.pic.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.id.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesDept = departmentFilter === "All" || item.department === departmentFilter;
      
      return matchesSearch && matchesDept;
    });
  }, [items, searchQuery, departmentFilter]);

  // Group items by stage
  const itemsByStage = useMemo(() => {
    const grouped = { Persiapan: [], Sourcing: [], Evaluasi: [], Contracting: [], Selesai: [] } as Record<TrackerStage, TrackerItem[]>;
    filteredItems.forEach(item => grouped[item.stage].push(item));
    return grouped;
  }, [filteredItems]);

  const totalItemsCount = filteredItems.length;
  const persPct = totalItemsCount ? (itemsByStage["Persiapan"].length / totalItemsCount) * 100 : 0;
  const srcPct = totalItemsCount ? (itemsByStage["Sourcing"].length / totalItemsCount) * 100 : 0;
  const evlPct = totalItemsCount ? (itemsByStage["Evaluasi"].length / totalItemsCount) * 100 : 0;
  const ctrPct = totalItemsCount ? (itemsByStage["Contracting"].length / totalItemsCount) * 100 : 0;
  
  const pieChartStyle = totalItemsCount === 0 
    ? { background: 'conic-gradient(#f1f5f9 0% 100%)' }
    : { background: `conic-gradient(
        #64748b 0% ${persPct}%, 
        #f59e0b ${persPct}% ${persPct + srcPct}%, 
        #0a4d8c ${persPct + srcPct}% ${persPct + srcPct + evlPct}%, 
        #ef4444 ${persPct + srcPct + evlPct}% ${persPct + srcPct + evlPct + ctrPct}%, 
        #10b981 ${persPct + srcPct + evlPct + ctrPct}% 100%
      )`};

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData("itemId", id);
    // Add some visual feedback to the dragged item if needed
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Necessary to allow dropping
  };

  const handleDrop = (e: React.DragEvent, stage: TrackerStage) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("itemId");
    moveRequest(id, stage);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-40px)] mb-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-3 shrink-0">
        <div className="relative w-full flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Cari ID pengadaan, judul, atau PIC..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#0a4d8c] focus:ring-1 focus:ring-[#0a4d8c]"
          />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex items-center w-full sm:w-auto">
            <Filter className="absolute left-3 text-slate-400 pointer-events-none" size={16} />
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="w-full sm:w-[200px] pl-9 pr-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium focus:outline-none focus:border-[#0a4d8c] appearance-none cursor-pointer hover:bg-slate-50 transition-colors"
            >
              <option value="All">Semua Departemen</option>
              <option value="IT Infrastructure">IT Infrastructure</option>
              <option value="HR">Human Resources</option>
              <option value="Operations">Operations</option>
              <option value="Creative">Creative</option>
              <option value="General Affairs">General Affairs</option>
            </select>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#0a4d8c] hover:bg-[#093e6f] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm whitespace-nowrap"
          >
            + Tambah Request
          </button>
        </div>
      </div>
      {/* Kanban Board Container */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden pb-1 hide-scrollbar">
        <div className="flex h-full gap-5 min-w-max pb-1">
          {/* Statistics Panel */}
          <div className="flex flex-col w-[320px] rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#093e6f] bg-[#0a4d8c] shrink-0">
              <h3 className="font-bold text-[13px] uppercase tracking-wider text-white">Statistik</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-8 hide-scrollbar">
              
              {/* Dynamic Pie Chart */}
              <div className="flex flex-col items-center pt-2">
                <div 
                  className="w-36 h-36 rounded-full relative shadow-[inset_0_2px_10px_rgba(0,0,0,0.05)]"
                  style={pieChartStyle}
                >
                  <div className="absolute inset-0 m-auto w-[90px] h-[90px] bg-white rounded-full flex flex-col items-center justify-center shadow-sm">
                    <span className="text-2xl font-black text-slate-700 leading-none">{totalItemsCount}</span>
                    <span className="text-[10px] text-slate-400 font-medium mt-1">TOTAL</span>
                  </div>
                </div>
              </div>

              {/* Legend & Breakdown */}
              <div className="space-y-3.5 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="flex items-center justify-between text-[12px]">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-500"></div>
                    <span className="text-slate-600 font-medium">Persiapan</span>
                  </div>
                  <span className="font-bold text-slate-700">{itemsByStage["Persiapan"].length}</span>
                </div>
                <div className="flex items-center justify-between text-[12px]">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                    <span className="text-slate-600 font-medium">Sourcing</span>
                  </div>
                  <span className="font-bold text-slate-700">{itemsByStage["Sourcing"].length}</span>
                </div>
                <div className="flex items-center justify-between text-[12px]">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#0a4d8c]"></div>
                    <span className="text-slate-600 font-medium">Evaluasi</span>
                  </div>
                  <span className="font-bold text-slate-700">{itemsByStage["Evaluasi"].length}</span>
                </div>
                <div className="flex items-center justify-between text-[12px]">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                    <span className="text-slate-600 font-medium">Contracting / PO</span>
                  </div>
                  <span className="font-bold text-slate-700">{itemsByStage["Contracting"].length}</span>
                </div>
                <div className="flex items-center justify-between text-[12px]">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                    <span className="text-slate-600 font-medium">Selesai</span>
                  </div>
                  <span className="font-bold text-slate-700">{itemsByStage["Selesai"].length}</span>
                </div>
              </div>
            </div>
          </div>

          {COLUMNS.map(col => (
            <div 
              key={col.id} 
              className={`flex flex-col w-[320px] rounded-xl border ${col.border} ${col.bg} overflow-hidden`}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, col.id)}
            >
              {/* Column Header */}
              <div className={`flex items-center justify-between px-4 py-2.5 border-b border-[#093e6f] shrink-0 ${col.headerBg}`}>
                <div className="flex items-center gap-2">
                  <h3 className={`font-bold text-[13px] uppercase tracking-wider ${col.color}`}>{col.title}</h3>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-white shadow-sm text-[#0a4d8c]">
                    {itemsByStage[col.id].length}
                  </span>
                </div>
              </div>

              {/* Column Body (Scrollable) */}
              <div className="flex-1 overflow-y-auto p-3 space-y-3 pb-12 hide-scrollbar">
                {itemsByStage[col.id].map(item => (
                  <div 
                    key={item.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, item.id)}
                    className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing group hover:border-[#0a4d8c]/30"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="text-[11px] font-bold text-slate-400 tracking-wider">{item.id}</div>
                      <GripVertical size={14} className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    
                    <h4 className="font-semibold text-slate-800 text-[13px] leading-snug mb-3 line-clamp-2">
                      {item.title}
                    </h4>
                    
                    <div className="flex flex-col gap-2 mb-4">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-500">PIC</span>
                        <span className="font-medium text-slate-700 truncate max-w-[120px] text-right">{item.pic}</span>
                      </div>

                    <div className="mb-3 rounded-lg border border-blue-100 bg-blue-50/60 px-2.5 py-2">
                      <div className="text-[10px] font-semibold uppercase tracking-wider text-[#0a4d8c]">Tahap Berita Acara</div>
                      <div className="mt-0.5 text-[11px] font-medium leading-snug text-slate-700">{item.currentStep}</div>
                    </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-500">Nilai</span>
                        <span className="font-semibold text-[#0a4d8c]">{item.amount}</span>
                      </div>
                    </div>
                    
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-auto">
                      {col.id === "Selesai" ? (
                        <div className="flex items-center gap-1.5 text-emerald-600 text-[11px] font-semibold">
                          <CheckCircle2 size={14} />
                          <span>Selesai</span>
                        </div>
                      ) : item.isUrgent ? (
                        <div className="flex items-center gap-1.5 text-red-700 text-[11px] font-medium bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200">
                          <AlertCircle size={14} />
                          <span>Urgent ({item.daysInStage} hr)</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-medium">
                          <Clock size={14} />
                          <span>{item.daysInStage} hr di tahap ini</span>
                        </div>
                      )}
                      
                      {/* Time Status from D4 */}
                      {timeStatusMap[item.id] && col.id !== "Selesai" && (
                        <div className={`flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                          timeStatusMap[item.id] === 'Overdue'
                            ? 'bg-red-50 text-red-600 border-red-200'
                            : timeStatusMap[item.id] === 'At Risk'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}>
                          <Clock size={10} />
                          {timeStatusMap[item.id]}
                        </div>
                      )}
                      
                      <button 
                        onClick={() => setSelectedRequestId(item.id)}
                        title="Lihat Detail"
                        className="w-6 h-6 flex items-center justify-center rounded-full bg-slate-50 hover:bg-[#0a4d8c] text-slate-400 hover:text-white transition-colors border border-slate-200 hover:border-transparent"
                      >
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                ))}
                
                {itemsByStage[col.id].length === 0 && (
                  <div className="h-24 flex items-center justify-center border-2 border-dashed border-slate-300/50 rounded-xl bg-white/30">
                    <span className="text-xs text-slate-400 font-medium">Kosong</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* DETAIL MODAL (Helicopter View) */}
      {selectedRequestId && (() => {
        const docs = state.documents.filter(d => d.requestId === selectedRequestId);
        const guars = state.guarantees.filter(d => d.requestId === selectedRequestId);
        const slas = state.deadlines.filter(d => d.requestId === selectedRequestId);
        const request = state.requests.find(r => r.id === selectedRequestId);
        const milestones = state.milestones.filter(m => m.requestId === selectedRequestId);
        const currentMilestoneIndex = milestones.findIndex(m => m.status === "In Progress");
        const nextMilestone = milestones.find(m => m.status === "Pending");
        const completedMilestones = milestones.filter(m => m.status === "Done").length;
        const timelineStart = Math.max(0, currentMilestoneIndex > -1 ? currentMilestoneIndex - 1 : 0);
        const visibleMilestones = milestones.slice(timelineStart, timelineStart + 3);
        const otherMilestones = milestones.filter((_, index) => index < timelineStart || index >= timelineStart + 3);
        
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4" onClick={() => setSelectedRequestId(null)}>
            <div role="dialog" aria-modal="true" aria-labelledby="tracker-detail-title" className="flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
              <div className="flex items-start justify-between gap-4 bg-[#0a4d8c] px-5 py-4 sm:px-7">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 text-blue-100">
                    <LayoutList size={18} />
                    <span className="text-[11px] font-bold uppercase tracking-[0.16em]">Helicopter View D3</span>
                  </div>
                  <h3 id="tracker-detail-title" className="mt-2 truncate text-base font-bold text-white">{request?.title ?? selectedRequestId}</h3>
                  <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-blue-100">
                    <span>{selectedRequestId}</span>
                    {request && <span>PIC: {request.pic}</span>}
                    {request && <span>{request.amount}</span>}
                  </div>
                </div>
                <button aria-label="Tutup detail request" onClick={() => setSelectedRequestId(null)} className="shrink-0 rounded-lg p-1 text-blue-200 transition hover:bg-white/10 hover:text-white">
                  <XCircle size={20} />
                </button>
              </div>
              <div className="flex-1 space-y-7 overflow-y-auto p-5 sm:p-7">
                {request && (
                  <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-5">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-wider text-[#0a4d8c]">Posisi proses saat ini</div>
                        <div className="mt-1 text-lg font-bold text-slate-800">{request.currentStep}</div>
                        <div className="mt-1 text-xs text-slate-500">Stage ringkas: {request.stage} · {completedMilestones} dari {milestones.length} tahap selesai</div>
                      </div>
                      <label className="w-full lg:w-72">
                        <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-500">Update tahap manual</span>
                        <select
                          value={request.currentStep}
                          onChange={(event) => moveRequestStep(selectedRequestId, event.target.value as ProcurementStep)}
                          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 focus:border-[#0a4d8c] focus:outline-none"
                        >
                          {PROCUREMENT_STEPS.map(step => <option key={step} value={step}>{step}</option>)}
                        </select>
                      </label>
                    </div>
                    <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/80"><div className="h-full rounded-full bg-[#0a4d8c] transition-all" style={{ width: `${milestones.length ? ((completedMilestones + (currentMilestoneIndex >= 0 ? 1 : 0)) / milestones.length) * 100 : 0}%` }} /></div>
                    {nextMilestone && <div className="mt-2 text-[11px] font-medium text-slate-500">Berikutnya: <span className="font-semibold text-slate-700">{nextMilestone.step}</span></div>}
                  </div>
                )}

                <section>
                  <div className="flex items-end justify-between gap-3 border-b border-slate-200 pb-3">
                    <div><h4 className="text-sm font-bold text-slate-800">Timeline proses procurement</h4><p className="mt-1 text-xs text-slate-500">Status setiap tahap Berita Acara dan deliverable terkait.</p></div>
                    <span className="shrink-0 rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-[#0a4d8c]">{request?.stage ?? "-"}</span>
                  </div>
                  <div className="relative mt-5 space-y-1">
                    <div className="absolute bottom-5 left-[15px] top-5 w-px bg-slate-200" />
                    {visibleMilestones.map((milestone, index) => {
                      const milestoneIndex = timelineStart + index;
                      const isDone = milestone.status === "Done";
                      const isCurrent = milestone.status === "In Progress";
                      return (
                        <div key={milestone.id} className="relative flex gap-4 py-2">
                          <div className={`z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-4 border-white text-[11px] font-bold ${isDone ? "bg-emerald-500 text-white" : isCurrent ? "bg-[#0a4d8c] text-white ring-4 ring-blue-100" : "bg-slate-100 text-slate-400"}`}>
                            {isDone ? <CheckCircle2 size={15} /> : milestoneIndex + 1}
                          </div>
                          <div className={`min-w-0 flex-1 rounded-lg border px-3 py-2.5 ${isCurrent ? "border-blue-200 bg-blue-50/60" : isDone ? "border-emerald-100 bg-emerald-50/40" : "border-slate-100 bg-white"}`}>
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <span className={`text-sm font-semibold ${isCurrent ? "text-[#0a4d8c]" : "text-slate-700"}`}>{milestone.step}</span>
                              <span className={`text-[10px] font-bold uppercase tracking-wider ${isDone ? "text-emerald-600" : isCurrent ? "text-[#0a4d8c]" : "text-slate-400"}`}>{isDone ? "Selesai" : isCurrent ? "Sedang berjalan" : "Berikutnya"}</span>
                            </div>
                            <div className="mt-1 flex flex-wrap gap-x-3 text-[11px] text-slate-500">
                              {milestone.date && <span>{milestone.date}</span>}
                              {milestone.pic && <span>PIC: {milestone.pic}</span>}
                              {milestone.documentId && <span>Dokumen tertaut: {milestone.documentId}</span>}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {otherMilestones.length > 0 && (
                    <details className="mt-4 rounded-lg border border-slate-200 bg-slate-50/50">
                      <summary className="cursor-pointer list-none px-4 py-3 text-xs font-semibold text-slate-600 hover:text-[#0a4d8c]">
                        Tampilkan {otherMilestones.length} tahapan lainnya
                      </summary>
                      <div className="space-y-2 border-t border-slate-200 px-4 py-3">
                        {otherMilestones.map(milestone => (
                          <div key={milestone.id} className="flex items-center justify-between gap-3 rounded-md bg-white px-3 py-2 text-xs">
                            <span className="font-medium text-slate-700">{milestone.step}</span>
                            <span className={`font-semibold ${milestone.status === "Done" ? "text-emerald-600" : "text-slate-400"}`}>{milestone.status === "Done" ? "Selesai" : "Pending"}</span>
                          </div>
                        ))}
                      </div>
                    </details>
                  )}
                </section>
                
                {/* Documents Section */}
                <div>
                  <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
                    <div className="flex items-center gap-2 text-[#0a4d8c] font-semibold text-sm">
                      <FileText size={16} />
                      Dokumen (D1)
                    </div>
                    <button onClick={() => router.push('/documents')} className="text-[11px] font-medium text-slate-500 hover:text-[#0a4d8c] transition-colors flex items-center gap-1">
                      Ke Modul Dokumen <ChevronRight size={12} />
                    </button>
                  </div>
                  {docs.length > 0 ? (
                    <div className="space-y-2">
                      {docs.map(d => (
                        <div key={d.id}>
                          <button onClick={() => setExpandedRelatedId(current => current === `doc-${d.id}` ? null : `doc-${d.id}`)} className="flex w-full items-center justify-between gap-3 rounded-lg border border-slate-100 bg-slate-50 p-2.5 text-left transition hover:border-blue-200 hover:bg-blue-50/40">
                            <div className="min-w-0"><div className="truncate text-[12px] font-medium text-slate-800">{d.name}</div><div className="mt-0.5 text-[11px] text-slate-500">{d.type} • {d.uploadDate}</div></div>
                            <div className="flex shrink-0 items-center gap-2"><span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${d.status === 'Lulus Verifikasi' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'}`}>{d.status}</span>{expandedRelatedId === `doc-${d.id}` ? <ChevronDown size={15} className="text-slate-400" /> : <ChevronRight size={15} className="text-slate-400" />}</div>
                          </button>
                          {expandedRelatedId === `doc-${d.id}` && <div className="border-x border-b border-slate-200 bg-white px-3 py-3 text-xs text-slate-600"><div>{d.issues.length > 0 ? d.issues.join(" ") : "Tidak ada temuan pemeriksaan."}</div>{d.nextAction && <div className="mt-2"><span className="font-semibold text-[#0a4d8c]">Next Action:</span> {d.nextAction}</div>}<button onClick={() => router.push(`/documents/result?id=${d.id}`)} className="mt-3 font-semibold text-[#0a4d8c] hover:underline">Buka hasil pemeriksaan</button></div>}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-xs text-slate-500 italic py-2 text-center bg-slate-50 rounded-lg border border-dashed border-slate-200">Tidak ada dokumen tertaut.</div>
                  )}
                </div>

                {/* Guarantees Section */}
                <div>
                  <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
                    <div className="flex items-center gap-2 text-[#0a4d8c] font-semibold text-sm">
                      <ShieldCheck size={16} />
                      Jaminan (D2)
                    </div>
                    <button onClick={() => router.push('/guarantees')} className="text-[11px] font-medium text-slate-500 hover:text-[#0a4d8c] transition-colors flex items-center gap-1">
                      Ke Modul Jaminan <ChevronRight size={12} />
                    </button>
                  </div>
                  {guars.length > 0 ? (
                    <div className="space-y-2">
                      {guars.map(g => (
                        <div key={g.id}>
                          <button onClick={() => setExpandedRelatedId(current => current === `guarantee-${g.id}` ? null : `guarantee-${g.id}`)} className="flex w-full items-center justify-between gap-3 rounded-lg border border-slate-100 bg-slate-50 p-2.5 text-left transition hover:border-blue-200 hover:bg-blue-50/40">
                            <div className="min-w-0"><div className="truncate text-[12px] font-medium text-slate-800">{g.vendor}</div><div className="mt-0.5 text-[11px] text-slate-500">{g.type} • Jatuh tempo: {g.expiryDate}</div></div>
                            <div className="flex shrink-0 items-center gap-2"><span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${g.status === 'Aktif' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'}`}>{g.status}</span>{expandedRelatedId === `guarantee-${g.id}` ? <ChevronDown size={15} className="text-slate-400" /> : <ChevronRight size={15} className="text-slate-400" />}</div>
                          </button>
                          {expandedRelatedId === `guarantee-${g.id}` && <div className="border-x border-b border-slate-200 bg-white px-3 py-3 text-xs text-slate-600"><div><span className="font-semibold">{g.referenceNo}</span> • {g.issuer} • {g.value}</div>{g.nextAction && <div className="mt-2"><span className="font-semibold text-[#0a4d8c]">Next Action:</span> {g.nextAction}</div>}<button onClick={() => router.push('/guarantees')} className="mt-3 font-semibold text-[#0a4d8c] hover:underline">Buka modul jaminan</button></div>}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-xs text-slate-500 italic py-2 text-center bg-slate-50 rounded-lg border border-dashed border-slate-200">Tidak ada jaminan tertaut.</div>
                  )}
                </div>

                {/* Deadlines Section */}
                <div>
                  <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
                    <div className="flex items-center gap-2 text-[#0a4d8c] font-semibold text-sm">
                      <CalendarClock size={16} />
                      SLA & Jatuh Tempo (D4)
                    </div>
                    <button onClick={() => router.push('/deadlines')} className="text-[11px] font-medium text-slate-500 hover:text-[#0a4d8c] transition-colors flex items-center gap-1">
                      Ke Modul SLA <ChevronRight size={12} />
                    </button>
                  </div>
                  {slas.length > 0 ? (
                    <div className="space-y-2">
                      {slas.map(s => (
                        <div key={s.id}>
                          <button onClick={() => setExpandedRelatedId(current => current === `sla-${s.id}` ? null : `sla-${s.id}`)} className="flex w-full items-center justify-between gap-3 rounded-lg border border-slate-100 bg-slate-50 p-2.5 text-left transition hover:border-blue-200 hover:bg-blue-50/40">
                            <div className="min-w-0"><div className="truncate text-[12px] font-medium text-slate-800">{s.taskName}</div><div className="mt-0.5 text-[11px] text-slate-500">PIC: {s.pic} • Target: {s.targetDate}</div></div>
                            <div className="flex shrink-0 items-center gap-2"><span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${s.status === 'On Track' || s.status === 'Selesai' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : s.status === 'At Risk' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-red-50 text-red-700 border-red-200'}`}>{s.status}</span>{expandedRelatedId === `sla-${s.id}` ? <ChevronDown size={15} className="text-slate-400" /> : <ChevronRight size={15} className="text-slate-400" />}</div>
                          </button>
                          {expandedRelatedId === `sla-${s.id}` && <div className="border-x border-b border-slate-200 bg-white px-3 py-3 text-xs text-slate-600"><div><span className="font-semibold">Milestone:</span> {s.milestone} • Urgensi: {s.urgencyLevel}</div>{s.nextAction && <div className="mt-2"><span className="font-semibold text-[#0a4d8c]">Next Action:</span> {s.nextAction}</div>}<button onClick={() => router.push('/deadlines')} className="mt-3 font-semibold text-[#0a4d8c] hover:underline">Buka modul SLA</button></div>}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-xs text-slate-500 italic py-2 text-center bg-slate-50 rounded-lg border border-dashed border-slate-200">Tidak ada SLA tertaut.</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })()}
      {/* ADD REQUEST MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-transparent pointer-events-none">
          <div className="bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col pointer-events-auto animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-[#0a4d8c]">
              <div className="flex items-center gap-2">
                <PlusCircle size={18} className="text-white" />
                <h3 className="font-bold text-white text-sm">Tambah Request Baru</h3>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-blue-200 hover:text-white transition-colors">
                <XCircle size={20} />
              </button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              
              if (addRequest) {
                addRequest({
                  id: `REQ-${Date.now().toString().slice(-4)}`,
                  title: formData.get('title') as string,
                  pic: formData.get('pic') as string,
                  amount: formData.get('amount') as string,
                  amountRaw: 50000000,
                  stage: "Persiapan",
                  currentStep: "Rapat Pra-Tender",
                  department: formData.get('department') as string,
                  fpp: formData.get('fpp') as string || `FPP-${Date.now().toString().slice(-4)}`,
                  daysInStage: 0,
                  isUrgent: formData.get('priority') === 'Urgent',
                  createdAt: new Date().toISOString().split('T')[0],
                  updatedAt: new Date().toISOString().split('T')[0]
                });
                alert('Request baru berhasil ditambahkan!');
                setShowAddModal(false);
              }
            }}>
              <div className="p-6">
                <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-3 mb-5 flex items-start gap-3">
                  <AlertCircle size={16} className="text-blue-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-800 leading-relaxed">
                    Pastikan informasi yang dimasukkan sudah sesuai dengan dokumen pendukung (FPP). Request baru akan otomatis masuk ke tahap <strong>Persiapan</strong>.
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-5 mb-5">
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Judul Pengadaan <span className="text-red-500">*</span></label>
                    <input required name="title" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#0a4d8c] focus:ring-1 focus:ring-[#0a4d8c]" placeholder="Contoh: Pengadaan Perangkat Jaringan (Router/Switch)" />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Nomor FPP <span className="text-red-500">*</span></label>
                    <input required name="fpp" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#0a4d8c] focus:ring-1 focus:ring-[#0a4d8c]" placeholder="Contoh: FPP-2026-0801" />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">PIC Procurement <span className="text-red-500">*</span></label>
                    <input required name="pic" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#0a4d8c] focus:ring-1 focus:ring-[#0a4d8c]" placeholder="Contoh: Budi Santoso" />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Nilai Pengadaan <span className="text-red-500">*</span></label>
                    <input required name="amount" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#0a4d8c] focus:ring-1 focus:ring-[#0a4d8c]" placeholder="Contoh: Rp 150.0 Jt" />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Fungsi / Departemen <span className="text-red-500">*</span></label>
                    <select required name="department" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#0a4d8c] focus:ring-1 focus:ring-[#0a4d8c] bg-white">
                      <option value="IT Infrastructure">IT Infrastructure</option>
                      <option value="Operations">Operations</option>
                      <option value="HR">Human Resources</option>
                      <option value="Creative">Creative</option>
                      <option value="General Affairs">General Affairs</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Tingkat Prioritas <span className="text-red-500">*</span></label>
                    <select required name="priority" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#0a4d8c] focus:ring-1 focus:ring-[#0a4d8c] bg-white">
                      <option value="Normal">Normal</option>
                      <option value="Urgent">Urgent (Prioritas Tinggi)</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end">
                <button type="submit" className="px-6 py-2.5 bg-[#0a4d8c] hover:bg-[#093e6f] text-white text-sm font-bold rounded-lg transition-all shadow-sm hover:shadow flex items-center gap-2">
                  <PlusCircle size={16} />
                  Buat Request Baru
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
