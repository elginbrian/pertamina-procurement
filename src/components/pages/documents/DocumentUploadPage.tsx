"use client";

import { useState, useRef } from "react";
import { UploadCloud, FileText, ArrowRight, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useProcurement } from "@/context/ProcurementContext";
import type { DocumentItem, DocumentType } from "@/lib/types";

export default function DocumentUploadPage() {
  const router = useRouter();
  const { addDocument } = useProcurement();
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [docType, setDocType] = useState<DocumentType | "">("");
  const [notes, setNotes] = useState("");
  const [requestId, setRequestId] = useState("");

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-6 pt-4 pb-12 min-h-[calc(100vh-140px)] flex flex-col">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col md:flex-row flex-1">
        
        <div className="w-full md:w-1/2 bg-slate-50 border-r border-slate-200 p-6 flex flex-col">
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Preview Dokumen</h2>
          <div className="flex-1 border-2 border-slate-200 rounded-xl flex flex-col bg-white overflow-hidden shadow-sm">
            {file ? (
              <>
                <div className="bg-slate-100 border-b border-slate-200 px-4 py-2 flex items-center justify-between shrink-0">
                  <span className="text-xs font-semibold text-slate-600 truncate mr-4">{file.name}</span>
                  <span className="text-xs text-slate-400 bg-white px-2 py-0.5 rounded border border-slate-200">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-50 relative overflow-hidden">
                  <div className="absolute inset-x-8 inset-y-8 bg-white border border-slate-200 shadow-sm p-8 flex flex-col opacity-80">
                    <div className="h-4 bg-slate-200 w-3/4 mb-6"></div>
                    <div className="h-2 bg-slate-200 w-full mb-3"></div>
                    <div className="h-2 bg-slate-200 w-5/6 mb-3"></div>
                    <div className="h-2 bg-slate-200 w-full mb-3"></div>
                    <div className="h-2 bg-slate-200 w-4/5 mb-8"></div>
                    <div className="h-2 bg-slate-200 w-full mb-3"></div>
                    <div className="h-2 bg-slate-200 w-3/4 mb-3"></div>
                    
                    <div className="mt-auto absolute bottom-8 left-0 w-full flex justify-center">
                      <div className="bg-blue-50 text-[#0a4d8c] text-xs font-medium px-3 py-1 rounded-full border border-blue-100 flex items-center gap-1.5 shadow-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#0a4d8c] animate-pulse"></div>
                        File Siap Diperiksa
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-6 text-center bg-slate-50">
                <FileText size={48} className="mb-4 opacity-30" />
                <p className="text-sm">Pilih file di panel sebelah kanan untuk melihat preview dokumen.</p>
              </div>
            )}
          </div>
        </div>

        <div className="w-full md:w-1/2 flex flex-col">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-800">Upload Dokumen Pra-Tender</h2>
            <p className="text-sm text-slate-500 mt-1">Sistem PRIMA akan memverifikasi kelengkapan dokumen (D1).</p>
          </div>
          
          <div className="p-6 space-y-5 flex-1">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Terkait Pengadaan <span className="text-red-500">*</span></label>
              <select 
                value={requestId}
                onChange={(e) => setRequestId(e.target.value)}
                className="w-full border border-slate-200 rounded-lg text-sm px-3 py-2.5 focus:outline-none focus:border-[#0a4d8c] focus:ring-1 focus:ring-[#0a4d8c] bg-white"
              >
                <option value="">Pilih nomor pengadaan...</option>
                <option value="REQ-2026-101">REQ-2026-101 – Pengadaan Server Rack 42U</option>
                <option value="REQ-2026-102">REQ-2026-102 – Lisensi Software Design Suite</option>
                <option value="REQ-2026-103">REQ-2026-103 – Renovasi Ruang Meeting Lt. 4</option>
                <option value="REQ-2026-104">REQ-2026-104 – Pengadaan Laptop (10 Unit)</option>
                <option value="REQ-2026-108">REQ-2026-108 – Upgrade Bandwidth Internet HO</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Jenis Dokumen <span className="text-red-500">*</span></label>
              <select 
                value={docType}
                onChange={(e) => setDocType(e.target.value as DocumentType)}
                className="w-full border border-slate-200 rounded-lg text-sm px-3 py-2.5 focus:outline-none focus:border-[#0a4d8c] focus:ring-1 focus:ring-[#0a4d8c] bg-white"
              >
                <option value="" disabled>Pilih jenis dokumen...</option>
                <option value="Wajib">Wajib – RKS / HPS / Pakta Integritas</option>
                <option value="Kondisional">Kondisional – TKDN / Izin Prinsip</option>
                <option value="Best Practice">Best Practice – Referensi Tambahan</option>
                <option value="Dokumentasi">Dokumentasi – Notulen / Kontrak</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Catatan Tambahan (Opsional)</label>
              <textarea 
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full border border-slate-200 rounded-lg text-sm px-3 py-2.5 focus:outline-none focus:border-[#0a4d8c] focus:ring-1 focus:ring-[#0a4d8c] bg-white resize-none"
                placeholder="Tambahkan instruksi khusus untuk pemeriksa..."
                rows={2}
              ></textarea>
            </div>

            {/* Upload Area */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Pilih File <span className="text-red-500">*</span></label>
              <div 
                className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center transition-colors ${isDragging ? 'border-[#0a4d8c] bg-blue-50' : 'border-slate-300 bg-slate-50 hover:bg-slate-100'}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {file ? (
                  <div className="flex flex-col items-center text-center w-full">
                    <p className="text-sm font-medium text-[#0a4d8c] mb-3">1 File Terpilih</p>
                    <button 
                      onClick={() => setFile(null)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors"
                    >
                      <X size={14} /> Ganti File
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-white text-slate-400 rounded-full flex items-center justify-center mb-3 shadow-sm border border-slate-100">
                      <UploadCloud size={24} />
                    </div>
                    <h3 className="text-sm font-semibold text-slate-700 mb-1">Tarik & Lepas File</h3>
                    <p className="text-xs text-slate-500 mb-4">PDF, DOCX, XLSX (Max. 20MB)</p>
                    
                    <label className="cursor-pointer bg-white border border-[#0a4d8c] text-[#0a4d8c] hover:bg-blue-50 px-4 py-2 rounded-lg text-xs font-medium transition-colors">
                      <span>Telusuri Komputer</span>
                      <input type="file" className="hidden" accept=".pdf,.doc,.docx,.xls,.xlsx" onChange={handleFileChange} />
                    </label>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 mt-auto">
            <button 
              onClick={() => router.push('/documents')}
              className="px-5 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-medium transition-colors shadow-sm"
            >
              Batal
            </button>
            <button 
              onClick={() => {
                if (!file || !docType) return;
                const newDoc: DocumentItem = {
                  id: `DOC-${Date.now()}`,
                  requestId: requestId || "REQ-2026-101",
                  name: file.name.replace(/\.[^/.]+$/, ""),
                  type: docType as DocumentType,
                  status: "Catatan Procurement",
                  uploadDate: new Date().toISOString().split("T")[0],
                  pic: "P3 - Admin",
                  issues: ["Dokumen baru diupload, menunggu pemeriksaan lengkap."],
                  nextAction: notes || "Periksa kelengkapan dokumen sesuai checklist Pra-Tender.",
                  canGenerateAiDraft: true,
                  fileName: file.name,
                  fileSize: file.size,
                };
                addDocument(newDoc);
                router.push('/documents/result');
              }}
              disabled={!file || !docType}
              className={`px-5 py-2.5 flex items-center gap-2 rounded-lg text-sm font-medium shadow-sm transition-all ${
                (file && docType) ? 'bg-[#0a4d8c] hover:bg-[#093e6f] text-white' : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <span>Mulai Pemeriksaan AI</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
