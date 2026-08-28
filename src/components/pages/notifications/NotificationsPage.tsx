"use client";

import { useState } from "react";
import { Bell, CheckCircle2, AlertCircle, FileText, Clock, Settings, Search, CheckSquare } from "lucide-react";
import { useProcurement } from "@/context/ProcurementContext";
import type { NotificationType, NotificationItem } from "@/lib/types";

export default function NotificationsPage() {
  const { state, markNotificationRead, markAllRead } = useProcurement();
  const notifications = state.notifications;
  const [activeTab, setActiveTab] = useState<"All" | "Unread">("All");

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAllAsRead = () => {
    markAllRead();
  };

  const markAsRead = (id: string) => {
    markNotificationRead(id);
  };

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case "success": return <CheckCircle2 size={18} className="text-emerald-500" />;
      case "alert": return <AlertCircle size={18} className="text-amber-500" />;
      case "deadline": return <Clock size={18} className="text-red-500" />;
      case "document": return <FileText size={18} className="text-[#0a4d8c]" />;
      case "system": return <Settings size={18} className="text-slate-500" />;
    }
  };

  const getBgStyle = (type: NotificationType, isRead: boolean) => {
    if (isRead) return "bg-slate-50 border-slate-200 text-slate-500";
    
    switch (type) {
      case "success": return "bg-emerald-50 border-emerald-200";
      case "alert": return "bg-amber-50 border-amber-200";
      case "deadline": return "bg-red-50 border-red-200";
      case "document": return "bg-blue-50 border-blue-200";
      case "system": return "bg-slate-100 border-slate-300";
    }
  };

  const filteredNotifications = notifications.filter(n => activeTab === "All" || !n.isRead);

  // Group notifications by category
  const groupedNotifications = filteredNotifications.reduce((acc, notif) => {
    if (!acc[notif.category]) acc[notif.category] = [];
    acc[notif.category].push(notif);
    return acc;
  }, {} as Record<string, NotificationItem[]>);

  const categories = ["Hari Ini", "Kemarin", "Lebih Lama"];

  return (
    <div className="w-full pb-12">
      {/* Header Panel */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 sm:p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100">
              <Bell size={24} className="text-[#0a4d8c]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">Pusat Notifikasi</h2>
              <p className="text-sm text-slate-500">Anda memiliki <span className="font-bold text-[#0a4d8c]">{unreadCount} notifikasi baru</span></p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex bg-slate-100 p-1 rounded-lg">
              <button 
                onClick={() => setActiveTab("All")}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${activeTab === "All" ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Semua
              </button>
              <button 
                onClick={() => setActiveTab("Unread")}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${activeTab === "Unread" ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Belum Dibaca
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-6">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text" 
            placeholder="Cari notifikasi..." 
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#0a4d8c] focus:ring-1 focus:ring-[#0a4d8c] shadow-sm"
          />
        </div>
        
        {unreadCount > 0 && (
          <button 
            onClick={markAllAsRead}
            className="flex items-center gap-2 text-[#0a4d8c] hover:text-[#093e6f] font-medium text-sm transition-colors bg-white px-3 py-2 rounded-lg border border-slate-200 shadow-sm"
          >
            <CheckSquare size={16} />
            Tandai semua dibaca
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="space-y-8">
        {filteredNotifications.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-12 text-center shadow-sm">
            <Bell size={48} className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-lg font-medium text-slate-700">Tidak ada notifikasi</h3>
            <p className="text-slate-500 mt-1">Anda sudah membaca semua pemberitahuan.</p>
          </div>
        ) : (
          categories.map(category => {
            if (!groupedNotifications[category] || groupedNotifications[category].length === 0) return null;
            
            return (
              <div key={category}>
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3 px-1">{category}</h3>
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col divide-y divide-slate-100">
                  {groupedNotifications[category].map((notif) => (
                    <div 
                      key={notif.id}
                      onClick={() => markAsRead(notif.id)}
                      className={`p-4 sm:p-5 flex gap-4 transition-colors hover:bg-slate-50 cursor-pointer ${notif.isRead ? 'opacity-70' : 'bg-white'}`}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border ${getBgStyle(notif.type, notif.isRead)}`}>
                        {getIcon(notif.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4 mb-1">
                          <h4 className={`text-sm truncate ${notif.isRead ? 'font-medium text-slate-700' : 'font-bold text-slate-900'}`}>
                            {notif.title}
                          </h4>
                          <span className="text-[11px] font-medium text-slate-400 whitespace-nowrap">{notif.time}</span>
                        </div>
                        <p className={`text-[13px] leading-relaxed ${notif.isRead ? 'text-slate-500' : 'text-slate-600'}`}>
                          {notif.description}
                        </p>
                      </div>
                      {!notif.isRead && (
                        <div className="w-2 h-2 rounded-full bg-[#0a4d8c] mt-1.5 shrink-0"></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
