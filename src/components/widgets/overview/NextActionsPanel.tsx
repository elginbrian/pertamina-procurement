"use client";

import { ArrowRight, FileText, PlusCircle } from "lucide-react";

export function NextActionsPanel() {
  const items = [
    { title: "Buat PR baru", detail: "Ajukan kebutuhan barang", icon: PlusCircle },
    { title: "Review tender", detail: "Cek evaluasi terbaru", icon: FileText },
  ];

  return (
    <div className="h-full rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-800">Aksi Selanjutnya</p>
      </div>
      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.title}
            className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 transition-colors duration-200 hover:bg-[#edf5ff] hover:border-[#cfe2ff]"
          >
            <div className="rounded-xl bg-[#ecf5ff] p-2 text-[#0a4d8c] transition-colors duration-200 group-hover:bg-[#dfeeff]">
              <item.icon size={15} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-800">{item.title}</p>
              <p className="text-xs text-slate-500">{item.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NextActionsPanel;
