import { useState } from "react";
import { ChevronDown, ChevronUp, AlertCircle, CheckCircle2, Clock, CalendarDays, ArrowRight, Sparkles } from "lucide-react";
import { DeadlineItem, ProcurementMilestone } from "@/lib/types";
import { useProcurement } from "@/context/ProcurementContext";

interface DeadlineRowProps {
  item: DeadlineItem;
  requestTitle?: string;
  milestones: ProcurementMilestone[];
}

export function DeadlineRow({ item, requestTitle, milestones }: DeadlineRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { updateDeadlineStatus } = useProcurement();

  const getStatusStyle = (status: DeadlineItem["status"]) => {
    switch (status) {
      case "On Track":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "At Risk":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "Overdue":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  const getStatusIcon = (status: DeadlineItem["status"]) => {
    switch (status) {
      case "On Track":
        return <CheckCircle2 size={14} className="mr-1.5" />;
      case "At Risk":
        return <Clock size={14} className="mr-1.5" />;
      case "Overdue":
        return <AlertCircle size={14} className="mr-1.5" />;
      case "Selesai":
        return <CheckCircle2 size={14} className="mr-1.5" />;
      default:
        return null;
    }
  };

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case "Critical":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-red-50 text-red-700 border border-red-200 uppercase tracking-wider">CRITICAL</span>;
      case "High":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-blue-50 text-[#0a4d8c] border border-blue-200 uppercase tracking-wider">HIGH</span>;
      case "Medium":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-wider">MEDIUM</span>;
      case "Low":
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-slate-50 text-slate-700 border border-slate-200 uppercase tracking-wider">LOW</span>;
    }
  };

  const isOverdue = item.status === "Overdue" || item.daysRemaining < 0;
  const daysText = item.status === "Selesai" ? "Selesai" : isOverdue ? `Terlambat ${Math.abs(item.daysRemaining)} Hari` : `${item.daysRemaining} Hari Lagi`;
  const daysColor = item.status === "Selesai" ? "text-emerald-600 font-semibold" : isOverdue ? "text-red-600 font-bold" : item.status === "At Risk" ? "text-amber-700 font-bold" : "text-emerald-600 font-medium";
  const currentMilestoneIndex = milestones.findIndex(milestone => milestone.status === "In Progress");
  const timelineStart = Math.max(0, currentMilestoneIndex > -1 ? currentMilestoneIndex - 1 : 0);
  const visibleMilestones = milestones.slice(timelineStart, timelineStart + 3);
  const otherMilestones = milestones.filter((_, index) => index < timelineStart || index >= timelineStart + 3);

  return (
    <>
      <tr 
        onClick={() => setIsExpanded(!isExpanded)}
        className={`transition-colors hover:bg-slate-50 cursor-pointer ${isExpanded ? 'bg-slate-50' : ''}`}
      >
        <td className="px-4 py-3 whitespace-nowrap">
          <div className="max-w-[240px] truncate text-sm font-medium text-slate-800">{requestTitle || item.taskName}</div>
          <div className="mt-1 text-[11px] text-slate-500">{item.requestId}</div>
        </td>
        <td className="px-4 py-3 whitespace-nowrap">
          <div className="text-[13px] text-slate-600">{item.milestone}</div>
          <div className="mt-1">{getUrgencyBadge(item.urgencyLevel)}</div>
        </td>
        <td className="px-4 py-3 whitespace-nowrap">
          <div className="text-[13px] text-slate-600">{item.pic}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">{item.department}</div>
        </td>
        <td className="px-4 py-3 whitespace-nowrap">
          <div className="flex flex-col">
            <div className="flex items-center text-[13px] text-slate-600">
              <CalendarDays size={14} className="mr-1.5 text-slate-400" />
              {item.targetDate}
            </div>
            <div className={`text-[11px] mt-0.5 ${daysColor}`}>
              {daysText}
            </div>
          </div>
        </td>
        <td className="px-4 py-3 whitespace-nowrap">
          <div className="flex items-center justify-between gap-4">
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyle(item.status)}`}>
              {getStatusIcon(item.status)}
              <span className="hidden lg:inline">{item.status}</span>
            </span>
            <div className="text-slate-400">
              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>
          </div>
        </td>
      </tr>

      {/* Expanded Details Panel */}
      {isExpanded && (
        <tr>
          <td colSpan={5} className="p-0 border-b border-slate-200 whitespace-normal">
            <div className={`px-5 py-4 bg-slate-50/50 inner-shadow-sm border-l-4 ${isOverdue ? 'border-l-red-500' : 'border-l-[#0a4d8c]'}`}>
              <div className="grid w-full grid-cols-1 gap-8 xl:grid-cols-[0.9fr_1.1fr]">
                
                <div className="min-w-0 space-y-6">
                  {/* Information Block */}
                  <div>
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle size={14} className={item.status === 'Overdue' ? 'text-red-500' : 'text-amber-500'} />
                    <h4 className="text-[13px] font-semibold text-slate-800">Detail Tugas</h4>
                  </div>
                  <div className="text-[13px] text-slate-600 ml-6 mb-4">
                    <span className="font-medium text-slate-700">{item.taskName}</span>
                    <p className="mt-1">Pengecekan batas waktu SLA (Service Level Agreement) berdasarkan milestone {item.milestone}.</p>
                  </div>

                  <div className="ml-6 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles size={16} className="text-[#0a4d8c]" />
                      <h4 className="text-[13px] font-semibold text-[#0a4d8c]">Next Action</h4>
                    </div>
                    <p className="text-[13px] text-slate-700 leading-relaxed">{item.nextAction}</p>
                  </div>
                  </div>

                {/* Actions Block */}
                  <div className="w-full shrink-0">
                  <div className="space-y-2">
                    {item.status !== "Selesai" && <button 
                      onClick={(e) => { e.stopPropagation(); updateDeadlineStatus(item.id, "Selesai"); }}
                      className="w-full flex items-center justify-center gap-2 bg-[#0a4d8c] hover:bg-[#093e6f] text-white px-3 py-1.5 rounded-md text-xs font-medium transition-colors shadow-sm"
                    >
                      <CheckCircle2 size={14} />
                      Tandai Selesai
                    </button>}
                    {item.status === 'Overdue' && (
                      <button className="w-full flex items-center justify-center gap-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 px-3 py-1.5 rounded-md text-xs font-medium transition-colors shadow-sm">
                        Kirim Surat Eskalasi
                      </button>
                    )}
                  </div>
                  </div>
                </div>

                <div className="min-w-0">
                  <div className="flex items-end justify-between gap-3 border-b border-slate-200 pb-2">
                    <div><h4 className="text-[13px] font-semibold text-slate-800">Timeline milestone proyek</h4><p className="mt-1 text-[11px] text-slate-500">Posisi SLA ini terhadap tahapan procurement request.</p></div>
                    <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-[#0a4d8c]">{item.milestone}</span>
                  </div>
                  <div className="relative mt-4 space-y-1">
                    <div className="absolute bottom-4 left-[13px] top-4 w-px bg-slate-200" />
                    {visibleMilestones.map((milestone, index) => {
                      const milestoneIndex = timelineStart + index;
                      const isDone = milestone.status === "Done";
                      const isCurrent = milestone.status === "In Progress";
                      const isTarget = milestone.step === item.milestone;
                      return <div key={milestone.id} className="relative flex gap-3 py-1.5"><div className={`z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-4 border-slate-50 text-[10px] font-bold ${isDone ? "bg-emerald-500 text-white" : isCurrent ? "bg-[#0a4d8c] text-white ring-2 ring-blue-100" : isTarget ? "bg-blue-100 text-[#0a4d8c] ring-2 ring-blue-100" : "bg-slate-200 text-slate-500"}`}>{isDone ? <CheckCircle2 size={13} /> : milestoneIndex + 1}</div><div className={`flex-1 rounded-md border px-3 py-2 ${isCurrent ? "border-blue-200 bg-blue-50/60" : isTarget ? "border-blue-200 bg-blue-50/30" : "border-slate-100 bg-white"}`}><div className="flex flex-wrap items-center justify-between gap-2"><span className="text-xs font-medium text-slate-700">{milestone.step}</span><span className={`text-[10px] font-semibold uppercase tracking-wider ${isDone ? "text-emerald-600" : isCurrent ? "text-[#0a4d8c]" : isTarget ? "text-blue-600" : "text-slate-400"}`}>{isDone ? "Selesai" : isCurrent ? "Berjalan" : isTarget ? "Target SLA" : "Pending"}</span></div></div></div>;
                    })}
                  </div>
                  {otherMilestones.length > 0 && <details className="mt-2 rounded-md border border-slate-200 bg-white"><summary className="cursor-pointer px-3 py-2 text-[11px] font-semibold text-slate-500 hover:text-[#0a4d8c]">Lihat {otherMilestones.length} milestone lainnya</summary><div className="space-y-1 border-t border-slate-100 p-2">{otherMilestones.map(milestone => <div key={milestone.id} className="flex items-center justify-between rounded bg-slate-50 px-2 py-1.5 text-[11px] text-slate-600"><span>{milestone.step}</span><span className={milestone.step === item.milestone ? "font-semibold text-blue-600" : ""}>{milestone.status === "Done" ? "Selesai" : milestone.step === item.milestone ? "Target SLA" : "Pending"}</span></div>)}</div></details>}
                </div>

              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
