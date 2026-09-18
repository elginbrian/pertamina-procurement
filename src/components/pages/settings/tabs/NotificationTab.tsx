import { SettingsTabProps } from "./types";

export function NotificationTab({ formData, handleChange }: SettingsTabProps) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2">Preferensi Notifikasi</h2>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl bg-white hover:border-[#0a4d8c] transition-colors cursor-pointer" onClick={() => handleChange("emailNotifications", !formData.emailNotifications)}>
          <div>
            <div className="font-semibold text-slate-800 text-sm">Notifikasi Email</div>
            <div className="text-xs text-slate-500 mt-1">Kirim ringkasan SLA dan tindakan harian ke email.</div>
          </div>
          <div className={`w-12 h-6 rounded-full relative transition-colors ${formData.emailNotifications ? 'bg-emerald-500' : 'bg-slate-300'}`}>
            <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${formData.emailNotifications ? 'left-7' : 'left-1'}`}></div>
          </div>
        </div>
        
        <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl bg-white hover:border-[#0a4d8c] transition-colors cursor-pointer" onClick={() => handleChange("whatsappNotifications", !formData.whatsappNotifications)}>
          <div>
            <div className="font-semibold text-slate-800 text-sm">Notifikasi WhatsApp</div>
            <div className="text-xs text-slate-500 mt-1">Kirim peringatan instan saat SLA akan Overdue atau Jaminan Expired.</div>
          </div>
          <div className={`w-12 h-6 rounded-full relative transition-colors ${formData.whatsappNotifications ? 'bg-emerald-500' : 'bg-slate-300'}`}>
            <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${formData.whatsappNotifications ? 'left-7' : 'left-1'}`}></div>
          </div>
        </div>
        
        <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl bg-white hover:border-[#0a4d8c] transition-colors cursor-pointer" onClick={() => handleChange("autoEscalation", !formData.autoEscalation)}>
          <div>
            <div className="font-semibold text-slate-800 text-sm">Auto-Eskalasi ke Atasan</div>
            <div className="text-xs text-slate-500 mt-1">Eskalasi otomatis jika SLA terlewat lebih dari 3 hari.</div>
          </div>
          <div className={`w-12 h-6 rounded-full relative transition-colors ${formData.autoEscalation ? 'bg-emerald-500' : 'bg-slate-300'}`}>
            <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${formData.autoEscalation ? 'left-7' : 'left-1'}`}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
