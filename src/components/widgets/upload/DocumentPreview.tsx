import { FileText } from "lucide-react";

import { DocumentPreviewProps } from "./types";

export function DocumentPreview({ file }: DocumentPreviewProps) {
  return (
    <div className="flex-1 border-2 border-slate-200 rounded-xl flex flex-col bg-white overflow-hidden shadow-sm">
      {file ? (
        <>
          <div className="bg-slate-100 border-b border-slate-200 px-4 py-2 flex items-center justify-between shrink-0">
            <span className="text-xs font-semibold text-slate-600 truncate mr-4">{file.name}</span>
            <span className="text-xs text-slate-400 bg-white px-2 py-0.5 rounded border border-slate-200">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-50 relative overflow-hidden">
            <div className="absolute inset-x-8 inset-y-8 bg-white border border-slate-200 shadow-sm p-8 flex flex-col opacity-80">
              <div className="h-4 bg-slate-200 w-1/2 mx-auto mb-8"></div>
              <div className="h-2 bg-slate-200 w-full mb-3"></div>
              <div className="h-2 bg-slate-200 w-5/6 mb-3"></div>
              <div className="h-2 bg-slate-200 w-full mb-3"></div>
              
              <div className="my-6 border border-slate-200 p-4 bg-slate-50">
                <div className="h-3 bg-slate-300 w-1/3 mb-2"></div>
                <div className="h-2 bg-slate-200 w-1/2"></div>
              </div>
              
              <div className="h-2 bg-slate-200 w-3/4 mb-3"></div>
              <div className="h-2 bg-slate-200 w-full mb-3"></div>
              
              <div className="mt-auto absolute bottom-8 left-0 w-full flex justify-center">
                <div className="bg-blue-50 text-[#0a4d8c] text-xs font-medium px-3 py-1 rounded-full border border-blue-100 flex items-center gap-1.5 shadow-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#0a4d8c] animate-pulse"></div>
                  Data Berhasil Dibaca AI
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-6 text-center bg-slate-50">
          <FileText size={48} className="mb-4 opacity-30" />
          <p className="text-sm">Pilih file scan jaminan di panel sebelah kanan untuk melihat preview dokumen.</p>
        </div>
      )}
    </div>
  );
}
