import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X, PlusCircle, AlertCircle } from "lucide-react";
import { DeadlineItem, ProcurementRequest, ProcurementStep, BaseUser, Department } from "@/types";

const PROCUREMENT_STEPS: ProcurementStep[] = [
  "Rapat Pra-Tender",
  "Pengumuman Pengadaan",
  "Prebid Meeting",
  "Pemasukan Dokumen Penawaran",
  "Pembukaan Penawaran",
  "Evaluasi Dokumen Penawaran",
  "Sosialisasi e-Auction",
  "Negosiasi e-Auction",
  "Negosiasi Manual",
  "Laporan Hasil Pemilihan",
  "Pengumuman Pemenang",
  "Penunjukan Pemenang",
];

export function DeadlineEditor({ deadline, onClose, onSave }: { deadline: DeadlineItem; onClose: () => void; onSave: (changes: Partial<DeadlineItem>) => void }) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (typeof document === 'undefined') return null;
  
  return createPortal(
    <div className="fixed inset-0 z-[100] flex min-h-dvh items-center justify-center overflow-y-auto bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-300" onClick={onClose}>
      <form
        className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl animate-in fade-in zoom-in-95 slide-in-from-bottom-2 duration-300 ease-out"
        onClick={(event) => event.stopPropagation()}
        onSubmit={(event) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          const startDate = String(formData.get("startDate"));
          const targetDate = String(formData.get("targetDate"));
          if (targetDate < startDate) {
            alert("Target selesai tidak boleh lebih awal dari tanggal mulai.");
            return;
          }
          onSave({
            taskName: String(formData.get("taskName")),
            pic: { id: "USR-EDIT", name: String(formData.get("pic")) },
            milestone: String(formData.get("milestone")),
            startDate,
            targetDate,
            nextAction: String(formData.get("nextAction")),
            overdueReason: String(formData.get("overdueReason")),
          });
        }}
      >
        <div className="flex items-center justify-between border-b border-slate-100 bg-white px-6 py-5">
          <div>
            <h2 className="text-base font-bold text-slate-800">Edit SLA Pekerjaan</h2>
            <p className="mt-1 text-xs text-slate-500">Atur rentang waktu dan tindak lanjut SLA.</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-full p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700">
            <X size={20} />
          </button>
        </div>
        <div className="grid gap-5 p-6 sm:grid-cols-2">
          <label className="sm:col-span-2"><span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-500">Nama aktivitas</span><input required name="taskName" defaultValue={deadline.taskName} className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-medium text-slate-700 transition-all focus:border-[#0a4d8c] focus:outline-none focus:ring-4 focus:ring-blue-100/50" /></label>
          <label><span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-500">PIC</span><input required name="pic" defaultValue={deadline.pic.name} className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-medium text-slate-700 transition-all focus:border-[#0a4d8c] focus:outline-none focus:ring-4 focus:ring-blue-100/50" /></label>
          <label><span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-500">Milestone</span><input required name="milestone" defaultValue={deadline.milestone} className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-medium text-slate-700 transition-all focus:border-[#0a4d8c] focus:outline-none focus:ring-4 focus:ring-blue-100/50" /></label>
          <label><span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-500">Tanggal mulai</span><input required type="date" name="startDate" defaultValue={deadline.startDate ?? ""} className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-medium text-slate-700 transition-all focus:border-[#0a4d8c] focus:outline-none focus:ring-4 focus:ring-blue-100/50" /></label>
          <label><span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-500">Target selesai</span><input required type="date" name="targetDate" defaultValue={deadline.targetDate} className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-medium text-slate-700 transition-all focus:border-[#0a4d8c] focus:outline-none focus:ring-4 focus:ring-blue-100/50" /></label>
          <label className="sm:col-span-2"><span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-500">Next action</span><textarea required name="nextAction" rows={3} defaultValue={deadline.nextAction ?? ""} className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-medium text-slate-700 transition-all focus:border-[#0a4d8c] focus:outline-none focus:ring-4 focus:ring-blue-100/50" /></label>
          <label className="sm:col-span-2"><span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-500">Alasan keterlambatan</span><textarea name="overdueReason" rows={2} defaultValue={deadline.overdueReason ?? ""} placeholder="Diisi bila SLA melewati target selesai" className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-medium text-slate-700 transition-all focus:border-[#0a4d8c] focus:outline-none focus:ring-4 focus:ring-blue-100/50" /></label>
        </div>
        <div className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50/80 px-6 py-4">
          <button type="button" onClick={onClose} className="rounded-lg px-4 py-2.5 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-200/50">Batal</button>
          <button type="submit" className="rounded-lg bg-[#0a4d8c] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-[#093e6f] hover:shadow">Simpan SLA</button>
        </div>
      </form>
    </div>
  , document.body);
}

