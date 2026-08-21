import { useState } from "react";
import { ChevronDown, ChevronUp, AlertCircle, CheckCircle2, Clock, CalendarDays, ArrowRight, Sparkles } from "lucide-react";
import { DeadlineItem } from "@/components/pages/deadlines/types";

interface DeadlineRowProps {
  item: DeadlineItem;
}

export function DeadlineRow({ item }: DeadlineRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);

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
      default:
        return null;
    }
  };

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case "Critical":
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-red-600 text-white shadow-sm uppercase tracking-wider">CRITICAL</span>;
      case "High":
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-white shadow-sm uppercase tracking-wider">HIGH</span>;
      case "Medium":
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500 text-white shadow-sm uppercase tracking-wider">MEDIUM</span>;
      case "Low":
      default:
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-slate-400 text-white shadow-sm uppercase tracking-wider">LOW</span>;
    }
  };

  const isOverdue = item.daysRemaining < 0;
  const daysText = isOverdue ? `Terlambat ${Math.abs(item.daysRemaining)} Hari` : `${item.daysRemaining} Hari Lagi`;
  const daysColor = isOverdue ? "text-red-600 font-bold" : item.daysRemaining <= 7 ? "text-amber-600 font-bold" : "text-emerald-600 font-medium";

  return (
    <>
      <tr 
        onClick={() => setIsExpanded(!isExpanded)}
        className={`transition-colors hover:bg-slate-50 cursor-pointer ${isExpanded ? 'bg-slate-50' : ''}`}
      >
        <td className="px-4 py-3 whitespace-nowrap">
          <div className="font-medium text-slate-800 text-[13px]">{item.relatedId}</div>
          <div className="text-[11px] text-slate-500 mt-0.5 max-w-[200px] truncate">{item.taskName}</div>
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
            <div className={`px-5 py-4 bg-slate-50/50 inner-shadow-sm border-l-4 ${isOverdue ? 'border-l-red-500' : 'border-l-amber-500'}`}>
              <div className="flex flex-col xl:flex-row gap-8 max-w-5xl">
                
                {/* Information Block */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle size={16} className={isOverdue ? 'text-red-500' : 'text-amber-500'} />
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
                <div className="w-full xl:w-[220px] shrink-0 xl:pt-1">
                  <div className="space-y-2">
                    <button className="w-full flex items-center justify-center gap-2 bg-[#0a4d8c] hover:bg-[#093e6f] text-white px-3 py-1.5 rounded-md text-xs font-medium transition-colors shadow-sm">
                      <ArrowRight size={14} />
                      Tindak Lanjut SLA
                    </button>
                    {isOverdue && (
                      <button className="w-full flex items-center justify-center gap-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 px-3 py-1.5 rounded-md text-xs font-medium transition-colors shadow-sm">
                        Kirim Surat Eskalasi
                      </button>
                    )}
                  </div>
                </div>

              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
