import { useState } from "react";
import { AlertCircle, CheckCircle2, XCircle, Sparkles, Eye, ChevronDown, ChevronUp } from "lucide-react";
import { DocumentItem, DocumentStatus } from "@/components/pages/documents/types";

export function DocumentRow({ doc }: { doc: DocumentItem }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasIssues = doc.issues && doc.issues.length > 0;
  
  const getStatusColor = (status: DocumentStatus) => {
    switch (status) {
      case "Ready": return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Needs Attention": return "bg-amber-50 text-amber-700 border-amber-200";
      case "Not Ready": return "bg-red-50 text-red-700 border-red-200";
    }
  };

  const getStatusIcon = (status: DocumentStatus) => {
    switch (status) {
      case "Ready": return <CheckCircle2 size={14} />;
      case "Needs Attention": return <AlertCircle size={14} />;
      case "Not Ready": return <XCircle size={14} />;
    }
  };

  return (
    <>
      <tr 
        onClick={() => setIsExpanded(!isExpanded)}
        className={`transition-colors hover:bg-slate-50 cursor-pointer ${isExpanded ? 'bg-slate-50' : ''}`}
      >
        <td className="px-4 py-3">
          <div className="font-medium text-slate-800 text-[13px]">{doc.name}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">{doc.id}</div>
        </td>
        <td className="px-4 py-3 text-[13px] text-slate-600">
          {doc.type}
        </td>
        <td className="px-4 py-3 text-[13px] text-slate-600">
          {doc.pic}
        </td>
        <td className="px-4 py-3 text-[13px] text-slate-600">
          {doc.uploadDate}
        </td>
        <td className="px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(doc.status)}`}>
              {getStatusIcon(doc.status)}
              <span className="hidden lg:inline">{doc.status}</span>
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
            <div className={`px-5 py-4 bg-slate-50/50 inner-shadow-sm border-l-4 ${hasIssues ? 'border-l-amber-500' : 'border-l-emerald-500'}`}>
              <div className="max-w-5xl">
                {hasIssues ? (
                  <div className="flex flex-col xl:flex-row gap-8">
                    {/* Issues List */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertCircle size={16} className={doc.status === 'Not Ready' ? 'text-red-500' : 'text-amber-500'} />
                        <h4 className="text-[13px] font-semibold text-slate-800">Temuan Pemeriksaan</h4>
                      </div>
                      <ul className="list-disc list-outside text-[13px] text-slate-600 space-y-1.5 ml-5 mb-4">
                        {doc.issues.map((issue, idx) => (
                          <li key={idx} className="pl-1">{issue}</li>
                        ))}
                      </ul>
                      
                      <button 
                        onClick={(e) => { e.stopPropagation(); }}
                        className="flex items-center gap-2 text-slate-600 hover:text-[#0a4d8c] transition-colors text-[13px] font-medium w-fit"
                      >
                        <Eye size={16} />
                        <span className="underline underline-offset-4 decoration-slate-300">Lihat Dokumen Lengkap</span>
                      </button>
                    </div>
                    
                    {/* Next Action Box (Flat) */}
                    {doc.nextAction && (
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Sparkles size={16} className="text-[#0a4d8c]" />
                          <h4 className="text-[13px] font-semibold text-[#0a4d8c]">Next Action</h4>
                        </div>
                        <p className="text-[13px] text-slate-700 leading-relaxed">{doc.nextAction}</p>
                        
                        {doc.canGenerateAiDraft && (
                          <button 
                            onClick={(e) => e.stopPropagation()}
                            className="mt-3 flex items-center gap-2 bg-white border border-slate-300 hover:border-[#0a4d8c] hover:text-[#0a4d8c] text-slate-700 px-3 py-1.5 rounded-md text-xs font-medium transition-all shadow-sm"
                          >
                            <Sparkles size={14} />
                            <span>Generate Draft dengan AI</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col gap-1 py-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 size={16} className="text-emerald-500" />
                      <h4 className="text-[13px] font-semibold text-emerald-800">Dokumen Sudah Aman</h4>
                    </div>
                    <p className="text-[13px] text-slate-600 ml-6 mb-4">Semua persyaratan lengkap dan tervalidasi. Tidak ada tindakan lanjutan yang diperlukan.</p>
                    
                    <button 
                      onClick={(e) => { e.stopPropagation(); }}
                      className="flex items-center gap-2 text-slate-600 hover:text-[#0a4d8c] transition-colors text-[13px] font-medium w-fit ml-6"
                    >
                      <Eye size={16} />
                      <span className="underline underline-offset-4 decoration-slate-300">Lihat Dokumen Lengkap</span>
                    </button>
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
