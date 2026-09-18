"use client";

import { useState, useMemo } from "react";
import { CheckSquare } from "lucide-react";
import { ActionPriority, ActionSource } from "@/types";
import { ActionFilterBar } from "@/components/widgets/next-action/ActionFilterBar";
import { ActionStats } from "@/components/widgets/stats/ActionStats";
import { ActionRow } from "@/components/widgets/next-action/ActionRow";
import { TablePagination } from "@/components/widgets/TablePagination";
import { useProcurement } from "@/context/ProcurementContext";

export default function NextActionPage() {
  const { state } = useProcurement();
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

  const [prevFilters, setPrevFilters] = useState({ searchQuery, sourceFilter, priorityFilter });
  if (searchQuery !== prevFilters.searchQuery || sourceFilter !== prevFilters.sourceFilter || priorityFilter !== prevFilters.priorityFilter) {
    setPrevFilters({ searchQuery, sourceFilter, priorityFilter });
    setCurrentPage(1);
  }

  const filteredActions = useMemo(() => {
    return actions.filter((item) => {
      const matchesSearch = item.referenceId.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.assignee.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSource = sourceFilter === "All" || item.source === sourceFilter;
      const matchesPriority = priorityFilter === "All" || item.priority === priorityFilter;
      
      return matchesSearch && matchesSource && matchesPriority;
    });
  }, [actions, searchQuery, sourceFilter, priorityFilter]);

  const totalPages = Math.ceil(filteredActions.length / itemsPerPage);
  
  const paginatedActions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredActions.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredActions, currentPage, itemsPerPage]);

  return (
    <div className="space-y-6 pb-12">
      <ActionStats
        totalCount={totalCount}
        highCount={highCount}
        mediumCount={mediumCount}
        lowCount={lowCount}
        highPct={highPct}
        mediumPct={mediumPct}
      />

      {/* Search and Filter */}
      <ActionFilterBar 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        sourceFilter={sourceFilter}
        setSourceFilter={setSourceFilter}
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
      />

      {/* Actions List (Table Layout) */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto overscroll-x-contain touch-pan-x [-webkit-overflow-scrolling:touch]">
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
