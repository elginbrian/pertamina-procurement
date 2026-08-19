"use client";

import { useMemo, useState } from "react";
import { TaskList } from "@/components/widgets/tasks/TaskList";
import { TasksToolbar } from "@/components/widgets/tasks/TasksToolbar";

const tasks = [
  {
    id: "PR-2041",
    title: "Persetujuan pembelian laptop pro",
    department: "IT Infrastruktur",
    due: "Due 2 hari",
    priority: "Tinggi",
    status: "Dalam review",
  },
  {
    id: "PR-2052",
    title: "Review pengadaan tablet lapangan",
    department: "Operasional",
    due: "Due 4 hari",
    priority: "Sedang",
    status: "Menunggu",
  },
  {
    id: "PR-2057",
    title: "Evaluasi UPS 20KVA",
    department: "Teknik",
    due: "Due 6 hari",
    priority: "Tinggi",
    status: "Disetujui",
  },
];

export function TasksPage() {
  const [selectedId, setSelectedId] = useState<string>(tasks[0]?.id ?? "");

  const selectedTask = useMemo(
    () => tasks.find((task) => task.id === selectedId) ?? tasks[0],
    [selectedId],
  );

  return (
    <div className="space-y-4">
      <TasksToolbar />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.5fr)_minmax(260px,0.7fr)]">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-800">Daftar tugas</p>
            <span className="text-xs text-slate-500">{tasks.length} item</span>
          </div>
          <TaskList items={tasks} selectedId={selectedId} onSelect={setSelectedId} />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          {selectedTask ? (
            <>
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#0a4d8c]">Preview task</p>
                <span className="rounded-full bg-[#edf5ff] px-2.5 py-1 text-[10px] font-semibold text-[#0a4d8c]">{selectedTask.priority}</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900">{selectedTask.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{selectedTask.department}</p>
              <div className="mt-4 space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
                <div className="flex justify-between">
                  <span>Nomor</span>
                  <span className="font-semibold text-slate-800">{selectedTask.id}</span>
                </div>
                <div className="flex justify-between">
                  <span>Due</span>
                  <span className="font-semibold text-slate-800">{selectedTask.due}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status</span>
                  <span className="font-semibold text-emerald-700">{selectedTask.status}</span>
                </div>
              </div>
            </>
          ) : (
            <p className="text-sm text-slate-500">Pilih tugas untuk melihat detail.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default TasksPage;
