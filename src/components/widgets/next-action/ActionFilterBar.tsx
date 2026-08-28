import { Search, Filter, CheckSquare } from "lucide-react";
import { ActionPriority, ActionSource } from "@/lib/types";

interface ActionFilterBarProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  sourceFilter: ActionSource | "All";
  setSourceFilter: (val: ActionSource | "All") => void;
  priorityFilter: ActionPriority | "All";
  setPriorityFilter: (val: ActionPriority | "All") => void;
  onMarkAllDone: () => void;
}

export function ActionFilterBar({ 
  searchQuery, 
  setSearchQuery, 
  sourceFilter, 
  setSourceFilter, 
  priorityFilter, 
  setPriorityFilter,
  onMarkAllDone
}: ActionFilterBarProps) {
  return (
    <div className="flex flex-col xl:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
      <div className="relative w-full flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input 
          type="text" 
          placeholder="Cari ID, Deskripsi, atau PIC..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#0a4d8c] focus:ring-1 focus:ring-[#0a4d8c]"
        />
      </div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full xl:w-auto">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="hidden sm:block text-slate-400 shrink-0" size={18} />
          <div className="grid grid-cols-2 sm:flex sm:flex-row gap-2 w-full sm:w-auto">
            <select 
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value as any)}
              className="w-full sm:w-[130px] lg:w-[150px] border border-slate-200 rounded-lg text-[13px] px-3 py-2 focus:outline-none focus:border-[#0a4d8c] bg-white truncate"
            >
              <option value="All">Semua Sumber</option>
              <option value="Dokumen">Dokumen (D1)</option>
              <option value="Jaminan">Jaminan (D2)</option>
              <option value="Proses Pengadaan">Tracker (D3)</option>
              <option value="SLA/Jatuh Tempo">SLA (D4)</option>
            </select>
            <select 
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as any)}
              className="w-full sm:w-[130px] lg:w-[150px] border border-slate-200 rounded-lg text-[13px] px-3 py-2 focus:outline-none focus:border-[#0a4d8c] bg-white truncate"
            >
              <option value="All">Semua Prioritas</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>
        
        <button 
          onClick={onMarkAllDone}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#0a4d8c] hover:bg-[#093e6f] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm whitespace-nowrap shrink-0"
        >
          <CheckSquare size={16} />
          <span className="hidden sm:inline">Tandai Selesai</span>
          <span className="sm:hidden">Selesai</span>
        </button>
      </div>
    </div>
  );
}
