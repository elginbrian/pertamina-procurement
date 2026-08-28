"use client";

import { useState, useMemo, useEffect } from "react";
import { CheckSquare } from "lucide-react";
import { ActionItem, ActionPriority, ActionSource } from "@/lib/types";
import { ActionFilterBar } from "@/components/widgets/next-action/ActionFilterBar";
import { ActionRow } from "@/components/widgets/next-action/ActionRow";
import { TablePagination } from "@/components/widgets/TablePagination";
import { useProcurement } from "@/context/ProcurementContext";

export default function NextActionPage() {
  const { state, updateActionStatus } = useProcurement();
  const actions = state.actions;
  const [searchQuery, setSearchQuery] = useState("");
  const [sourceFilter, setSourceFilter] = useState<ActionSource | "All">("All");
  const [priorityFilter, setPriorityFilter] = useState<ActionPriority | "All">("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const highCount = actions.filter(d => d.priority === "High").length;
  const mediumCount = actions.filter(d => d.priority === "Medium").length;
  const lowCount = actions.filter(d => d.priority === "Low").length;
  const totalCount = actions.length;
  
  const highPct = totalCount ? (highCount / totalCount) * 100 : 0;
  const mediumPct = totalCount ? (mediumCount / totalCount) * 100 : 0;

  // Reset pagination on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sourceFilter, priorityFilter]);

  const filteredActions = useMemo(() => {
    return actions.filter((item) => {
      const matchesSearch = item.referenceId.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.assignee.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSource = sourceFilter === "All" || item.source === sourceFilter;
      const matchesPriority = priorityFilter === "All" || item.priority === priorityFilter;
      
      return matchesSearch && matchesSource && matchesPriority;
    });
  }, [actions, searchQuery, sourceFilter, priorityFilter]);

  const totalPages = Math.ceil(filteredActions.length / itemsPerPage);
  
  const paginatedActions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredActions.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredActions, currentPage]);

  return (
    <div className="space-y-6 pb-12">
      {/* Statistics Header */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
        {/* Total Actions */}
        <div className="p-5 flex-1 flex items-center justify-between">
          <div>
            <div className="text-[13px] font-medium text-slate-500 mb-1 uppercase tracking-wider">Total Tindakan</div>
            <div className="text-3xl font-black text-[#0a4d8c]">{totalCount}</div>
            <div className="text-[11px] text-slate-400 mt-1 font-medium">Tugas yang belum selesai</div>
          </div>
          <div className="w-14 h-14 rounded-full relative shadow-[inset_0_2px_8px_rgba(0,0,0,0.06)]" style={{
            background: `conic-gradient(#ef4444 0% ${highPct}%, #0a4d8c ${highPct}% ${highPct + mediumPct}%, #10b981 ${highPct + mediumPct}% 100%)`
          }}>
            <div className="absolute inset-2 bg-white rounded-full"></div>
          </div>
        </div>

        {/* High Priority */}
        <div className="p-5 flex-1">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-[13px] font-medium text-slate-500 mb-1 flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                High Priority
              </div>
              <div className="text-2xl font-bold text-slate-800 mt-2">{highCount}</div>
            </div>
            <div className="bg-red-50 text-red-700 text-xs font-medium px-2.5 py-0.5 rounded-full border border-red-100">
              {highPct.toFixed(0)}%
            </div>
          </div>
          <div className="text-[11px] text-slate-400 mt-1 font-medium">Butuh perhatian segera</div>
        </div>

        {/* Medium Priority */}
        <div className="p-5 flex-1">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-[13px] font-medium text-slate-500 mb-1 flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#0a4d8c]"></div>
                Medium Priority
              </div>
              <div className="text-2xl font-bold text-slate-800 mt-2">{mediumCount}</div>
            </div>
            <div className="bg-blue-50 text-[#0a4d8c] text-xs font-medium px-2.5 py-0.5 rounded-full border border-blue-100">
              {mediumPct.toFixed(0)}%
            </div>
          </div>
          <div className="text-[11px] text-slate-400 mt-1 font-medium">Tugas operasional rutin</div>
        </div>

        {/* Low Priority */}
        <div className="p-5 flex-1">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-[13px] font-medium text-slate-500 mb-1 flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                Low Priority
              </div>
              <div className="text-2xl font-bold text-slate-800 mt-2">{lowCount}</div>
            </div>
            <div className="bg-emerald-50 text-emerald-700 text-xs font-medium px-2.5 py-0.5 rounded-full border border-emerald-100">
              {(100 - highPct - mediumPct).toFixed(0)}%
            </div>
          </div>
          <div className="text-[11px] text-slate-400 mt-1 font-medium">Tidak mendesak</div>
        </div>
      </div>

      {/* Search and Filter */}
      <ActionFilterBar 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        sourceFilter={sourceFilter}
        setSourceFilter={setSourceFilter}
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
        onMarkAllDone={() => {
          filteredActions.forEach(a => {
            if (a.status !== 'Done') {
              updateActionStatus(a.id, 'Done');
            }
          });
        }}
      />

      {/* Actions List (Table Layout) */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="px-4 py-3">Tindakan & Ref</th>
                <th className="px-4 py-3">Sumber & Tipe</th>
                <th className="px-4 py-3">Assignee</th>
                <th className="px-4 py-3">Batas Waktu</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {paginatedActions.length > 0 ? (
                paginatedActions.map((item) => (
                  <ActionRow key={item.id} item={item} />
                ))
              ) : (
                <tr>
                  <td colSpan={5}>
                    <div className="flex flex-col items-center justify-center p-12 text-slate-500">
                      <CheckSquare size={48} className="text-slate-300 mb-4" />
                      <p className="text-lg font-medium text-slate-700">Semua tindakan sudah selesai!</p>
                      <p className="text-sm">Tidak ada tugas yang menunggu saat ini.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          
          <TablePagination 
            currentPage={currentPage}
            totalPages={Math.max(totalPages, 1)}
            totalItems={filteredActions.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={setItemsPerPage}
            itemName="tindakan"
          />
        </div>
      </div>
    </div>
  );
}
