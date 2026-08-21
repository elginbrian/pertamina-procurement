import { useState } from "react";
import { FileText, AlertCircle, CheckCircle2, XCircle, Sparkles, FileSearch, Eye, ChevronDown, ChevronUp } from "lucide-react";
import { DocumentItem, DocumentStatus } from "@/components/pages/documents/types";

export function DocumentCard({ doc }: { doc: DocumentItem }) {
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
      case "Ready": return <CheckCircle2 size={16} />;
      case "Needs Attention": return <AlertCircle size={16} />;
      case "Not Ready": return <XCircle size={16} />;
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-start justify-between">
        
        {/* Left Side: Info */}
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="hidden sm:flex p-3 bg-slate-50 border border-slate-100 rounded-lg">
            <FileText size={24} className="text-slate-400" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm sm:text-base font-semibold text-slate-800">{doc.name}</h3>
              <span className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-medium border ${getStatusColor(doc.status)}`}>
                {getStatusIcon(doc.status)}
                {doc.status}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-1.5 text-[11px] sm:text-sm text-slate-500">
              <span className="font-medium text-slate-600">{doc.id}</span>
              <span className="w-1 h-1 rounded-full bg-slate-300"></span>
              <span>Tipe: <span className="text-slate-700">{doc.type}</span></span>
              <span className="hidden sm:block w-1 h-1 rounded-full bg-slate-300"></span>
              <span className="hidden sm:inline">Diunggah: {doc.uploadDate}</span>
              <span className="hidden sm:block w-1 h-1 rounded-full bg-slate-300"></span>
              <span className="hidden sm:inline">PIC: {doc.pic}</span>
            </div>
            
            {/* Mobile Only Meta */}
            <div className="sm:hidden flex items-center gap-2 mt-1 text-[11px] text-slate-500">
              <span>{doc.uploadDate}</span>
              <span className="w-1 h-1 rounded-full bg-slate-300"></span>
              <span>{doc.pic}</span>
            </div>
          </div>
        </div>

        {/* Right Side: Actions */}
        <div className="flex items-center gap-2">
          <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors tooltip-trigger" title="Lihat Dokumen">
            <Eye size={18} />
          </button>
          <button className="p-2 text-slate-400 hover:text-[#0a4d8c] hover:bg-blue-50 rounded-lg transition-colors tooltip-trigger" title="Detail Pemeriksaan">
            <FileSearch size={18} />
          </button>
        </div>
      </div>

      {/* Collapsed Warning Trigger */}
      {hasIssues && !isExpanded && (
        <div 
          className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-center cursor-pointer group"
          onClick={() => setIsExpanded(true)}
        >
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 group-hover:text-[#0a4d8c] transition-colors">
            <AlertCircle size={14} className={doc.status === 'Not Ready' ? 'text-red-500' : 'text-amber-500'} />
            <span>Lihat Temuan & Rekomendasi ({doc.issues.length})</span>
            <ChevronDown size={14} />
          </div>
        </div>
      )}

      {/* Expanded Next Action Area */}
      {hasIssues && isExpanded && (
        <div className="mt-5 pt-5 border-t border-slate-100 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Issues List */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2">
                  <AlertCircle size={16} className={doc.status === 'Not Ready' ? 'text-red-500' : 'text-amber-500'} />
                  <h4 className="text-sm font-semibold text-slate-800">Temuan Pemeriksaan</h4>
                </div>
              </div>
              <ul className="list-disc list-outside text-sm text-slate-600 space-y-1.5 ml-4">
                {doc.issues.map((issue, idx) => (
                  <li key={idx} className="pl-1">{issue}</li>
                ))}
              </ul>
            </div>
            
            {/* Next Action Box */}
            {doc.nextAction && (
              <div className="flex-1 bg-gradient-to-br from-[#f8fbff] to-[#f0f6ff] border border-blue-100 rounded-xl p-4 shadow-sm relative">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-blue-800 uppercase tracking-widest">Next Action</h4>
                </div>
                <p className="text-sm text-blue-950 font-medium leading-relaxed">{doc.nextAction}</p>
                
                {doc.canGenerateAiDraft && (
                  <button className="mt-4 flex items-center gap-2 bg-white border border-blue-200 hover:border-blue-400 hover:bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-xs font-semibold transition-all shadow-sm">
                    <Sparkles size={16} className="text-blue-500" />
                    <span>Generate Draft dengan AI</span>
                  </button>
                )}
              </div>
            )}
          </div>
          <div className="mt-4 pt-3 border-t border-slate-50 flex justify-center">
            <button 
              onClick={() => setIsExpanded(false)} 
              className="text-xs font-medium text-slate-400 hover:text-slate-600 flex items-center gap-1 transition-colors"
            >
              Tutup Detail <ChevronUp size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
