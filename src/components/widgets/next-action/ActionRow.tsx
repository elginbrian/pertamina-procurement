import { useState } from "react";
import { ChevronDown, ChevronUp, AlertCircle, ArrowRight, CheckCircle2 } from "lucide-react";
import { ActionItem } from "@/components/pages/next-action/types";

interface ActionRowProps {
  item: ActionItem;
}

export function ActionRow({ item }: ActionRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getPriorityBadge = (priority: ActionItem["priority"]) => {
    switch (priority) {
      case "High":
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700 border border-red-200 uppercase tracking-wider">HIGH</span>;
      case "Medium":
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700 border border-amber-200 uppercase tracking-wider">MEDIUM</span>;
      case "Low":
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700 border border-blue-200 uppercase tracking-wider">LOW</span>;
    }
  };

  const getStatusBadge = (status: ActionItem["status"]) => {
    switch (status) {
      case "Completed":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "In Progress":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "Pending":
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  return (
    <>
      <tr 
        onClick={() => setIsExpanded(!isExpanded)}
        className={`transition-colors hover:bg-slate-50 cursor-pointer ${isExpanded ? 'bg-slate-50' : ''}`}
      >
        <td className="px-4 py-3 whitespace-nowrap">
          <div className="font-medium text-slate-800 text-[13px]">{item.title}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">{item.referenceId}</div>
        </td>
        <td className="px-4 py-3 whitespace-nowrap">
          <div className="text-[13px] text-slate-600">{item.source}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">{item.actionType}</div>
        </td>
        <td className="px-4 py-3 whitespace-nowrap">
          <div className="text-[13px] text-slate-600">{item.assignee}</div>
        </td>
        <td className="px-4 py-3 whitespace-nowrap">
          <div className="text-[13px] text-slate-600">{item.dueDate}</div>
          <div className="mt-1">{getPriorityBadge(item.priority)}</div>
        </td>
        <td className="px-4 py-3 whitespace-nowrap">
          <div className="flex items-center justify-between gap-4">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadge(item.status)}`}>
              {item.status}
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
            <div className={`px-5 py-4 bg-slate-50/50 inner-shadow-sm border-l-4 ${item.priority === 'High' ? 'border-l-red-500' : item.priority === 'Medium' ? 'border-l-amber-500' : 'border-l-blue-500'}`}>
              <div className="flex flex-col xl:flex-row gap-8 max-w-5xl">
                
                {/* Information Block */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle size={16} className="text-slate-500" />
                    <h4 className="text-[13px] font-semibold text-slate-800">Detail & Deskripsi Tindakan</h4>
                  </div>
                  <p className="text-[13px] text-slate-600 ml-6 mb-4 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Actions Block */}
                <div className="w-full xl:w-[220px] shrink-0 xl:pt-1">
                  <div className="space-y-2">
                    <button className="w-full flex items-center justify-center gap-2 bg-[#0a4d8c] hover:bg-[#093e6f] text-white px-3 py-1.5 rounded-md text-xs font-medium transition-colors shadow-sm">
                      <ArrowRight size={14} />
                      Kerjakan Sekarang
                    </button>
                    <button className="w-full flex items-center justify-center gap-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 px-3 py-1.5 rounded-md text-xs font-medium transition-colors shadow-sm">
                      <CheckCircle2 size={14} />
                      Tandai Selesai
                    </button>
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
