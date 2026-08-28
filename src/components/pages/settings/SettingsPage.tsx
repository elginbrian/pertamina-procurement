"use client";

import { useState } from "react";
import { Settings, Bell, Clock, Cpu, Palette, Save, User, ArrowRight } from "lucide-react";
import { useProcurement } from "@/context/ProcurementContext";

export default function SettingsPage() {
  const { state, updateSettings } = useProcurement();
  const settings = state.settings;
  
  // Local state for form fields to handle edits before saving
  const [formData, setFormData] = useState({ ...settings });
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("umum");

  const handleChange = (key: keyof typeof settings, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    setIsSaving(true);
    // Mock saving delay
    setTimeout(() => {
      updateSettings(formData);
      setIsSaving(false);
      alert("Pengaturan berhasil disimpan.");
    }, 600);
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        
        {/* Settings Header */}
        <div className="p-6 md:p-8 border-b border-slate-200 bg-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm border border-slate-200 text-[#0a4d8c]">
              <Settings size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">Pengaturan Sistem</h1>
              <p className="text-sm text-slate-500 mt-1">Konfigurasi preferensi Pertamina Procurement Dashboard.</p>
            </div>
          </div>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="w-full md:w-auto flex items-center justify-center gap-2 bg-[#0a4d8c] hover:bg-[#093e6f] text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Menyimpan...
              </>
            ) : (
              <>
                <Save size={16} />
                Simpan Perubahan
              </>
            )}
          </button>
        </div>

        <div className="flex flex-col lg:flex-row">
          {/* Sidebar Tabs */}
          <div className="w-full lg:w-64 bg-slate-50 border-r border-slate-200 flex lg:flex-col overflow-x-auto">
            <button 
              onClick={() => setActiveTab("umum")}
              className={`flex items-center gap-3 px-6 py-4 text-sm font-medium text-left transition-colors whitespace-nowrap ${activeTab === "umum" ? 'bg-white text-[#0a4d8c] border-b-2 lg:border-b-0 lg:border-r-2 border-[#0a4d8c]' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 border-b-2 lg:border-b-0 border-transparent'}`}
            >
              <User size={18} /> Profil & Akun
            </button>
            <button 
              onClick={() => setActiveTab("notifikasi")}
              className={`flex items-center gap-3 px-6 py-4 text-sm font-medium text-left transition-colors whitespace-nowrap ${activeTab === "notifikasi" ? 'bg-white text-[#0a4d8c] border-b-2 lg:border-b-0 lg:border-r-2 border-[#0a4d8c]' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 border-b-2 lg:border-b-0 border-transparent'}`}
            >
              <Bell size={18} /> Notifikasi
            </button>
            <button 
              onClick={() => setActiveTab("sla")}
              className={`flex items-center gap-3 px-6 py-4 text-sm font-medium text-left transition-colors whitespace-nowrap ${activeTab === "sla" ? 'bg-white text-[#0a4d8c] border-b-2 lg:border-b-0 lg:border-r-2 border-[#0a4d8c]' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 border-b-2 lg:border-b-0 border-transparent'}`}
            >
              <Clock size={18} /> Toleransi SLA
            </button>
            <button 
              onClick={() => setActiveTab("ai")}
              className={`flex items-center gap-3 px-6 py-4 text-sm font-medium text-left transition-colors whitespace-nowrap ${activeTab === "ai" ? 'bg-white text-[#0a4d8c] border-b-2 lg:border-b-0 lg:border-r-2 border-[#0a4d8c]' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 border-b-2 lg:border-b-0 border-transparent'}`}
            >
              <Cpu size={18} /> OCR & AI PRIMA
            </button>
            <button 
              onClick={() => setActiveTab("tampilan")}
              className={`flex items-center gap-3 px-6 py-4 text-sm font-medium text-left transition-colors whitespace-nowrap ${activeTab === "tampilan" ? 'bg-white text-[#0a4d8c] border-b-2 lg:border-b-0 lg:border-r-2 border-[#0a4d8c]' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 border-b-2 lg:border-b-0 border-transparent'}`}
            >
              <Palette size={18} /> Tampilan
            </button>
          </div>

          {/* Form Content */}
          <div className="flex-1 p-6 md:p-8 bg-white">
            
            {/* TAB: UMUM (Profile) */}
            {activeTab === "umum" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2">Informasi Pengguna</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Nama Lengkap</label>
                    <input type="text" disabled defaultValue="Admin Procurement" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-500 font-medium cursor-not-allowed" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Fungsi / Departemen</label>
                    <input type="text" disabled defaultValue="Pengadaan Barang / Jasa (P3)" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-500 font-medium cursor-not-allowed" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email Pertamina</label>
                    <input type="email" disabled defaultValue="admin.procurement@pertamina.com" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-500 font-medium cursor-not-allowed" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Peran (Role)</label>
                    <input type="text" disabled defaultValue="Super Admin / P3 Manager" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-500 font-medium cursor-not-allowed" />
                  </div>
                </div>
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mt-4 text-sm text-blue-800">
                  Untuk mengubah profil, Anda harus memperbarui data di portal HRIS MyPertamina.
                </div>
              </div>
            )}

            {/* TAB: NOTIFIKASI */}
            {activeTab === "notifikasi" && (
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
            )}

            {/* TAB: SLA */}
            {activeTab === "sla" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2">Toleransi & Peringatan SLA</h2>
                
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
              </div>
            )}

            {/* TAB: AI PRIMA */}
            {activeTab === "ai" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2">Konfigurasi OCR & AI PRIMA</h2>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Tingkat Sensitivitas Verifikasi Dokumen</label>
                  <p className="text-xs text-slate-500 mb-4">Menentukan seberapa ketat AI dalam membaca ketidaksesuaian data (misal: beda format, typo nama).</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div 
                      onClick={() => handleChange("aiSensitivity", "Low")}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.aiSensitivity === "Low" ? 'border-[#0a4d8c] bg-blue-50/50 shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300'}`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${formData.aiSensitivity === "Low" ? 'border-[#0a4d8c]' : 'border-slate-300'}`}>
                          {formData.aiSensitivity === "Low" && <div className="w-2 h-2 rounded-full bg-[#0a4d8c]"></div>}
                        </div>
                      </div>
                      <h4 className="font-bold text-slate-800 text-sm">Low (Rendah)</h4>
                      <p className="text-[11px] text-slate-500 mt-1">Mengabaikan typo kecil dan format yang sedikit berbeda. Fokus pada nilai utama.</p>
                    </div>
                    
                    <div 
                      onClick={() => handleChange("aiSensitivity", "Medium")}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.aiSensitivity === "Medium" ? 'border-[#0a4d8c] bg-blue-50/50 shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300'}`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${formData.aiSensitivity === "Medium" ? 'border-[#0a4d8c]' : 'border-slate-300'}`}>
                          {formData.aiSensitivity === "Medium" && <div className="w-2 h-2 rounded-full bg-[#0a4d8c]"></div>}
                        </div>
                      </div>
                      <h4 className="font-bold text-slate-800 text-sm">Medium (Disarankan)</h4>
                      <p className="text-[11px] text-slate-500 mt-1">Seimbang. Hanya memberi peringatan (Catatan) untuk anomali yang signifikan.</p>
                    </div>
                    
                    <div 
                      onClick={() => handleChange("aiSensitivity", "High")}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.aiSensitivity === "High" ? 'border-[#0a4d8c] bg-blue-50/50 shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300'}`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${formData.aiSensitivity === "High" ? 'border-[#0a4d8c]' : 'border-slate-300'}`}>
                          {formData.aiSensitivity === "High" && <div className="w-2 h-2 rounded-full bg-[#0a4d8c]"></div>}
                        </div>
                      </div>
                      <h4 className="font-bold text-slate-800 text-sm">High (Ketat)</h4>
                      <p className="text-[11px] text-slate-500 mt-1">Sangat ketat. Seluruh inkonsistensi huruf/angka sekecil apapun akan dilaporkan.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex gap-3 items-start mt-6">
                  <Cpu size={18} className="text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-700">AI Draft Engine (Auto-Generate Surat)</h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">Sistem saat ini terhubung ke *PRIMA Language Model v2.4* untuk membuat draft dokumen tindak lanjut FPP, Surat Peringatan SLA, dan Teguran Vendor.</p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: TAMPILAN */}
            {activeTab === "tampilan" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2">Pengaturan Tampilan (Tema)</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div 
                    onClick={() => handleChange("theme", "Light")}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col items-center justify-center text-center gap-3 ${formData.theme === "Light" ? 'border-[#0a4d8c] bg-blue-50/50 shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300'}`}
                  >
                    <div className="w-16 h-12 bg-white border border-slate-200 rounded-md flex items-center justify-center shadow-sm">
                      <span className="text-slate-800 font-bold text-xs">Light</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${formData.theme === "Light" ? 'border-[#0a4d8c]' : 'border-slate-300'}`}>
                        {formData.theme === "Light" && <div className="w-2 h-2 rounded-full bg-[#0a4d8c]"></div>}
                      </div>
                      <span className="text-sm font-semibold text-slate-700">Light Mode</span>
                    </div>
                  </div>
                  
                  <div 
                    onClick={() => handleChange("theme", "Dark")}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col items-center justify-center text-center gap-3 ${formData.theme === "Dark" ? 'border-[#0a4d8c] bg-blue-50/50 shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300'}`}
                  >
                    <div className="w-16 h-12 bg-slate-900 border border-slate-700 rounded-md flex items-center justify-center shadow-sm">
                      <span className="text-slate-100 font-bold text-xs">Dark</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${formData.theme === "Dark" ? 'border-[#0a4d8c]' : 'border-slate-300'}`}>
                        {formData.theme === "Dark" && <div className="w-2 h-2 rounded-full bg-[#0a4d8c]"></div>}
                      </div>
                      <span className="text-sm font-semibold text-slate-700">Dark Mode</span>
                    </div>
                  </div>

                  <div 
                    onClick={() => handleChange("theme", "System")}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col items-center justify-center text-center gap-3 ${formData.theme === "System" ? 'border-[#0a4d8c] bg-blue-50/50 shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300'}`}
                  >
                    <div className="w-16 h-12 bg-gradient-to-r from-white to-slate-900 border border-slate-300 rounded-md shadow-sm"></div>
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${formData.theme === "System" ? 'border-[#0a4d8c]' : 'border-slate-300'}`}>
                        {formData.theme === "System" && <div className="w-2 h-2 rounded-full bg-[#0a4d8c]"></div>}
                      </div>
                      <span className="text-sm font-semibold text-slate-700">Ikuti Sistem</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
}
