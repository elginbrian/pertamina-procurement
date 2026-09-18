import { createPortal } from "react-dom";
import { XCircle, PlusCircle, AlertCircle } from "lucide-react";
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
  if (typeof document === 'undefined') return null;
  
  return createPortal(
    <div className="fixed inset-0 z-[100] flex min-h-dvh items-center justify-center overflow-y-auto bg-slate-950/50 p-4" onClick={onClose}>
      <form
        className="w-full max-w-lg overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl"
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
        <div className="flex items-center justify-between bg-[#0a4d8c] px-5 py-4 text-white"><div><h2 className="text-sm font-bold">Edit SLA Pekerjaan</h2><p className="mt-1 text-xs text-blue-100">Atur rentang waktu dan tindak lanjut SLA.</p></div><button type="button" onClick={onClose} className="text-blue-100 hover:text-white"><XCircle size={20} /></button></div>
        <div className="grid gap-4 p-5 sm:grid-cols-2">
          <label className="sm:col-span-2"><span className="mb-1 block text-xs font-semibold text-slate-700">Nama aktivitas</span><input required name="taskName" defaultValue={deadline.taskName} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-[#0a4d8c] focus:outline-none" /></label>
          <label><span className="mb-1 block text-xs font-semibold text-slate-700">PIC</span><input required name="pic" defaultValue={deadline.pic.name} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-[#0a4d8c] focus:outline-none" /></label>
          <label><span className="mb-1 block text-xs font-semibold text-slate-700">Milestone</span><input required name="milestone" defaultValue={deadline.milestone} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-[#0a4d8c] focus:outline-none" /></label>
          <label><span className="mb-1 block text-xs font-semibold text-slate-700">Tanggal mulai</span><input required type="date" name="startDate" defaultValue={deadline.startDate ?? ""} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-[#0a4d8c] focus:outline-none" /></label>
          <label><span className="mb-1 block text-xs font-semibold text-slate-700">Target selesai</span><input required type="date" name="targetDate" defaultValue={deadline.targetDate} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-[#0a4d8c] focus:outline-none" /></label>
          <label className="sm:col-span-2"><span className="mb-1 block text-xs font-semibold text-slate-700">Next action</span><textarea required name="nextAction" rows={3} defaultValue={deadline.nextAction ?? ""} className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-[#0a4d8c] focus:outline-none" /></label>
          <label className="sm:col-span-2"><span className="mb-1 block text-xs font-semibold text-slate-700">Alasan keterlambatan</span><textarea name="overdueReason" rows={2} defaultValue={deadline.overdueReason ?? ""} placeholder="Diisi bila SLA melewati target selesai" className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-[#0a4d8c] focus:outline-none" /></label>
        </div>
        <div className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50 px-5 py-4"><button type="button" onClick={onClose} className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-200">Batal</button><button type="submit" className="rounded-lg bg-[#0a4d8c] px-4 py-2 text-sm font-semibold text-white hover:bg-[#093e6f]">Simpan SLA</button></div>
      </form>
    </div>
  , document.body);
}

export function DeadlineCreator({ requestId, pic, department, onClose, onSave }: { requestId: string; pic: BaseUser; department: Department; onClose: () => void; onSave: (deadline: DeadlineItem) => void }) {
  if (typeof document === 'undefined') return null;
  
  return createPortal(
    <div className="fixed inset-0 z-[100] flex min-h-dvh items-center justify-center overflow-y-auto bg-slate-950/50 p-4" onClick={onClose}>
      <form className="w-full max-w-lg overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl" onClick={(event) => event.stopPropagation()} onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const startDate = String(formData.get("startDate"));
        const targetDate = String(formData.get("targetDate"));
        if (targetDate < startDate) { alert("Target selesai tidak boleh lebih awal dari tanggal mulai."); return; }
        onSave({ id: `SLA-${Date.now()}`, requestId, taskName: String(formData.get("taskName")), milestone: String(formData.get("milestone")), pic: { id: "USR-NEW", name: String(formData.get("pic")) }, department, startDate, targetDate, status: "On Track", urgencyLevel: formData.get("urgencyLevel") as DeadlineItem["urgencyLevel"], nextAction: String(formData.get("nextAction")), overdueReason: String(formData.get("overdueReason")) });
      }}>
        <div className="flex items-center justify-between bg-[#0a4d8c] px-5 py-4 text-white"><div><h2 className="text-sm font-bold">Tambah SLA untuk Pekerjaan</h2><p className="mt-1 text-xs text-blue-100">Isi aktivitas terlebih dahulu, lalu atur periode SLA.</p></div><button type="button" onClick={onClose} className="text-blue-100 hover:text-white"><XCircle size={20} /></button></div>
        <div className="grid gap-4 p-5 sm:grid-cols-2">
          <label className="sm:col-span-2"><span className="mb-1 block text-xs font-semibold text-slate-700">Nama aktivitas</span><input required autoFocus name="taskName" placeholder="Contoh: Rapat pra-tender" className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-[#0a4d8c] focus:outline-none" /></label>
          <label><span className="mb-1 block text-xs font-semibold text-slate-700">PIC</span><input required name="pic" defaultValue={pic.name} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-[#0a4d8c] focus:outline-none" /></label>
          <label><span className="mb-1 block text-xs font-semibold text-slate-700">Milestone</span><select required name="milestone" className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-[#0a4d8c] focus:outline-none">{PROCUREMENT_STEPS.map(step => <option key={step} value={step}>{step}</option>)}</select></label>
          <label><span className="mb-1 block text-xs font-semibold text-slate-700">Tanggal mulai</span><input required type="date" name="startDate" className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-[#0a4d8c] focus:outline-none" /></label>
          <label><span className="mb-1 block text-xs font-semibold text-slate-700">Target selesai</span><input required type="date" name="targetDate" className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-[#0a4d8c] focus:outline-none" /></label>
          <label><span className="mb-1 block text-xs font-semibold text-slate-700">Urgensi</span><select name="urgencyLevel" defaultValue="Medium" className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-[#0a4d8c] focus:outline-none"><option>Low</option><option>Medium</option><option>High</option><option>Critical</option></select></label>
          <label className="sm:col-span-2"><span className="mb-1 block text-xs font-semibold text-slate-700">Next action</span><textarea required name="nextAction" rows={3} placeholder="Tindakan yang harus dilakukan PIC" className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-[#0a4d8c] focus:outline-none" /></label>
          <label className="sm:col-span-2"><span className="mb-1 block text-xs font-semibold text-slate-700">Alasan keterlambatan</span><textarea name="overdueReason" rows={2} placeholder="Opsional; isi bila target nantinya terlambat" className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-[#0a4d8c] focus:outline-none" /></label>
        </div>
        <div className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50 px-5 py-4"><button type="button" onClick={onClose} className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-200">Batal</button><button type="submit" className="rounded-lg bg-[#0a4d8c] px-4 py-2 text-sm font-semibold text-white hover:bg-[#093e6f]">Simpan SLA</button></div>
      </form>
    </div>
  , document.body);
}

export function AddRequestModal({ onClose, onSave }: { onClose: () => void; onSave: (request: ProcurementRequest) => void }) {
  if (typeof document === 'undefined') return null;
  
  return createPortal(
    <div className="fixed inset-0 z-[100] flex min-h-dvh items-center justify-center overflow-y-auto bg-slate-950/50 p-4" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-labelledby="add-request-title" className="w-full max-w-2xl overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-[#0a4d8c]">
          <div className="flex items-center gap-2">
            <PlusCircle size={18} className="text-white" />
            <h3 id="add-request-title" className="font-bold text-white text-sm">Tambah Request Baru</h3>
          </div>
          <button onClick={onClose} className="text-blue-200 hover:text-white transition-colors">
            <XCircle size={20} />
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
            <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-3 mb-5 flex items-start gap-3">
              <AlertCircle size={16} className="text-blue-500 shrink-0 mt-0.5" />
              <p className="text-xs text-blue-800 leading-relaxed">
                Pastikan informasi yang dimasukkan sudah sesuai dengan dokumen pendukung (FPP). Request baru akan otomatis masuk ke tahap <strong>Persiapan</strong>.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-5 mb-5">
              <div className="col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Judul Pengadaan <span className="text-red-500">*</span></label>
                <input required name="title" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#0a4d8c] focus:ring-1 focus:ring-[#0a4d8c]" placeholder="Contoh: Pengadaan Perangkat Jaringan (Router/Switch)" />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Nomor FPP <span className="text-red-500">*</span></label>
                <input required name="fpp" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#0a4d8c] focus:ring-1 focus:ring-[#0a4d8c]" placeholder="Contoh: FPP-2026-0801" />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">PIC Procurement <span className="text-red-500">*</span></label>
                <input required name="pic" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#0a4d8c] focus:ring-1 focus:ring-[#0a4d8c]" placeholder="Contoh: Budi Santoso" />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Nilai Pengadaan <span className="text-red-500">*</span></label>
                <input required name="amount" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#0a4d8c] focus:ring-1 focus:ring-[#0a4d8c]" placeholder="Contoh: Rp 150.0 Jt" />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Fungsi / Departemen <span className="text-red-500">*</span></label>
                <select required name="department" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#0a4d8c] focus:ring-1 focus:ring-[#0a4d8c] bg-white">
                  <option value="IT Infrastructure">IT Infrastructure</option>
                  <option value="Operations">Operations</option>
                  <option value="HR">Human Resources</option>
                  <option value="Creative">Creative</option>
                  <option value="General Affairs">General Affairs</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Tingkat Prioritas <span className="text-red-500">*</span></label>
                <select required name="priority" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#0a4d8c] focus:ring-1 focus:ring-[#0a4d8c] bg-white">
                  <option value="Normal">Normal</option>
                  <option value="Urgent">Urgent (Prioritas Tinggi)</option>
                </select>
              </div>
            </div>
          </div>
          <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end">
            <button type="submit" className="px-6 py-2.5 bg-[#0a4d8c] hover:bg-[#093e6f] text-white text-sm font-bold rounded-lg transition-all shadow-sm hover:shadow flex items-center gap-2">
              <PlusCircle size={16} />
              Buat Request Baru
            </button>
          </div>
        </form>
      </div>
    </div>
  , document.body);
}
