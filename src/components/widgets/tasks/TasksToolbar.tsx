"use client";

import { Filter, Search } from "lucide-react";

export function TasksToolbar() {
  return (
    <div className="mb-4 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
      <div className="flex flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500">
        <Search size={14} />
        <input
          aria-label="Cari tugas"
          placeholder="Cari tugas"
          className="w-full border-0 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
        />
      </div>
      <button
        type="button"
        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700"
      >
        <Filter size={14} />
        Filter
      </button>
    </div>
  );
}

export default TasksToolbar;
