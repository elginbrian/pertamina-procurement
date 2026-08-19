"use client";

type TaskItemProps = {
  id: string;
  title: string;
  department: string;
  due: string;
  priority: string;
  status: string;
  active?: boolean;
  onSelect?: (id: string) => void;
};

export function TaskItem({ id, title, department, due, priority, status, active, onSelect }: TaskItemProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect?.(id)}
      className={`w-full rounded-2xl border p-3 text-left transition ${active ? "border-[#0a4d8c] bg-[#edf5ff] shadow-sm" : "border-slate-200 bg-white hover:border-slate-300"}`}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-800">{title}</p>
          <p className="mt-1 text-xs text-slate-500">{department}</p>
        </div>
        <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-600">{priority}</span>
      </div>
      <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500">
        <span>{due}</span>
        <span className="rounded-full bg-emerald-100 px-2 py-1 font-medium text-emerald-700">{status}</span>
      </div>
    </button>
  );
}

export default TaskItem;
