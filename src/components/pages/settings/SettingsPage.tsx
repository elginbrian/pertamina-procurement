"use client";

import { useState } from "react";
import { Settings, Bell, Clock, Cpu, Palette, Save, User } from "lucide-react";
import { useProcurement } from "@/context/ProcurementContext";
import { ProfileTab } from "./tabs/ProfileTab";
import { NotificationTab } from "./tabs/NotificationTab";
import { SystemTab } from "./tabs/SystemTab";

export default function SettingsPage() {
  const { state, updateSettings } = useProcurement();
  const settings = state.settings;
  
  const [formData, setFormData] = useState({ ...settings });
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("umum");

  const handleChange = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key as keyof typeof settings]: value }));
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      updateSettings(formData);
      setIsSaving(false);
      alert("Pengaturan berhasil disimpan.");
    }, 600);
  };

  const tabs = [
    { id: "umum", label: "Profil & Akun", icon: User },
    { id: "notifikasi", label: "Notifikasi", icon: Bell },
    { id: "sistem", label: "Pengaturan Sistem (SLA, AI, Tema)", icon: Settings },
  ];

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
            {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>

        <div className="flex flex-col lg:flex-row">
          {/* Sidebar Tabs */}
          <div className="w-full lg:w-64 bg-slate-50 border-r border-slate-200 flex lg:flex-col overflow-x-auto">
            {tabs.map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-6 py-4 text-sm font-medium text-left transition-colors whitespace-nowrap ${activeTab === tab.id ? 'bg-white text-[#0a4d8c] border-b-2 lg:border-b-0 lg:border-r-2 border-[#0a4d8c]' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 border-b-2 lg:border-b-0 border-transparent'}`}
              >
                <tab.icon size={18} /> {tab.label}
              </button>
            ))}
          </div>

          {/* Form Content */}
          <div className="flex-1 p-6 md:p-8 bg-white">
            {activeTab === "umum" && <ProfileTab />}
            {activeTab === "notifikasi" && <NotificationTab formData={formData} handleChange={handleChange} />}
            {activeTab === "sistem" && <SystemTab formData={formData} handleChange={handleChange} />}
          </div>
        </div>
      </div>
    </div>
  );
}
