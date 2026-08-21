"use client";

import { useState, useMemo } from "react";
import { Search, Filter, AlertCircle, Clock, CheckCircle2, ChevronRight, GripVertical } from "lucide-react";
import { TrackerItem, TrackerStage } from "./types";

const mockTrackerData: TrackerItem[] = [
  { id: "REQ-2026-101", title: "Pengadaan Server Rack 42U", pic: "Budi Santoso", amount: "Rp 120.000.000", stage: "PR", department: "IT Infrastructure", daysInStage: 2 },
  { id: "REQ-2026-102", title: "Lisensi Software Design 1 Tahun", pic: "Andi Wijaya", amount: "Rp 45.000.000", stage: "PR", department: "Creative", daysInStage: 5, isUrgent: true },
  { id: "REQ-2026-103", title: "Renovasi Ruang Meeting Lt. 4", pic: "Citra Dewi", amount: "Rp 85.500.000", stage: "CS30", department: "General Affairs", daysInStage: 12, isUrgent: true },
  { id: "REQ-2026-104", title: "Pengadaan Laptop Karyawan Baru (10 Unit)", pic: "Budi Santoso", amount: "Rp 150.000.000", stage: "CS30", department: "IT Infrastructure", daysInStage: 4 },
  { id: "REQ-2026-105", title: "Catering Event Tahunan", pic: "Diana Putri", amount: "Rp 35.000.000", stage: "PO", department: "HR", daysInStage: 1 },
  { id: "REQ-2026-106", title: "Kendaraan Operasional Cabang", pic: "Andi Wijaya", amount: "Rp 320.000.000", stage: "PO", department: "Operations", daysInStage: 7, isUrgent: true },
  { id: "REQ-2026-107", title: "Seragam Karyawan 2026", pic: "Citra Dewi", amount: "Rp 65.000.000", stage: "DONE", department: "HR", daysInStage: 20 },
  { id: "REQ-2026-108", title: "Upgrade Bandwidth Internet HO", pic: "Budi Santoso", amount: "Rp 15.000.000", stage: "PR", department: "IT Infrastructure", daysInStage: 1 },
];

const COLUMNS: { id: TrackerStage; title: string; color: string; bg: string; border: string; headerBg: string }[] = [
  { id: "PR", title: "Menunggu PR", color: "text-white", bg: "bg-white", border: "border-slate-200", headerBg: "bg-[#0a4d8c]" },
  { id: "CS30", title: "Proses CS30 / Sourcing", color: "text-white", bg: "bg-white", border: "border-slate-200", headerBg: "bg-[#0a4d8c]" },
  { id: "PO", title: "Pembuatan PO", color: "text-white", bg: "bg-white", border: "border-slate-200", headerBg: "bg-[#0a4d8c]" },
  { id: "DONE", title: "Selesai", color: "text-white", bg: "bg-white", border: "border-slate-200", headerBg: "bg-[#0a4d8c]" },
];

export default function TrackerPage() {
  const [items, setItems] = useState<TrackerItem[]>(mockTrackerData);
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All");

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
    const grouped = { PR: [], CS30: [], PO: [], DONE: [] } as Record<TrackerStage, TrackerItem[]>;
    filteredItems.forEach(item => grouped[item.stage].push(item));
    return grouped;
  }, [filteredItems]);

  const totalItemsCount = filteredItems.length;
  const prPct = totalItemsCount ? (itemsByStage["PR"].length / totalItemsCount) * 100 : 0;
  const cs30Pct = totalItemsCount ? (itemsByStage["CS30"].length / totalItemsCount) * 100 : 0;
  const poPct = totalItemsCount ? (itemsByStage["PO"].length / totalItemsCount) * 100 : 0;
  
  const pieChartStyle = totalItemsCount === 0 
    ? { background: 'conic-gradient(#f1f5f9 0% 100%)' }
    : { background: `conic-gradient(
        #cbd5e1 0% ${prPct}%, 
        #3b82f6 ${prPct}% ${prPct + cs30Pct}%, 
        #f59e0b ${prPct + cs30Pct}% ${prPct + cs30Pct + poPct}%, 
        #10b981 ${prPct + cs30Pct + poPct}% 100%
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
    setItems(prev => prev.map(item => item.id === id ? { ...item, stage } : item));
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
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-300"></div>
                    <span className="text-slate-600 font-medium">Menunggu PR</span>
                  </div>
                  <span className="font-bold text-slate-700">{itemsByStage["PR"].length}</span>
                </div>
                <div className="flex items-center justify-between text-[12px]">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
                    <span className="text-slate-600 font-medium">Proses CS30</span>
                  </div>
                  <span className="font-bold text-slate-700">{itemsByStage["CS30"].length}</span>
                </div>
                <div className="flex items-center justify-between text-[12px]">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                    <span className="text-slate-600 font-medium">Pembuatan PO</span>
                  </div>
                  <span className="font-bold text-slate-700">{itemsByStage["PO"].length}</span>
                </div>
                <div className="flex items-center justify-between text-[12px]">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                    <span className="text-slate-600 font-medium">Selesai</span>
                  </div>
                  <span className="font-bold text-slate-700">{itemsByStage["DONE"].length}</span>
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
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-500">Nilai</span>
                        <span className="font-semibold text-[#0a4d8c]">{item.amount}</span>
                      </div>
                    </div>
                    
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-auto">
                      {col.id === "DONE" ? (
                        <div className="flex items-center gap-1.5 text-emerald-600 text-[11px] font-semibold">
                          <CheckCircle2 size={14} />
                          <span>Selesai</span>
                        </div>
                      ) : item.isUrgent ? (
                        <div className="flex items-center gap-1.5 text-red-600 text-[11px] font-semibold bg-red-50 px-2 py-1 rounded-md border border-red-100">
                          <AlertCircle size={14} />
                          <span>Urgent ({item.daysInStage} hr)</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-medium">
                          <Clock size={14} />
                          <span>{item.daysInStage} hr di tahap ini</span>
                        </div>
                      )}
                      
                      <button className="w-6 h-6 flex items-center justify-center rounded-full bg-slate-50 hover:bg-[#0a4d8c] text-slate-400 hover:text-white transition-colors border border-slate-200 hover:border-transparent">
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
    </div>
  );
}
