import { SettingsTabProps } from "./types";

export function SystemTab({ formData, handleChange }: SettingsTabProps) {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
      
      {/* SLA Section */}
      <section>
        <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2 mb-4">Toleransi & Peringatan SLA</h2>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Ambang Batas Peringatan (At Risk)</label>
          <p className="text-xs text-slate-500 mb-3">Notifikasi peringatan akan muncul ketika batas waktu tersisa kurang dari (X) hari.</p>
          <div className="flex items-center gap-3">
            <input 
              type="number" 
              min={1} 
              max={14}
              value={formData.slaWarningDays} 
              onChange={(e) => handleChange("slaWarningDays", parseInt(e.target.value) || 3)}
              className="w-24 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-[#0a4d8c] text-slate-800 font-medium" 
            />
            <span className="text-sm font-medium text-slate-600">Hari sebelum jatuh tempo</span>
          </div>
        </div>
        <div className="pt-4 mt-6 border-t border-slate-100">
          <h3 className="text-sm font-semibold text-slate-800 mb-4">Default Durasi Milestone (Referensi)</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-100">
              <span className="text-sm text-slate-600 font-medium">Evaluasi Teknis</span>
              <span className="text-sm font-bold text-slate-800">5 Hari</span>
            </div>
            <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-100">
              <span className="text-sm text-slate-600 font-medium">Prakualifikasi</span>
              <span className="text-sm font-bold text-slate-800">10 Hari</span>
            </div>
            <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-100">
              <span className="text-sm text-slate-600 font-medium">Contracting</span>
              <span className="text-sm font-bold text-slate-800">14 Hari</span>
            </div>
            <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-100">
              <span className="text-sm text-slate-600 font-medium">Tender / Sourcing</span>
              <span className="text-sm font-bold text-slate-800">20 Hari</span>
            </div>
          </div>
        </div>
      </section>

      {/* AI Section */}
      <section>
        <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2 mb-4">Konfigurasi OCR & AI PRIMA</h2>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Tingkat Sensitivitas Verifikasi Dokumen</label>
          <p className="text-xs text-slate-500 mb-4">Menentukan seberapa ketat AI dalam membaca ketidaksesuaian data (misal: beda format, typo nama).</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {["Low", "Medium", "High"].map((level) => (
              <div 
                key={level}
                onClick={() => handleChange("aiSensitivity", level)}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.aiSensitivity === level ? 'border-[#0a4d8c] bg-blue-50/50 shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300'}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${formData.aiSensitivity === level ? 'border-[#0a4d8c]' : 'border-slate-300'}`}>
                    {formData.aiSensitivity === level && <div className="w-2 h-2 rounded-full bg-[#0a4d8c]"></div>}
                  </div>
                </div>
                <h4 className="font-bold text-slate-800 text-sm">{level} {level === "Medium" && "(Disarankan)"}</h4>
                <p className="text-[11px] text-slate-500 mt-1">Pengaturan tingkat {level.toLowerCase()} untuk AI.</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Theme Section */}
      <section>
        <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2 mb-4">Pengaturan Tampilan (Tema)</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {["Light", "Dark", "System"].map((themeMode) => (
            <div 
              key={themeMode}
              onClick={() => handleChange("theme", themeMode)}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col items-center justify-center text-center gap-3 ${formData.theme === themeMode ? 'border-[#0a4d8c] bg-blue-50/50 shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300'}`}
            >
              <div className="w-16 h-12 border border-slate-200 rounded-md shadow-sm"></div>
              <div className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${formData.theme === themeMode ? 'border-[#0a4d8c]' : 'border-slate-300'}`}>
                  {formData.theme === themeMode && <div className="w-2 h-2 rounded-full bg-[#0a4d8c]"></div>}
                </div>
                <span className="text-sm font-semibold text-slate-700">{themeMode} Mode</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
