import { useState } from "react";
import { AlertTriangle, ShieldCheck, ShieldAlert, ArrowRight, ChevronDown, ChevronUp } from "lucide-react";
import { GuaranteeItem, GuaranteeStatus } from "@/components/pages/guarantees/types";

export function GuaranteeRow({ guarantee }: { guarantee: GuaranteeItem }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasAction = !!guarantee.nextAction;

  const getStatusStyle = (status: GuaranteeStatus) => {
    switch (status) {
      case "Aktif": 
        return { color: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: <ShieldCheck size={14} /> };
      case "Mendekati Expiry": 
        return { color: "bg-amber-50 text-amber-700 border-amber-200", icon: <AlertTriangle size={14} /> };
      case "Expired": 
        return { color: "bg-red-50 text-red-700 border-red-200", icon: <ShieldAlert size={14} /> };
    }
  };

  const statusStyle = getStatusStyle(guarantee.status);

  return (
    <>
      <tr 
        onClick={() => setIsExpanded(!isExpanded)}
        className={`transition-colors hover:bg-slate-50 cursor-pointer ${isExpanded ? 'bg-slate-50' : ''}`}
      >
        <td className="px-4 py-3">
          <div className="font-medium text-slate-800 text-[13px]">{guarantee.referenceNo}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">{guarantee.type}</div>
        </td>
        <td className="px-4 py-3 text-[13px] text-slate-600 font-medium">
          {guarantee.value}
        </td>
        <td className="px-4 py-3 text-[13px] text-slate-600">
          {guarantee.pic}
        </td>
        <td className="px-4 py-3">
          <div className="text-[13px] font-medium text-slate-700">{guarantee.expiryDate}</div>
          <div className={`text-xs mt-0.5 font-medium ${
            guarantee.status === 'Expired' ? 'text-red-600' : 
            guarantee.status === 'Mendekati Expiry' ? 'text-amber-600' : 'text-emerald-600'
          }`}>
            {guarantee.remainingDays < 0 ? `Terlewat ${Math.abs(guarantee.remainingDays)} hari` : `${guarantee.remainingDays} hari lagi`}
          </div>
        </td>
        <td className="px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusStyle.color}`}>
              {statusStyle.icon}
              <span className="hidden lg:inline">{guarantee.status}</span>
            </span>
            <div className="text-slate-400">
              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>
          </div>
        </td>
      </tr>

      {/* Expanded Row for Details */}
      {isExpanded && (
        <tr>
          <td colSpan={5} className="p-0 border-b border-slate-200 whitespace-normal">
            <div className={`px-5 py-4 bg-slate-50/50 inner-shadow-sm border-l-4 ${hasAction ? 'border-l-amber-500' : 'border-l-emerald-500'}`}>
              <div className="max-w-5xl">
                {hasAction ? (
                  <div className="flex flex-col xl:flex-row gap-8">
                    {/* Expiry Details */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle size={16} className={guarantee.status === 'Expired' ? 'text-red-500' : 'text-amber-500'} />
                        <h4 className="text-[13px] font-semibold text-slate-800">Status Jaminan</h4>
                      </div>
                      <p className="text-[13px] text-slate-600 ml-6">
                        Jaminan {guarantee.type} ini {guarantee.status === 'Expired' ? 'telah kedaluwarsa' : 'akan segera berakhir'} dalam waktu dekat. 
                        Pastikan untuk menindaklanjuti proses perpanjangan atau pencairan sebelum batas waktu yang ditentukan.
                      </p>
                    </div>
                    
                    {/* Next Action Box (Flat) */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle size={16} className="text-orange-500" />
                        <h4 className="text-[13px] font-semibold text-orange-600">Next Action</h4>
                      </div>
                      <p className="text-[13px] text-slate-700 leading-relaxed">{guarantee.nextAction}</p>
                      
                      <button 
                        onClick={(e) => { e.stopPropagation(); }}
                        className="mt-3 flex items-center gap-2 bg-white border border-slate-300 hover:border-orange-500 hover:text-orange-600 text-slate-700 px-3 py-1.5 rounded-md text-xs font-medium transition-all shadow-sm"
                      >
                        <ArrowRight size={14} />
                        <span>Tandai Sudah Dikoordinasikan</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-1">
                    <div className="flex items-center gap-3">
                      <ShieldCheck size={20} className="text-emerald-500" />
                      <div>
                        <h4 className="text-[13px] font-semibold text-emerald-800">Jaminan dalam Status Aman</h4>
                        <p className="text-[12px] text-emerald-600/80 mt-0.5">Masa berlaku masih panjang. Sistem akan memberikan notifikasi otomatis saat mendekati masa kedaluwarsa.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
