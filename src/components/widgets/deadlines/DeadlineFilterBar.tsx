import { Search, Filter, BellRing } from "lucide-react";
import { DeadlineStatus } from "@/components/pages/deadlines/types";

interface DeadlineFilterBarProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  statusFilter: DeadlineStatus | "All";
  setStatusFilter: (val: DeadlineStatus | "All") => void;
  urgencyFilter: string;
  setUrgencyFilter: (val: string) => void;
}

export function DeadlineFilterBar({ 
  searchQuery, 
  setSearchQuery, 
  statusFilter, 
  setStatusFilter, 
  urgencyFilter, 
  setUrgencyFilter 
}: DeadlineFilterBarProps) {
  return (
    <div className="flex flex-col xl:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
      <div className="relative w-full flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input 
          type="text" 
          placeholder="Cari ID pengadaan, PIC, atau Milestone..." 
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
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full sm:w-[130px] lg:w-[150px] border border-slate-200 rounded-lg text-[13px] px-3 py-2 focus:outline-none focus:border-[#0a4d8c] bg-white truncate"
            >
              <option value="All">Semua Status</option>
              <option value="On Track">On Track</option>
              <option value="At Risk">At Risk</option>
              <option value="Overdue">Overdue</option>
            </select>
            <select 
              value={urgencyFilter}
              onChange={(e) => setUrgencyFilter(e.target.value)}
              className="w-full sm:w-[130px] lg:w-[150px] border border-slate-200 rounded-lg text-[13px] px-3 py-2 focus:outline-none focus:border-[#0a4d8c] bg-white truncate"
            >
              <option value="All">Semua Urgensi</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>
        </div>
        
        <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#0a4d8c] hover:bg-[#093e6f] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm whitespace-nowrap shrink-0">
          <BellRing size={16} />
          <span className="hidden sm:inline">Kirim Reminder Manual</span>
          <span className="sm:hidden">Reminder</span>
        </button>
      </div>
    </div>
  );
}
