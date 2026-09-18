"use client";

import { useState, useMemo } from "react";
import { Search, Filter, AlertCircle, Clock, CheckCircle2, ChevronDown, ChevronRight, GripVertical, XCircle, FileText, LayoutList, LayoutGrid, CalendarClock, ShieldCheck, PlusCircle, Eye } from "lucide-react";
import { TrackerItem, TrackerStage } from "./types";
import { useProcurement } from "@/context/ProcurementContext";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import type { DeadlineItem, ProcurementOperationalStatus, ProcurementStep } from "@/lib/types";
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
  { id: "On Going", title: "On Going", color: "text-white", bg: "bg-white", border: "border-slate-200", headerBg: "bg-[#0a4d8c]" },
  { id: "On Hold", title: "On Hold", color: "text-white", bg: "bg-white", border: "border-slate-200", headerBg: "bg-[#0a4d8c]" },
  { id: "Batal", title: "Batal", color: "text-white", bg: "bg-white", border: "border-slate-200", headerBg: "bg-[#0a4d8c]" },
];

function DeadlineEditor({ deadline, onClose, onSave }: { deadline: DeadlineItem; onClose: () => void; onSave: (changes: Partial<DeadlineItem>) => void }) {
  return createPortal(
    <div className="fixed inset-0 z-[100] flex min-h-dvh items-center justify-center overflow-y-auto bg-slate-950/50 p-4" onClick={onClose}>
      <form
        className="w-full max-w-lg overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
        onSubmit={(event) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          const startDate = String(formData.get("startDate"));
          const targetDate = String(formData.get("targetDate"));
          if (targetDate < startDate) {
            alert("Target selesai tidak boleh lebih awal dari tanggal mulai.");
            return;
          }
          onSave({
            taskName: String(formData.get("taskName")),
            pic: String(formData.get("pic")),
            milestone: String(formData.get("milestone")),
            startDate,
            targetDate,
            nextAction: String(formData.get("nextAction")),
            overdueReason: String(formData.get("overdueReason")),
          });
        }}
      >
        <div className="flex items-center justify-between bg-[#0a4d8c] px-5 py-4 text-white"><div><h2 className="text-sm font-bold">Edit SLA Pekerjaan</h2><p className="mt-1 text-xs text-blue-100">Atur rentang waktu dan tindak lanjut SLA.</p></div><button type="button" onClick={onClose} className="text-blue-100 hover:text-white"><XCircle size={20} /></button></div>
        <div className="grid gap-4 p-5 sm:grid-cols-2">
          <label className="sm:col-span-2"><span className="mb-1 block text-xs font-semibold text-slate-700">Nama aktivitas</span><input required name="taskName" defaultValue={deadline.taskName} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-[#0a4d8c] focus:outline-none" /></label>
          <label><span className="mb-1 block text-xs font-semibold text-slate-700">PIC</span><input required name="pic" defaultValue={deadline.pic} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-[#0a4d8c] focus:outline-none" /></label>
          <label><span className="mb-1 block text-xs font-semibold text-slate-700">Milestone</span><input required name="milestone" defaultValue={deadline.milestone} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-[#0a4d8c] focus:outline-none" /></label>
          <label><span className="mb-1 block text-xs font-semibold text-slate-700">Tanggal mulai</span><input required type="date" name="startDate" defaultValue={deadline.startDate ?? ""} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-[#0a4d8c] focus:outline-none" /></label>
          <label><span className="mb-1 block text-xs font-semibold text-slate-700">Target selesai</span><input required type="date" name="targetDate" defaultValue={deadline.targetDate} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-[#0a4d8c] focus:outline-none" /></label>
          <label className="sm:col-span-2"><span className="mb-1 block text-xs font-semibold text-slate-700">Next action</span><textarea required name="nextAction" rows={3} defaultValue={deadline.nextAction ?? ""} className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-[#0a4d8c] focus:outline-none" /></label>
          <label className="sm:col-span-2"><span className="mb-1 block text-xs font-semibold text-slate-700">Alasan keterlambatan</span><textarea name="overdueReason" rows={2} defaultValue={deadline.overdueReason ?? ""} placeholder="Diisi bila SLA melewati target selesai" className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-[#0a4d8c] focus:outline-none" /></label>
        </div>
        <div className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50 px-5 py-4"><button type="button" onClick={onClose} className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-200">Batal</button><button type="submit" className="rounded-lg bg-[#0a4d8c] px-4 py-2 text-sm font-semibold text-white hover:bg-[#093e6f]">Simpan SLA</button></div>
      </form>
    </div>
  , document.body);
}

function DeadlineCreator({ requestId, pic, department, onClose, onSave }: { requestId: string; pic: string; department: string; onClose: () => void; onSave: (deadline: DeadlineItem) => void }) {
  return createPortal(
    <div className="fixed inset-0 z-[100] flex min-h-dvh items-center justify-center overflow-y-auto bg-slate-950/50 p-4" onClick={onClose}>
      <form className="w-full max-w-lg overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl" onClick={(event) => event.stopPropagation()} onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const startDate = String(formData.get("startDate"));
        const targetDate = String(formData.get("targetDate"));
        if (targetDate < startDate) { alert("Target selesai tidak boleh lebih awal dari tanggal mulai."); return; }
        onSave({ id: `SLA-${Date.now()}`, requestId, taskName: String(formData.get("taskName")), milestone: String(formData.get("milestone")), pic: String(formData.get("pic")), department, startDate, targetDate, daysRemaining: 0, status: "On Track", urgencyLevel: formData.get("urgencyLevel") as DeadlineItem["urgencyLevel"], nextAction: String(formData.get("nextAction")), overdueReason: String(formData.get("overdueReason")) });
      }}>
        <div className="flex items-center justify-between bg-[#0a4d8c] px-5 py-4 text-white"><div><h2 className="text-sm font-bold">Tambah SLA untuk Pekerjaan</h2><p className="mt-1 text-xs text-blue-100">Isi aktivitas terlebih dahulu, lalu atur periode SLA.</p></div><button type="button" onClick={onClose} className="text-blue-100 hover:text-white"><XCircle size={20} /></button></div>
        <div className="grid gap-4 p-5 sm:grid-cols-2">
          <label className="sm:col-span-2"><span className="mb-1 block text-xs font-semibold text-slate-700">Nama aktivitas</span><input required autoFocus name="taskName" placeholder="Contoh: Rapat pra-tender" className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-[#0a4d8c] focus:outline-none" /></label>
          <label><span className="mb-1 block text-xs font-semibold text-slate-700">PIC</span><input required name="pic" defaultValue={pic} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-[#0a4d8c] focus:outline-none" /></label>
          <label><span className="mb-1 block text-xs font-semibold text-slate-700">Milestone</span><select required name="milestone" className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-[#0a4d8c] focus:outline-none">{PROCUREMENT_STEPS.map(step => <option key={step} value={step}>{step}</option>)}</select></label>
          <label><span className="mb-1 block text-xs font-semibold text-slate-700">Tanggal mulai</span><input required type="date" name="startDate" className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-[#0a4d8c] focus:outline-none" /></label>
          <label><span className="mb-1 block text-xs font-semibold text-slate-700">Target selesai</span><input required type="date" name="targetDate" className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-[#0a4d8c] focus:outline-none" /></label>
          <label><span className="mb-1 block text-xs font-semibold text-slate-700">Urgensi</span><select name="urgencyLevel" defaultValue="Medium" className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-[#0a4d8c] focus:outline-none"><option>Low</option><option>Medium</option><option>High</option><option>Critical</option></select></label>
          <label className="sm:col-span-2"><span className="mb-1 block text-xs font-semibold text-slate-700">Next action</span><textarea required name="nextAction" rows={3} placeholder="Tindakan yang harus dilakukan PIC" className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-[#0a4d8c] focus:outline-none" /></label>
          <label className="sm:col-span-2"><span className="mb-1 block text-xs font-semibold text-slate-700">Alasan keterlambatan</span><textarea name="overdueReason" rows={2} placeholder="Opsional; isi bila target nantinya terlambat" className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-[#0a4d8c] focus:outline-none" /></label>
        </div>
        <div className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50 px-5 py-4"><button type="button" onClick={onClose} className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-200">Batal</button><button type="submit" className="rounded-lg bg-[#0a4d8c] px-4 py-2 text-sm font-semibold text-white hover:bg-[#093e6f]">Simpan SLA</button></div>
      </form>
    </div>
  , document.body);
}

export default function TrackerPage() {
  const { state, moveRequestStep, updateRequestOperationalStatus, addRequest, addDeadline, updateDeadline } = useProcurement();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [operationalStatusFilter, setOperationalStatusFilter] = useState<ProcurementOperationalStatus | "All">("All");
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [expandedRelatedId, setExpandedRelatedId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingDeadlineId, setEditingDeadlineId] = useState<string | null>(null);
  const [addingDeadlineRequestId, setAddingDeadlineRequestId] = useState<string | null>(null);
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
  const [showFullTimeline, setShowFullTimeline] = useState(false);
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");
  const [statusReasonDraft, setStatusReasonDraft] = useState("");

  const openRequestDetail = (requestId: string) => {
    setShowFullTimeline(false);
    setStatusReasonDraft(state.requests.find(request => request.id === requestId)?.operationalStatusReason ?? "");
    setSelectedRequestId(requestId);
  };

  // Compute time status per pekerjaan dari SLA dan jatuh tempo.
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
    stage: r.stage,
    operationalStatus: r.operationalStatus,
    currentStep: r.currentStep,
    department: r.department,
    daysInStage: r.daysInStage,
    isUrgent: r.isUrgent,
  })), [state.requests]);

  const deadlines = useMemo(() => state.deadlines.map(deadline => ({
    ...deadline,
    ...getDeadlineTiming(deadline.targetDate, state.settings.slaWarningDays, deadline.status),
  })), [state.deadlines, state.settings.slaWarningDays]);

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.pic.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.id.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesDept = departmentFilter === "All" || item.department === departmentFilter;
      const matchesOperationalStatus = operationalStatusFilter === "All" || item.operationalStatus === operationalStatusFilter;
      
      return matchesSearch && matchesDept && matchesOperationalStatus;
    });
  }, [items, searchQuery, departmentFilter, operationalStatusFilter]);

  // Group pekerjaan berdasarkan status operasional, bukan tahap procurement.
  const itemsByStage = useMemo(() => {
    const grouped = { "On Going": [], "On Hold": [], "Batal": [] } as Record<TrackerStage, TrackerItem[]>;
    filteredItems.forEach(item => grouped[item.operationalStatus].push(item));
    return grouped;
  }, [filteredItems]);

  const totalItemsCount = filteredItems.length;
  const onGoingCount = filteredItems.filter(item => item.operationalStatus === "On Going").length;
  const onHoldCount = filteredItems.filter(item => item.operationalStatus === "On Hold").length;
  const cancelledCount = filteredItems.filter(item => item.operationalStatus === "Batal").length;
  const onGoingPct = totalItemsCount ? (onGoingCount / totalItemsCount) * 100 : 0;
  const onHoldPct = totalItemsCount ? (onHoldCount / totalItemsCount) * 100 : 0;
  
  const pieChartStyle = totalItemsCount === 0 
    ? { background: 'conic-gradient(#f1f5f9 0% 100%)' }
    : { background: `conic-gradient(
        #10b981 0% ${onGoingPct}%, 
        #f59e0b ${onGoingPct}% ${onGoingPct + onHoldPct}%, 
        #ef4444 ${onGoingPct + onHoldPct}% 100%
      )`};

  // Drag and drop memindahkan status operasional pekerjaan.
  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData("itemId", id);
    // Add some visual feedback to the dragged item if needed
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Necessary to allow dropping
  };

  const handleDrop = (e: React.DragEvent, status: TrackerStage) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("itemId");
    updateRequestOperationalStatus(id, status);
  };

  return (
    <div className="space-y-6 pb-12">
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
            <select
              value={operationalStatusFilter}
              onChange={(e) => setOperationalStatusFilter(e.target.value as ProcurementOperationalStatus | "All")}
              className="w-full sm:w-[145px] px-3 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium focus:outline-none focus:border-[#0a4d8c] appearance-none cursor-pointer hover:bg-slate-50 transition-colors"
            >
              <option value="All">Semua Status</option>
              <option value="On Going">On Going</option>
              <option value="On Hold">On Hold</option>
              <option value="Batal">Batal</option>
            </select>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#0a4d8c] hover:bg-[#093e6f] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm whitespace-nowrap"
          >
            + Tambah Request
          </button>
          <div className="flex shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-white">
            <button type="button" onClick={() => setViewMode("kanban")} title="Tampilan Kanban" className={`p-2 transition-colors ${viewMode === "kanban" ? "bg-blue-50 text-[#0a4d8c]" : "text-slate-400 hover:bg-slate-50"}`}><LayoutGrid size={18} /></button>
            <button type="button" onClick={() => setViewMode("list")} title="Tampilan List" className={`border-l border-slate-200 p-2 transition-colors ${viewMode === "list" ? "bg-blue-50 text-[#0a4d8c]" : "text-slate-400 hover:bg-slate-50"}`}><LayoutList size={18} /></button>
          </div>
        </div>
      </div>
      {viewMode === "list" && <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4"><div><h2 className="text-sm font-bold text-slate-800">Daftar Pekerjaan</h2><p className="mt-1 text-xs text-slate-500">Tampilan ringkas untuk memantau banyak pekerjaan.</p></div><span className="text-xs font-semibold text-slate-500">{filteredItems.length} pekerjaan</span></div>
        <div className="overflow-x-auto"><table className="w-full min-w-[900px] text-left"><thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500"><tr><th className="px-5 py-3">Pekerjaan</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">PIC</th><th className="px-4 py-3">Tahap</th><th className="px-4 py-3">Nilai</th><th className="px-4 py-3">SLA</th><th className="px-5 py-3"></th></tr></thead><tbody className="divide-y divide-slate-100">{filteredItems.map(item => <tr key={item.id} className="hover:bg-slate-50/70"><td className="px-5 py-3"><div className="text-xs text-slate-400">{item.id}</div><div className="mt-1 text-sm font-semibold text-slate-800">{item.title}</div></td><td className="px-4 py-3"><span className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${item.operationalStatus === "On Going" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : item.operationalStatus === "On Hold" ? "border-amber-200 bg-amber-50 text-amber-700" : "border-red-200 bg-red-50 text-red-700"}`}>{item.operationalStatus}</span></td><td className="px-4 py-3 text-xs text-slate-600">{item.pic}</td><td className="px-4 py-3 text-xs text-slate-600">{item.currentStep}</td><td className="px-4 py-3 text-xs font-medium text-slate-700">{item.amount}</td><td className="px-4 py-3 text-xs font-medium text-slate-600">{timeStatusMap[item.id] ?? "-"}</td><td className="px-5 py-3 text-right"><button onClick={() => openRequestDetail(item.id)} className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:border-[#0a4d8c] hover:text-[#0a4d8c]"><Eye size={13} /> Buka Detail</button></td></tr>)}</tbody></table></div>
      </section>}
      {/* Kanban Board Container */}
      {viewMode === "kanban" && <div className="h-[calc(100vh-240px)] min-h-[600px] overflow-x-auto overflow-y-hidden pb-1 hide-scrollbar">
        <div className="flex h-full min-w-[960px] gap-5 pb-1">
          {/* Statistics Panel */}
          <div className="flex min-w-0 flex-1 flex-col rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
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

              {/* Operational-status breakdown */}
              <div className="space-y-3.5 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="flex items-center justify-between text-[12px]">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                    <span className="text-slate-600 font-medium">On Going</span>
                  </div>
                  <span className="font-bold text-slate-700">{onGoingCount}</span>
                </div>
                <div className="flex items-center justify-between text-[12px]">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                    <span className="text-slate-600 font-medium">On Hold</span>
                  </div>
                  <span className="font-bold text-slate-700">{onHoldCount}</span>
                </div>
                <div className="flex items-center justify-between text-[12px]">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                    <span className="text-slate-600 font-medium">Batal</span>
                  </div>
                  <span className="font-bold text-slate-700">{cancelledCount}</span>
                </div>
              </div>
            </div>
          </div>

          {COLUMNS.map(col => (
            <div 
              key={col.id} 
              className={`flex min-w-0 flex-1 flex-col rounded-xl border ${col.border} ${col.bg} overflow-hidden`}
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
                    onClick={() => setExpandedCardId(current => current === item.id ? null : item.id)}
                    className={`bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group hover:border-[#0a4d8c]/30 ${expandedCardId === item.id ? "p-4 ring-2 ring-blue-100" : "px-3 py-2.5"}`}
                  >
                    <div className={`flex items-start justify-between ${expandedCardId === item.id ? "mb-2" : "mb-1"}`}>
                      <div className="text-[11px] font-medium text-slate-400 tracking-wider">{item.id}</div>
                      <GripVertical size={14} className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    
                    <h4 className={`font-semibold text-slate-800 text-[13px] leading-snug line-clamp-2 ${expandedCardId === item.id ? "mb-3" : ""}`}>
                      {item.title}
                    </h4>
                    {expandedCardId === item.id && <div className="flex flex-col gap-2 mb-4 animate-in fade-in slide-in-from-top-1 duration-200">
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
                    </div>}
                    
                    {expandedCardId === item.id && <div className="mt-auto flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3">
                      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5">
                      {item.operationalStatus === "Batal" ? (
                        <div className="flex items-center gap-1.5 text-red-600 text-[11px] font-semibold">
                          <AlertCircle size={14} />
                          <span>Dibatalkan</span>
                        </div>
                      ) : item.operationalStatus === "On Hold" ? (
                        <div className="flex items-center gap-1.5 text-amber-700 text-[11px] font-semibold">
                          <Clock size={14} />
                          <span>Ditahan</span>
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
                      
                      {/* Status waktu dari SLA dan jatuh tempo */}
                      {timeStatusMap[item.id] && item.operationalStatus !== "Batal" && (
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
                      </div>
                      <button 
                        onClick={(event) => { event.stopPropagation(); openRequestDetail(item.id); }}
                        title="Buka detail pekerjaan"
                        className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-slate-600 transition-colors hover:border-[#0a4d8c] hover:bg-blue-50 hover:text-[#0a4d8c]"
                      >
                        <Eye size={13} />
                        <span>Buka Detail</span>
                      </button>
                    </div>}
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
      </div>}

      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-800">SLA & Jatuh Tempo Pekerjaan</h2>
            <p className="mt-1 text-xs text-slate-500">SLA dan jatuh tempo terhubung ke setiap pekerjaan. Pilih pekerjaan untuk melihat timeline, lalu edit SLA dari daftar ini.</p>
          </div>
          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-[#0a4d8c]">{deadlines.length} SLA</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <tr><th className="px-5 py-3">Pekerjaan / SLA</th><th className="px-4 py-3">PIC</th><th className="px-4 py-3">Periode</th><th className="px-4 py-3">Status waktu</th><th className="px-5 py-3 text-right">Aksi</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {deadlines.map(deadline => {
                const request = state.requests.find(item => item.id === deadline.requestId);
                return <tr key={deadline.id} className="hover:bg-slate-50/70">
                  <td className="px-5 py-3"><button onClick={() => openRequestDetail(deadline.requestId)} className="text-left hover:text-[#0a4d8c]"><div className="font-medium text-slate-800">{request?.title ?? deadline.requestId}</div><div className="mt-0.5 text-xs text-slate-500">{deadline.taskName} · {deadline.milestone}</div></button></td>
                  <td className="px-4 py-3 text-xs text-slate-600">{deadline.pic}</td>
                  <td className="px-4 py-3 text-xs text-slate-600"><div>{deadline.startDate ?? "Belum diatur"}</div><div className="mt-0.5 font-medium text-slate-800">s.d. {deadline.targetDate}</div></td>
                  <td className="px-4 py-3"><span className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-bold ${deadline.status === "Overdue" ? "border-red-200 bg-red-50 text-red-700" : deadline.status === "At Risk" ? "border-amber-200 bg-amber-50 text-amber-700" : "border-emerald-200 bg-emerald-50 text-emerald-700"}`}>{deadline.status} · {deadline.status === "Selesai" ? "Selesai" : deadline.daysRemaining < 0 ? `${Math.abs(deadline.daysRemaining)} hari terlambat` : `${deadline.daysRemaining} hari`}</span></td>
                  <td className="px-5 py-3 text-right"><button onClick={() => setEditingDeadlineId(deadline.id)} className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-[#0a4d8c] hover:bg-blue-100">Edit SLA</button></td>
                </tr>;
              })}
            </tbody>
          </table>
        </div>
      </section>

      {editingDeadlineId && (() => {
        const deadline = state.deadlines.find(item => item.id === editingDeadlineId);
        if (!deadline) return null;
        return <DeadlineEditor deadline={deadline} onClose={() => setEditingDeadlineId(null)} onSave={(changes) => { updateDeadline(deadline.id, changes); setEditingDeadlineId(null); }} />;
      })()}
      {addingDeadlineRequestId && (() => {
        const request = state.requests.find(item => item.id === addingDeadlineRequestId);
        if (!request) return null;
        return <DeadlineCreator requestId={request.id} pic={request.pic} department={request.department} onClose={() => setAddingDeadlineRequestId(null)} onSave={(deadline) => { addDeadline(deadline); setAddingDeadlineRequestId(null); }} />;
      })()}

      {/* DETAIL MODAL (Helicopter View) */}
      {selectedRequestId && (() => {
        const docs = state.documents.filter(d => d.requestId === selectedRequestId);
        const guars = state.guarantees.filter(d => d.requestId === selectedRequestId);
        const slas = state.deadlines.filter(d => d.requestId === selectedRequestId).map(deadline => ({ ...deadline, ...getDeadlineTiming(deadline.targetDate, state.settings.slaWarningDays, deadline.status) }));
        const history = state.history.filter(item => item.requestId === selectedRequestId);
        const request = state.requests.find(r => r.id === selectedRequestId);
        const milestones = state.milestones.filter(m => m.requestId === selectedRequestId);
        const currentMilestoneIndex = milestones.findIndex(m => m.status === "In Progress");
        const nextMilestone = milestones.find(m => m.status === "Pending");
        const completedMilestones = milestones.filter(m => m.status === "Done").length;
        const timelineStart = showFullTimeline ? 0 : Math.max(0, currentMilestoneIndex > -1 ? currentMilestoneIndex - 1 : 0);
        const visibleMilestones = showFullTimeline ? milestones : milestones.slice(timelineStart, timelineStart + 3);
        const hasHiddenMilestones = !showFullTimeline && milestones.length > visibleMilestones.length;
        
        return createPortal(
          <div className="fixed inset-0 z-[100] flex min-h-dvh items-center justify-center overflow-y-auto bg-slate-950/50 p-4" onClick={() => setSelectedRequestId(null)}>
            <div role="dialog" aria-modal="true" aria-labelledby="tracker-detail-title" className="flex max-h-[calc(100dvh-2rem)] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
              <div className="flex items-start justify-between gap-4 bg-[#0a4d8c] px-5 py-4 sm:px-7">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 text-blue-100">
                    <LayoutList size={18} />
                    <span className="text-[11px] font-bold uppercase tracking-[0.16em]">Ringkasan Pekerjaan</span>
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
                      <label className="w-full lg:w-44">
                        <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-500">Status pekerjaan</span>
                        <select
                          value={request.operationalStatus}
                          onChange={(event) => updateRequestOperationalStatus(selectedRequestId, event.target.value as ProcurementOperationalStatus, event.target.value === "On Going" ? "" : statusReasonDraft)}
                          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 focus:border-[#0a4d8c] focus:outline-none"
                        >
                          <option value="On Going">On Going</option>
                          <option value="On Hold">On Hold</option>
                          <option value="Batal">Batal</option>
                        </select>
                      </label>
                    </div>
                    <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/80"><div className="h-full rounded-full bg-[#0a4d8c] transition-all" style={{ width: `${milestones.length ? ((completedMilestones + (currentMilestoneIndex >= 0 ? 1 : 0)) / milestones.length) * 100 : 0}%` }} /></div>
                    {nextMilestone && <div className="mt-2 text-[11px] font-medium text-slate-500">Berikutnya: <span className="font-semibold text-slate-700">{nextMilestone.step}</span></div>}
                    {request.operationalStatus !== "On Going" && <div className="mt-4 border-t border-blue-100 pt-4"><label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">Alasan status {request.operationalStatus}</label><div className="mt-2 flex flex-col gap-2 sm:flex-row"><input value={statusReasonDraft} onChange={(event) => setStatusReasonDraft(event.target.value)} placeholder={request.operationalStatus === "On Hold" ? "Contoh: menunggu klarifikasi user" : "Contoh: kebutuhan dibatalkan peminta"} className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs focus:border-[#0a4d8c] focus:outline-none" /><button type="button" onClick={() => updateRequestOperationalStatus(selectedRequestId, request.operationalStatus, statusReasonDraft)} className="rounded-lg border border-blue-200 bg-white px-3 py-2 text-xs font-semibold text-[#0a4d8c] hover:bg-blue-50">Simpan Alasan</button></div></div>}
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
                      const milestoneSla = slas.find(sla => sla.milestone === milestone.step);
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
                            {milestoneSla && <div className={`mt-3 flex flex-wrap items-center justify-between gap-2 rounded-md border px-2.5 py-2 text-[11px] ${milestoneSla.status === "Overdue" ? "border-red-200 bg-red-50 text-red-700" : milestoneSla.status === "At Risk" ? "border-amber-200 bg-amber-50 text-amber-700" : "border-blue-100 bg-blue-50/50 text-[#0a4d8c]"}`}>
                              <div><span className="font-semibold">SLA:</span> {milestoneSla.startDate ?? "-"} s.d. {milestoneSla.targetDate} · {milestoneSla.status === "Overdue" ? `${Math.abs(milestoneSla.daysRemaining)} hari terlambat` : milestoneSla.status === "Selesai" ? "Selesai" : `${milestoneSla.daysRemaining} hari tersisa`}{milestoneSla.status === "Overdue" && milestoneSla.overdueReason ? <span className="block pt-1 text-red-600">Alasan: {milestoneSla.overdueReason}</span> : null}</div>
                              <button type="button" onClick={() => setEditingDeadlineId(milestoneSla.id)} className="shrink-0 rounded border border-current/30 bg-white/70 px-2 py-1 font-semibold hover:bg-white">Edit SLA</button>
                            </div>}
                            {!milestoneSla && <button type="button" onClick={() => setAddingDeadlineRequestId(selectedRequestId)} className="mt-3 text-[11px] font-semibold text-[#0a4d8c] hover:underline">+ Tambah SLA untuk tahapan ini</button>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {hasHiddenMilestones && <button type="button" onClick={() => setShowFullTimeline(true)} className="mt-4 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-left text-xs font-semibold text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-[#0a4d8c]">Tampilkan {milestones.length - visibleMilestones.length} tahapan lainnya</button>}
                  {showFullTimeline && milestones.length > 3 && <button type="button" onClick={() => setShowFullTimeline(false)} className="mt-4 text-xs font-semibold text-[#0a4d8c] hover:underline">Ringkas timeline</button>}
                </section>
                
                {/* Documents Section */}
                <div>
                  <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
                    <div className="flex items-center gap-2 text-[#0a4d8c] font-semibold text-sm">
                      <FileText size={16} />
                      Dokumen
                    </div>
                    <button onClick={() => router.push('/dashboard/documents')} className="text-[11px] font-medium text-slate-500 hover:text-[#0a4d8c] transition-colors flex items-center gap-1">
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
                          {expandedRelatedId === `doc-${d.id}` && <div className="border-x border-b border-slate-200 bg-white px-3 py-3 text-xs text-slate-600"><div>{d.issues.length > 0 ? d.issues.join(" ") : "Tidak ada temuan pemeriksaan."}</div>{d.nextAction && <div className="mt-2"><span className="font-semibold text-[#0a4d8c]">Next Action:</span> {d.nextAction}</div>}<button onClick={() => router.push(`/dashboard/documents/result?id=${d.id}`)} className="mt-3 font-semibold text-[#0a4d8c] hover:underline">Buka hasil pemeriksaan</button></div>}
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
                      Jaminan
                    </div>
                    <div className="flex items-center gap-3"><button onClick={() => router.push('/dashboard/guarantees')} className="text-[11px] font-medium text-slate-500 hover:text-[#0a4d8c] transition-colors flex items-center gap-1">Lihat Semua <ChevronRight size={12} /></button><button onClick={() => router.push(`/dashboard/guarantees/upload?requestId=${selectedRequestId}`)} className="rounded-md bg-[#0a4d8c] px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-[#093e6f]">+ Jaminan</button></div>
                  </div>
                  {guars.length > 0 ? (
                    <div className="space-y-2">
                      {guars.map(g => (
                        <div key={g.id}>
                          <button onClick={() => setExpandedRelatedId(current => current === `guarantee-${g.id}` ? null : `guarantee-${g.id}`)} className="flex w-full items-center justify-between gap-3 rounded-lg border border-slate-100 bg-slate-50 p-2.5 text-left transition hover:border-blue-200 hover:bg-blue-50/40">
                            <div className="min-w-0"><div className="truncate text-[12px] font-medium text-slate-800">{g.vendor}</div><div className="mt-0.5 text-[11px] text-slate-500">{g.type} • Jatuh tempo: {g.expiryDate}</div></div>
                            <div className="flex shrink-0 items-center gap-2"><span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${g.status === 'Aktif' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'}`}>{g.status}</span>{expandedRelatedId === `guarantee-${g.id}` ? <ChevronDown size={15} className="text-slate-400" /> : <ChevronRight size={15} className="text-slate-400" />}</div>
                          </button>
                          {expandedRelatedId === `guarantee-${g.id}` && <div className="border-x border-b border-slate-200 bg-white px-3 py-3 text-xs text-slate-600"><div><span className="font-semibold">{g.referenceNo}</span> • {g.issuer} • {g.value}</div>{g.nextAction && <div className="mt-2"><span className="font-semibold text-[#0a4d8c]">Next Action:</span> {g.nextAction}</div>}<button onClick={() => router.push('/dashboard/guarantees')} className="mt-3 font-semibold text-[#0a4d8c] hover:underline">Buka modul jaminan</button></div>}
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
                      SLA & Jatuh Tempo
                    </div>
                    <button onClick={() => setAddingDeadlineRequestId(selectedRequestId)} className="rounded-md bg-[#0a4d8c] px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-[#093e6f]">+ Tambah SLA</button>
                  </div>
                  {slas.length > 0 ? (
                    <div className="space-y-2">
                      {slas.map(s => (
                        <div key={s.id}>
                          <button onClick={() => setExpandedRelatedId(current => current === `sla-${s.id}` ? null : `sla-${s.id}`)} className="flex w-full items-center justify-between gap-3 rounded-lg border border-slate-100 bg-slate-50 p-2.5 text-left transition hover:border-blue-200 hover:bg-blue-50/40">
                            <div className="min-w-0"><div className="truncate text-[12px] font-medium text-slate-800">{s.taskName}</div><div className="mt-0.5 text-[11px] text-slate-500">PIC: {s.pic} • Target: {s.targetDate}</div></div>
                            <div className="flex shrink-0 items-center gap-2"><span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${s.status === 'On Track' || s.status === 'Selesai' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : s.status === 'At Risk' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-red-50 text-red-700 border-red-200'}`}>{s.status}</span>{expandedRelatedId === `sla-${s.id}` ? <ChevronDown size={15} className="text-slate-400" /> : <ChevronRight size={15} className="text-slate-400" />}</div>
                          </button>
                          {expandedRelatedId === `sla-${s.id}` && <div className="border-x border-b border-slate-200 bg-white px-3 py-3 text-xs text-slate-600"><div><span className="font-semibold">Milestone:</span> {s.milestone} • Urgensi: {s.urgencyLevel}</div>{s.nextAction && <div className="mt-2"><span className="font-semibold text-[#0a4d8c]">Next Action:</span> {s.nextAction}</div>}<button onClick={() => setEditingDeadlineId(s.id)} className="mt-3 font-semibold text-[#0a4d8c] hover:underline">Edit SLA</button></div>}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-xs text-slate-500 italic py-2 text-center bg-slate-50 rounded-lg border border-dashed border-slate-200">Tidak ada SLA tertaut.</div>
                  )}
                </div>

                <section>
                  <div className="flex items-end justify-between gap-3 border-b border-slate-200 pb-3"><div><h4 className="text-sm font-bold text-slate-800">Histori Aktivitas</h4><p className="mt-1 text-xs text-slate-500">Perubahan penting pada pekerjaan, timeline, SLA, dokumen, dan jaminan.</p></div><span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600">{history.length} aktivitas</span></div>
                  {history.length > 0 ? <div className="relative mt-4 space-y-4 border-l border-slate-200 pl-5">{history.map(item => <div key={item.id} className="relative"><span className={`absolute -left-[25px] top-1.5 h-3 w-3 rounded-full border-2 border-white ${item.category === "SLA" ? "bg-amber-500" : item.category === "Jaminan" ? "bg-emerald-500" : item.category === "Dokumen" ? "bg-blue-500" : "bg-slate-500"}`} /><div className="flex flex-wrap items-center gap-2"><span className="text-xs font-semibold text-slate-800">{item.title}</span><span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500">{item.category}</span></div><p className="mt-1 text-xs text-slate-600">{item.description}</p><time className="mt-1 block text-[10px] text-slate-400">{new Date(item.createdAt).toLocaleString("id-ID")}</time></div>)}</div> : <div className="mt-4 rounded-lg border border-dashed border-slate-200 bg-slate-50 p-4 text-center text-xs text-slate-500">Belum ada aktivitas yang tercatat untuk pekerjaan ini.</div>}
                </section>
              </div>
            </div>
          </div>
        , document.body);
      })()}
      {/* ADD REQUEST MODAL */}
      {showAddModal && createPortal(
        <div className="fixed inset-0 z-[100] flex min-h-dvh items-center justify-center overflow-y-auto bg-slate-950/50 p-4" onClick={() => setShowAddModal(false)}>
          <div role="dialog" aria-modal="true" aria-labelledby="add-request-title" className="w-full max-w-2xl overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-[#0a4d8c]">
              <div className="flex items-center gap-2">
                <PlusCircle size={18} className="text-white" />
                <h3 id="add-request-title" className="font-bold text-white text-sm">Tambah Request Baru</h3>
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
                  operationalStatus: "On Going",
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
      , document.body)}
    </div>
  );
}
