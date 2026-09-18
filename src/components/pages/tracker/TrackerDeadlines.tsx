import { useMemo, useState } from "react";
import { TablePagination } from "@/components/widgets/TablePagination";

import { TrackerDeadlinesProps } from "./types";

export function TrackerDeadlines({ deadlines, requests, openRequestDetail, setEditingDeadlineId }: TrackerDeadlinesProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const totalPages = Math.max(1, Math.ceil(deadlines.length / itemsPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedDeadlines = useMemo(() => {
    const start = (safePage - 1) * itemsPerPage;
    return deadlines.slice(start, start + itemsPerPage);
  }, [deadlines, itemsPerPage, safePage]);

  return (
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
            <tr>
              <th className="px-5 py-3">Pekerjaan / SLA</th>
              <th className="px-4 py-3">PIC</th>
              <th className="px-4 py-3">Periode</th>
              <th className="px-4 py-3">Status waktu</th>
              <th className="px-5 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedDeadlines.map(deadline => {
              const request = requests.find(item => item.id === deadline.requestId);
              return (
                <tr key={deadline.id} className="hover:bg-slate-50/70">
                  <td className="px-5 py-3">
                    <button onClick={() => openRequestDetail(deadline.requestId)} className="text-left hover:text-[#0a4d8c]">
                      <div className="font-medium text-slate-800">{request?.title ?? deadline.requestId}</div>
                      <div className="mt-0.5 text-xs text-slate-500">{deadline.taskName} · {deadline.milestone}</div>
                    </button>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-600">{deadline.pic.name}</td>
                  <td className="px-4 py-3 text-xs text-slate-600">
                    <div>{deadline.startDate ?? "Belum diatur"}</div>
                    <div className="mt-0.5 font-medium text-slate-800">s.d. {deadline.targetDate}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-bold ${deadline.status === "Overdue" ? "border-red-200 bg-red-50 text-red-700" : deadline.status === "At Risk" ? "border-amber-200 bg-amber-50 text-amber-700" : "border-emerald-200 bg-emerald-50 text-emerald-700"}`}>
                      {deadline.status} · {deadline.status === "Selesai" ? "Selesai" : deadline.daysRemaining < 0 ? `${Math.abs(deadline.daysRemaining)} hari terlambat` : `${deadline.daysRemaining} hari`}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button onClick={() => setEditingDeadlineId(deadline.id)} className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-[#0a4d8c] hover:bg-blue-100">
                      Edit SLA
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <TablePagination
          currentPage={safePage}
          totalPages={totalPages}
          totalItems={deadlines.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setItemsPerPage}
          itemName="SLA"
        />
      </div>
    </section>
  );
}
