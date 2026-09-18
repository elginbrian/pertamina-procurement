import { Eye } from "lucide-react";
import { TrackerItem } from "./types";

import { TrackerListProps } from "./types";

export function TrackerList({ filteredItems, timeStatusMap, openRequestDetail }: TrackerListProps) {
  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
        <div>
          <h2 className="text-sm font-bold text-slate-800">Daftar Pekerjaan</h2>
          <p className="mt-1 text-xs text-slate-500">Tampilan ringkas untuk memantau banyak pekerjaan.</p>
        </div>
        <span className="text-xs font-semibold text-slate-500">{filteredItems.length} pekerjaan</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left">
          <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-5 py-3">Pekerjaan</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">PIC</th>
              <th className="px-4 py-3">Tahap</th>
              <th className="px-4 py-3">Nilai</th>
              <th className="px-4 py-3">SLA</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredItems.map(item => (
              <tr key={item.id} className="hover:bg-slate-50/70">
                <td className="px-5 py-3">
                  <div className="text-xs text-slate-400">{item.id}</div>
                  <div className="mt-1 text-sm font-semibold text-slate-800">{item.title}</div>
                </td>
                <td className="px-4 py-3">
                  <span className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${item.operationalStatus === "On Going" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : item.operationalStatus === "On Hold" ? "border-amber-200 bg-amber-50 text-amber-700" : "border-red-200 bg-red-50 text-red-700"}`}>
                    {item.operationalStatus}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-slate-600">{item.pic.name}</td>
                <td className="px-4 py-3 text-xs text-slate-600">{item.currentStep}</td>
                <td className="px-4 py-3 text-xs font-medium text-slate-700">{item.amount}</td>
                <td className="px-4 py-3 text-xs font-medium text-slate-600">{timeStatusMap[item.id] ?? "-"}</td>
                <td className="px-5 py-3 text-right">
                  <button onClick={() => openRequestDetail(item.id)} className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:border-[#0a4d8c] hover:text-[#0a4d8c]">
                    <Eye size={13} /> Buka Detail
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