export function DeadlineCreator({ requestId, pic, department, onClose, onSave }: { requestId: string; pic: BaseUser; department: Department; onClose: () => void; onSave: (deadline: DeadlineItem) => void }) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (typeof document === 'undefined') return null;
  
  return createPortal(
    <div className="fixed inset-0 z-[100] flex min-h-dvh items-center justify-center overflow-y-auto bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-300" onClick={onClose}>
      <form className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl animate-in fade-in zoom-in-95 slide-in-from-bottom-2 duration-300 ease-out" onClick={(event) => event.stopPropagation()} onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const startDate = String(formData.get("startDate"));
        const targetDate = String(formData.get("targetDate"));
        if (targetDate < startDate) { alert("Target selesai tidak boleh lebih awal dari tanggal mulai."); return; }
        onSave({ id: `SLA-${Date.now()}`, requestId, taskName: String(formData.get("taskName")), milestone: String(formData.get("milestone")), pic: { id: "USR-NEW", name: String(formData.get("pic")) }, department, startDate, targetDate, status: "On Track", urgencyLevel: formData.get("urgencyLevel") as DeadlineItem["urgencyLevel"], nextAction: String(formData.get("nextAction")), overdueReason: String(formData.get("overdueReason")) });
      }}>
        <div className="flex items-center justify-between border-b border-slate-100 bg-white px-6 py-5">
          <div>
            <h2 className="text-base font-bold text-slate-800">Tambah SLA untuk Pekerjaan</h2>
            <p className="mt-1 text-xs text-slate-500">Isi aktivitas terlebih dahulu, lalu atur periode SLA.</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-full p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700">
            <X size={20} />
          </button>
        </div>
        <div className="grid gap-5 p-6 sm:grid-cols-2">
          <label className="sm:col-span-2"><span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-500">Nama aktivitas</span><input required autoFocus name="taskName" placeholder="Contoh: Rapat pra-tender" className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-medium text-slate-700 transition-all focus:border-[#0a4d8c] focus:outline-none focus:ring-4 focus:ring-blue-100/50" /></label>
          <label><span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-500">PIC</span><input required name="pic" defaultValue={pic.name} className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-medium text-slate-700 transition-all focus:border-[#0a4d8c] focus:outline-none focus:ring-4 focus:ring-blue-100/50" /></label>
          <label><span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-500">Milestone</span><select required name="milestone" className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 transition-all focus:border-[#0a4d8c] focus:outline-none focus:ring-4 focus:ring-blue-100/50">{PROCUREMENT_STEPS.map(step => <option key={step} value={step}>{step}</option>)}</select></label>
          <label><span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-500">Tanggal mulai</span><input required type="date" name="startDate" className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-medium text-slate-700 transition-all focus:border-[#0a4d8c] focus:outline-none focus:ring-4 focus:ring-blue-100/50" /></label>
          <label><span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-500">Target selesai</span><input required type="date" name="targetDate" className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-medium text-slate-700 transition-all focus:border-[#0a4d8c] focus:outline-none focus:ring-4 focus:ring-blue-100/50" /></label>
          <label><span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-500">Urgensi</span><select name="urgencyLevel" defaultValue="Medium" className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 transition-all focus:border-[#0a4d8c] focus:outline-none focus:ring-4 focus:ring-blue-100/50"><option>Low</option><option>Medium</option><option>High</option><option>Critical</option></select></label>
          <label className="sm:col-span-2"><span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-500">Next action</span><textarea required name="nextAction" rows={3} placeholder="Tindakan yang harus dilakukan PIC" className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-medium text-slate-700 transition-all focus:border-[#0a4d8c] focus:outline-none focus:ring-4 focus:ring-blue-100/50" /></label>
          <label className="sm:col-span-2"><span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-500">Alasan keterlambatan</span><textarea name="overdueReason" rows={2} placeholder="Opsional; isi bila target nantinya terlambat" className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-medium text-slate-700 transition-all focus:border-[#0a4d8c] focus:outline-none focus:ring-4 focus:ring-blue-100/50" /></label>
        </div>
        <div className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50/80 px-6 py-4">
          <button type="button" onClick={onClose} className="rounded-lg px-4 py-2.5 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-200/50">Batal</button>
          <button type="submit" className="rounded-lg bg-[#0a4d8c] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-[#093e6f] hover:shadow">Simpan SLA</button>
        </div>
      </form>
    </div>
  , document.body);
}

