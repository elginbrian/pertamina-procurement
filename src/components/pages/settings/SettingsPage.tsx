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
    { id: "sistem", label: "Pengaturan Sistem", icon: Settings },
  ];

  return (
    <div className="space-y-6 pb-12">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        
        <div className="flex flex-col">
          {/* Top Tabs */}
          <div className="flex w-full overflow-x-auto bg-white border-b border-slate-200 px-2 sm:px-6 scrollbar-none">
            {tabs.map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center justify-center gap-2 px-6 py-4 text-sm font-bold transition-all whitespace-nowrap ${activeTab === tab.id ? 'border-b-2 border-[#0a4d8c] text-[#0a4d8c]' : 'border-b-2 border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50/50'}`}
              >
                <tab.icon size={18} className="shrink-0" /> 
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Form Content */}
          <div className="bg-white p-6 sm:p-8 lg:p-10 flex flex-col min-w-0 w-full">
            <div className="flex-1 w-full">
              {activeTab === "umum" && <ProfileTab />}
              {activeTab === "notifikasi" && <NotificationTab formData={formData} handleChange={handleChange} users={state.users} />}
              {activeTab === "sistem" && <SystemTab formData={formData} handleChange={handleChange} users={state.users} />}
            </div>
            
            <div className="mt-12 flex justify-end border-t border-slate-100 pt-6 sm:pt-8 w-full">
              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#0a4d8c] px-12 py-3 text-sm font-bold tracking-wide text-white shadow-sm transition-all hover:bg-[#093e6f] hover:shadow disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
              >
                {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