export function AddRequestModal({ onClose, onSave }: { onClose: () => void; onSave: (request: ProcurementRequest) => void }) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (typeof document === 'undefined') return null;
  
  return createPortal(
    <div className="fixed inset-0 z-[100] flex min-h-dvh items-center justify-center overflow-y-auto bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-300" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-labelledby="add-request-title" className="w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl animate-in fade-in zoom-in-95 slide-in-from-bottom-2 duration-300 ease-out" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-slate-100 bg-white p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#0a4d8c]">
              <PlusCircle size={20} />
            </div>
            <div>
              <h3 id="add-request-title" className="text-base font-bold text-slate-800">Tambah Request Baru</h3>
              <p className="mt-0.5 text-xs text-slate-500">Inisiasi pekerjaan pengadaan baru</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          
          onSave({
            id: `REQ-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`,
            title: String(formData.get("title")),
            pic: { id: "USR-NEW", name: String(formData.get("pic")) },
            amount: Number(String(formData.get("amount")).replace(/\D/g, "")),
            stage: "Persiapan",
            operationalStatus: "On Going",
            currentStep: "Rapat Pra-Tender",
            department: { id: "DEPT-NEW", name: String(formData.get("department")) },
            fpp: { id: "USR-FPP", name: "User FPP" },
            stageStartedAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          });
        }}>
          <div className="p-6">
            <div className="mb-6 flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50/50 p-4">
              <AlertCircle size={18} className="mt-0.5 shrink-0 text-blue-600" />
              <p className="text-xs leading-relaxed text-blue-800">
                Pastikan informasi yang dimasukkan sudah sesuai dengan dokumen pendukung (FPP). Request baru akan otomatis masuk ke tahap <strong className="font-bold">Persiapan</strong>.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-6 mb-2">
              <div className="col-span-2">
                <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-500">Judul Pengadaan <span className="text-red-500">*</span></label>
                <input required name="title" className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition-all focus:border-[#0a4d8c] focus:outline-none focus:ring-4 focus:ring-blue-100/50" placeholder="Contoh: Pengadaan Perangkat Jaringan (Router/Switch)" />
              </div>
              
              <div>
                <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-500">Nomor FPP <span className="text-red-500">*</span></label>
                <input required name="fpp" className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition-all focus:border-[#0a4d8c] focus:outline-none focus:ring-4 focus:ring-blue-100/50" placeholder="Contoh: FPP-2026-0801" />
              </div>

              <div>
                <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-500">PIC Procurement <span className="text-red-500">*</span></label>
                <input required name="pic" className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition-all focus:border-[#0a4d8c] focus:outline-none focus:ring-4 focus:ring-blue-100/50" placeholder="Contoh: Budi Santoso" />
              </div>
              
              <div>
                <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-500">Nilai Pengadaan <span className="text-red-500">*</span></label>
                <input required name="amount" className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition-all focus:border-[#0a4d8c] focus:outline-none focus:ring-4 focus:ring-blue-100/50" placeholder="Contoh: Rp 150.0 Jt" />
              </div>
              
              <div>
                <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-500">Fungsi / Departemen <span className="text-red-500">*</span></label>
                <select required name="department" className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-all focus:border-[#0a4d8c] focus:outline-none focus:ring-4 focus:ring-blue-100/50">
                  <option value="IT Infrastructure">IT Infrastructure</option>
                  <option value="Operations">Operations</option>
                  <option value="HR">Human Resources</option>
                  <option value="Creative">Creative</option>
                  <option value="General Affairs">General Affairs</option>
                </select>
              </div>
              
              <div className="col-span-2">
                <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-500">Tingkat Prioritas <span className="text-red-500">*</span></label>
                <select required name="priority" className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-all focus:border-[#0a4d8c] focus:outline-none focus:ring-4 focus:ring-blue-100/50">
                  <option value="Normal">Normal</option>
                  <option value="Urgent">Urgent (Prioritas Tinggi)</option>
                </select>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50/80 p-6">
            <button type="button" onClick={onClose} className="rounded-lg px-4 py-2.5 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-200/50">Batal</button>
            <button type="submit" className="flex items-center gap-2 rounded-lg bg-[#0a4d8c] px-6 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-[#093e6f] hover:shadow">
              <PlusCircle size={16} />
              Buat Request Baru
            </button>
          </div>
        </form>
      </div>
    </div>
  , document.body);
}
