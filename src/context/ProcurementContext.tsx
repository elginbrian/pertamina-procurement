"use client";

import React, { createContext, useContext, useReducer, useCallback } from "react";
import type { ProcurementState, ProcurementStage, ProcurementStep, ProcurementRequest, ProcurementOperationalStatus, DocumentItem, GuaranteeItem, ProcurementAttachment, ActionItem, NotificationItem, DeadlineItem, HistoryItem } from "@/lib/types";
import { initialProcurementState } from "@/lib/mockData";
import { getDeadlineTiming } from "@/lib/deadlineUtils";

// ─── ACTIONS ────────────────────────────────────────────────────────────────

type ProcurementAction =
  // Tracker
  | { type: "ADD_REQUEST"; request: ProcurementRequest }
  | { type: "MOVE_REQUEST"; id: string; stage: ProcurementStage }
  | { type: "UPDATE_REQUEST_OPERATIONAL_STATUS"; id: string; status: ProcurementOperationalStatus; reason?: string }
  | { type: "MOVE_REQUEST_STEP"; id: string; step: ProcurementStep }
  // D1 Documents
  | { type: "ADD_DOCUMENT"; document: DocumentItem }
  | { type: "UPDATE_DOCUMENT_STATUS"; id: string; status: DocumentItem["status"] }
  // D2 Guarantees
  | { type: "ADD_GUARANTEE"; guarantee: GuaranteeItem }
  | { type: "UPDATE_GUARANTEE"; id: string; changes: Partial<GuaranteeItem> }
  | { type: "ADD_ATTACHMENT"; attachment: ProcurementAttachment }
  // D4 Deadlines
  | { type: "ADD_DEADLINE"; deadline: DeadlineItem }
  | { type: "UPDATE_DEADLINE"; id: string; changes: Partial<DeadlineItem> }
  | { type: "UPDATE_DEADLINE_STATUS"; id: string; status: "On Track" | "At Risk" | "Overdue" | "Selesai" }
  // Actions
  | { type: "UPDATE_ACTION_STATUS"; id: string; status: ActionItem["status"] }
  | { type: "ADD_ACTION"; action: ActionItem }
  // Notifications
  | { type: "MARK_NOTIFICATION_READ"; id: string }
  | { type: "MARK_ALL_READ" }
  | { type: "ADD_NOTIFICATION"; notification: NotificationItem }
  // Settings
  | { type: "UPDATE_SETTINGS"; settings: Partial<ProcurementState["settings"]> };

const stageForStep: Record<ProcurementStep, ProcurementStage> = {
  "Rapat Pra-Tender": "Sourcing",
  "Pengumuman Pengadaan": "Sourcing",
  "Prebid Meeting": "Sourcing",
  "Pemasukan Dokumen Penawaran": "Sourcing",
  "Pembukaan Penawaran": "Evaluasi",
  "Evaluasi Dokumen Penawaran": "Evaluasi",
  "Sosialisasi e-Auction": "Evaluasi",
  "Negosiasi e-Auction": "Evaluasi",
  "Negosiasi Manual": "Evaluasi",
  "Laporan Hasil Pemilihan": "Contracting",
  "Pengumuman Pemenang": "Contracting",
  "Penunjukan Pemenang": "Selesai",
};

function historyItem(requestId: string, category: HistoryItem["category"], title: string, description: string): HistoryItem {
  return { id: `HIST-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, requestId, category, title, description, createdAt: new Date().toISOString() };
}

function actionForGuarantee(guarantee: GuaranteeItem): ActionItem | null {
  if (guarantee.status === "Aktif" && !guarantee.nextAction) return null;

  const isExpired = guarantee.status === "Expired";
  return {
    id: `ACT-GUAR-${Date.now()}`,
    requestId: guarantee.requestId,
    referenceId: guarantee.id,
    title: isExpired ? `Eskalasi Jaminan Expired: ${guarantee.referenceNo}` : `Tindak Lanjut Jaminan: ${guarantee.referenceNo}`,
    source: "Jaminan",
    priority: isExpired ? "High" : "Medium",
    dateAdded: new Date().toISOString().split("T")[0],
    dueDate: new Date(Date.now() + (isExpired ? 86400000 : 3 * 86400000)).toISOString().split("T")[0],
    description: guarantee.nextAction ?? `Pantau jaminan ${guarantee.referenceNo} dan koordinasikan tindak lanjut sebelum expiry.`,
    assignee: guarantee.pic,
    status: "Pending",
    actionType: isExpired ? "Eskalasi" : "Follow Up",
  };
}

function actionForDeadline(deadline: DeadlineItem): ActionItem | null {
  if (deadline.status === "Selesai") return null;

  return {
    id: `ACT-DL-${Date.now()}`,
    requestId: deadline.requestId,
    referenceId: deadline.id,
    title: deadline.nextAction ?? `Tindak Lanjut SLA: ${deadline.taskName}`,
    source: "Deadline",
    priority: deadline.urgencyLevel === "Critical" || deadline.status === "Overdue" ? "High" : "Medium",
    dateAdded: new Date().toISOString().split("T")[0],
    dueDate: deadline.targetDate,
    description: `SLA "${deadline.taskName}" pada milestone ${deadline.milestone} perlu dipantau oleh ${deadline.pic}.`,
    assignee: deadline.pic,
    status: "Pending",
    actionType: deadline.status === "Overdue" ? "Eskalasi" : "Follow Up",
  };
}

// ─── REDUCER ────────────────────────────────────────────────────────────────

function procurementReducer(state: ProcurementState, action: ProcurementAction): ProcurementState {
  switch (action.type) {

    // Moving a request to a new Kanban stage also adds a system notification
    case "ADD_REQUEST": {
      return {
        ...state,
        requests: [action.request, ...state.requests],
        history: [historyItem(action.request.id, "Pekerjaan", "Pekerjaan dibuat", `${action.request.title} ditambahkan ke tracker.`), ...state.history],
      };
    }

    case "MOVE_REQUEST": {
      const request = state.requests.find(r => r.id === action.id);
      if (!request) return state;

      const notification: NotificationItem = {
        id: `NOTIF-${Date.now()}`,
        requestId: action.id,
        title: `Status Diperbarui: ${request.id}`,
        description: `${request.title} telah dipindahkan dari tahap "${request.stage}" ke "${action.stage}".`,
        time: "Baru saja",
        isRead: false,
        type: "success",
        category: "Hari Ini",
      };

      return {
        ...state,
        requests: state.requests.map(r =>
          r.id === action.id
            ? { ...r, stage: action.stage, updatedAt: new Date().toISOString().split("T")[0] }
            : r
        ),
        notifications: [notification, ...state.notifications],
      };
    }

    case "UPDATE_REQUEST_OPERATIONAL_STATUS": {
      const request = state.requests.find(r => r.id === action.id);
      if (!request) return state;

      return {
        ...state,
        requests: state.requests.map(r => r.id === action.id
          ? { ...r, operationalStatus: action.status, operationalStatusReason: action.reason, updatedAt: new Date().toISOString().split("T")[0] }
          : r
        ),
        history: [historyItem(action.id, "Pekerjaan", "Status pekerjaan diperbarui", `Status diubah menjadi ${action.status}${action.reason ? `: ${action.reason}` : "."}`), ...state.history],
        notifications: [{
          id: `NOTIF-${Date.now()}`,
          requestId: action.id,
          title: `Status Pekerjaan Diperbarui: ${request.id}`,
          description: `${request.title} sekarang berstatus ${action.status}.`,
          time: "Baru saja",
          isRead: false,
          type: "success",
          category: "Hari Ini",
        }, ...state.notifications],
      };
    }

    case "MOVE_REQUEST_STEP": {
      const request = state.requests.find(r => r.id === action.id);
      if (!request) return state;

      const notification: NotificationItem = {
        id: `NOTIF-${Date.now()}`,
        requestId: action.id,
        title: `Tahap Procurement Diperbarui: ${request.id}`,
        description: `${request.title} sekarang berada pada tahap "${action.step}".`,
        time: "Baru saja",
        isRead: false,
        type: "success",
        category: "Hari Ini",
      };

      return {
        ...state,
        requests: state.requests.map(r => r.id === action.id
          ? { ...r, stage: stageForStep[action.step], currentStep: action.step, updatedAt: new Date().toISOString().split("T")[0] }
          : r
        ),
        milestones: state.milestones.map(m => {
          if (m.requestId !== action.id) return m;
          const currentIndex = Object.keys(stageForStep).indexOf(action.step);
          const milestoneIndex = Object.keys(stageForStep).indexOf(m.step);
          return {
            ...m,
            status: milestoneIndex < currentIndex ? "Done" : milestoneIndex === currentIndex ? "In Progress" : "Pending",
            date: milestoneIndex <= currentIndex ? new Date().toISOString().split("T")[0] : m.date,
          };
        }),
        notifications: [notification, ...state.notifications],
        history: [historyItem(action.id, "Timeline", "Tahap timeline diperbarui", `Tahap aktif diubah menjadi ${action.step}.`), ...state.history],
      };
    }

    case "ADD_DOCUMENT": {
      // When a new document is uploaded, also auto-create an action for review
      const request = state.requests.find(r => r.id === action.document.requestId);
      const newAction: ActionItem = {
        id: `ACT-${Date.now()}`,
        requestId: action.document.requestId,
        referenceId: action.document.id,
        title: `Review Dokumen Baru: ${action.document.name}`,
        source: "Dokumen",
        priority: "Medium",
        dateAdded: new Date().toISOString().split("T")[0],
        dueDate: new Date(Date.now() + 3 * 86400000).toISOString().split("T")[0],
        description: `Dokumen "${action.document.name}" baru diunggah untuk ${request?.title ?? action.document.requestId}. Segera lakukan pemeriksaan kelengkapan dan verifikasi.`,
        assignee: action.document.pic,
        status: "Pending",
        actionType: "Review",
      };
      const newNotif: NotificationItem = {
        id: `NOTIF-${Date.now()}`,
        requestId: action.document.requestId,
        title: `Dokumen Baru Diupload: ${action.document.name}`,
        description: `File baru untuk ${request?.title ?? action.document.requestId} telah diunggah dan menunggu pemeriksaan.`,
        time: "Baru saja",
        isRead: false,
        type: "document",
        category: "Hari Ini",
      };
      return {
        ...state,
        documents: [action.document, ...state.documents],
        milestones: action.document.procurementStep
          ? state.milestones.map(m => m.requestId === action.document.requestId && m.step === action.document.procurementStep
            ? { ...m, documentId: action.document.id }
            : m
          )
          : state.milestones,
        actions: [newAction, ...state.actions],
        notifications: [newNotif, ...state.notifications],
        history: [historyItem(action.document.requestId, "Dokumen", "Dokumen ditambahkan", `${action.document.name} ditambahkan untuk pemeriksaan.`), ...state.history],
      };
    }

    case "UPDATE_DOCUMENT_STATUS": {
      const doc = state.documents.find(d => d.id === action.id);
      if (!doc) return state;
      const request = state.requests.find(r => r.id === doc.requestId);
      const isPass = action.status === "Lulus Verifikasi";
      const newNotif: NotificationItem = {
        id: `NOTIF-${Date.now()}`,
        requestId: doc.requestId,
        title: isPass
          ? `Dokumen Lulus Verifikasi: ${doc.name}`
          : `Catatan pada Dokumen: ${doc.name}`,
        description: isPass
          ? `"${doc.name}" untuk ${request?.title ?? doc.requestId} telah divalidasi dan dinyatakan lengkap.`
          : `"${doc.name}" untuk ${request?.title ?? doc.requestId} memerlukan tindak lanjut.`,
        time: "Baru saja",
        isRead: false,
        type: isPass ? "success" : "alert",
        category: "Hari Ini",
      };
      return {
        ...state,
        documents: state.documents.map(d =>
          d.id === action.id ? { ...d, status: action.status } : d
        ),
        // Integritas Data: Jika dokumen Lulus, tutup otomatis task yang berkaitan dengan dokumen ini
        actions: state.actions.map(a => 
          (a.referenceId === action.id && isPass) ? { ...a, status: "Done" } : a
        ),
        notifications: [newNotif, ...state.notifications],
        history: [historyItem(doc.requestId, "Dokumen", "Status dokumen diperbarui", `${doc.name} diubah menjadi ${action.status}.`), ...state.history],
      };
    }

    case "ADD_GUARANTEE": {
      const request = state.requests.find(r => r.id === action.guarantee.requestId);
      const newAction = actionForGuarantee(action.guarantee);
      const newNotif: NotificationItem = {
        id: `NOTIF-${Date.now()}`,
        requestId: action.guarantee.requestId,
        title: `Jaminan Baru Ditambahkan: ${action.guarantee.referenceNo}`,
        description: `${action.guarantee.type} dari ${action.guarantee.vendor} telah berhasil diregistrasi untuk ${request?.title ?? action.guarantee.requestId}.`,
        time: "Baru saja",
        isRead: false,
        type: "success",
        category: "Hari Ini",
      };
      return {
        ...state,
        guarantees: [action.guarantee, ...state.guarantees],
        actions: newAction ? [newAction, ...state.actions] : state.actions,
        notifications: [newNotif, ...state.notifications],
        history: [historyItem(action.guarantee.requestId, "Jaminan", "Jaminan ditambahkan", `${action.guarantee.type} ${action.guarantee.referenceNo} ditambahkan.`), ...state.history],
      };
    }

    case "UPDATE_GUARANTEE": {
      const existing = state.guarantees.find(guarantee => guarantee.id === action.id);
      if (!existing) return state;
      const updated = { ...existing, ...action.changes };
      const expiryTime = new Date(`${updated.expiryDate}T23:59:59`).getTime();
      const remainingDays = Number.isNaN(expiryTime) ? 0 : Math.ceil((expiryTime - Date.now()) / 86400000);
      const status: GuaranteeItem["status"] = remainingDays < 0 ? "Expired" : remainingDays <= state.settings.slaWarningDays ? "Mendekati Expiry" : "Aktif";
      return {
        ...state,
        guarantees: state.guarantees.map(guarantee => guarantee.id === action.id ? { ...updated, remainingDays, status } : guarantee),
        history: [historyItem(updated.requestId, "Jaminan", "Data jaminan dikoreksi", `${updated.referenceNo} diperbarui melalui koreksi manual hasil ekstraksi.`), ...state.history],
      };
    }

    case "ADD_ATTACHMENT":
      return { ...state, attachments: [action.attachment, ...state.attachments], history: [historyItem(action.attachment.requestId, "Dokumen", "Dokumen pendukung ditambahkan", `${action.attachment.fileName} disimpan tanpa ekstraksi.`), ...state.history] };

    case "ADD_DEADLINE": {
      const timing = getDeadlineTiming(action.deadline.targetDate, state.settings.slaWarningDays, action.deadline.status);
      const deadline = { ...action.deadline, ...timing };
      const newAction = actionForDeadline(deadline);
      return {
        ...state,
        deadlines: [deadline, ...state.deadlines],
        actions: newAction ? [newAction, ...state.actions] : state.actions,
        history: [historyItem(deadline.requestId, "SLA", "SLA ditambahkan", `${deadline.taskName} ditetapkan hingga ${deadline.targetDate}.`), ...state.history],
      };
    }

    case "UPDATE_DEADLINE": {
      const existing = state.deadlines.find(d => d.id === action.id);
      if (!existing) return state;
      const updated = { ...existing, ...action.changes };
      const timing = getDeadlineTiming(updated.targetDate, state.settings.slaWarningDays, updated.status);
      return {
        ...state,
        deadlines: state.deadlines.map(d => d.id === action.id ? { ...updated, ...timing } : d),
        history: [historyItem(updated.requestId, "SLA", "SLA diperbarui", `${updated.taskName} diperbarui; target ${updated.targetDate}.`), ...state.history],
      };
    }

    case "UPDATE_DEADLINE_STATUS": {
      const dl = state.deadlines.find(d => d.id === action.id);
      if (!dl) return state;
      const isDone = action.status === "Selesai";
      let newNotif: NotificationItem | null = null;
      if (isDone) {
        const request = state.requests.find(r => r.id === dl.requestId);
        newNotif = {
          id: `NOTIF-${Date.now()}`,
          requestId: dl.requestId,
          title: `Deadline Selesai: ${dl.taskName}`,
          description: `Tugas "${dl.taskName}" untuk ${request?.title ?? dl.requestId} telah ditandai selesai oleh ${dl.pic}.`,
          time: "Baru saja",
          isRead: false,
          type: "success",
          category: "Hari Ini",
        };
      }
      return {
        ...state,
        // Bugfix: deadline sebelumnya dihapus dari list saat selesai, kini hanya diganti statusnya
        deadlines: state.deadlines.map(d =>
          d.id === action.id ? { ...d, status: action.status as any } : d
        ),
        // Integritas Data: Jika SLA selesai, tutup tindakan (Next Action) yang bergantung ke SLA ini
        actions: state.actions.map(a => 
          (a.referenceId === action.id && isDone) ? { ...a, status: "Done" } : a
        ),
        notifications: newNotif ? [newNotif, ...state.notifications] : state.notifications,
      };
    }

    case "UPDATE_ACTION_STATUS": {
      const act = state.actions.find(a => a.id === action.id);
      if (!act) return state;
      const isDone = action.status === "Done";
      let newNotif: NotificationItem | null = null;
      if (isDone) {
        newNotif = {
          id: `NOTIF-${Date.now()}`,
          requestId: act.requestId || "",
          title: `Tindakan Selesai: ${act.title}`,
          description: `${act.assignee} telah menyelesaikan "${act.title}".`,
          time: "Baru saja",
          isRead: false,
          type: "success",
          category: "Hari Ini",
        };
      }
      return {
        ...state,
        actions: state.actions.map(a =>
          a.id === action.id ? { ...a, status: action.status } : a
        ),
        // Integritas Data: Jika action selesai dan itu milik Deadline (SLA), tandai SLA tersebut selesai
        deadlines: state.deadlines.map(d => 
          (d.id === act.referenceId && isDone) ? { ...d, status: "Selesai" as any } : d
        ),
        notifications: newNotif ? [newNotif, ...state.notifications] : state.notifications,
      };
    }

    case "ADD_ACTION":
      return { ...state, actions: [action.action, ...state.actions] };

    case "MARK_NOTIFICATION_READ":
      return {
        ...state,
        notifications: state.notifications.map(n =>
          n.id === action.id ? { ...n, isRead: true } : n
        ),
      };

    case "MARK_ALL_READ":
      return {
        ...state,
        notifications: state.notifications.map(n => ({ ...n, isRead: true })),
      };

    case "ADD_NOTIFICATION":
      return { ...state, notifications: [action.notification, ...state.notifications] };

    case "UPDATE_SETTINGS":
      return {
        ...state,
        settings: { ...state.settings, ...action.settings },
      };

    default:
      return state;
  }
}

// ─── CONTEXT ────────────────────────────────────────────────────────────────

interface ProcurementContextValue {
  state: ProcurementState;
  dispatch: React.Dispatch<ProcurementAction>;
  // Convenience helpers
  addRequest: (request: ProcurementRequest) => void;
  moveRequest: (id: string, stage: ProcurementStage) => void;
  updateRequestOperationalStatus: (id: string, status: ProcurementOperationalStatus, reason?: string) => void;
  moveRequestStep: (id: string, step: ProcurementStep) => void;
  addDocument: (doc: DocumentItem) => void;
  updateDocumentStatus: (id: string, status: DocumentItem["status"]) => void;
  addGuarantee: (guarantee: GuaranteeItem) => void;
  updateGuarantee: (id: string, changes: Partial<GuaranteeItem>) => void;
  addAttachment: (attachment: ProcurementAttachment) => void;
  addDeadline: (deadline: DeadlineItem) => void;
  updateDeadline: (id: string, changes: Partial<DeadlineItem>) => void;
  updateDeadlineStatus: (id: string, status: "On Track" | "At Risk" | "Overdue" | "Selesai") => void;
  updateActionStatus: (id: string, status: ActionItem["status"]) => void;
  markNotificationRead: (id: string) => void;
  markAllRead: () => void;
  updateSettings: (settings: Partial<ProcurementState["settings"]>) => void;
}

const ProcurementContext = createContext<ProcurementContextValue | null>(null);

// ─── PROVIDER ────────────────────────────────────────────────────────────────

export function ProcurementProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(procurementReducer, initialProcurementState);

  const addRequest = useCallback((request: ProcurementRequest) =>
    dispatch({ type: "ADD_REQUEST", request }), []);

  const moveRequest = useCallback((id: string, stage: ProcurementStage) =>
    dispatch({ type: "MOVE_REQUEST", id, stage }), []);

  const updateRequestOperationalStatus = useCallback((id: string, status: ProcurementOperationalStatus, reason?: string) =>
    dispatch({ type: "UPDATE_REQUEST_OPERATIONAL_STATUS", id, status, reason }), []);

  const moveRequestStep = useCallback((id: string, step: ProcurementStep) =>
    dispatch({ type: "MOVE_REQUEST_STEP", id, step }), []);

  const addDocument = useCallback((document: DocumentItem) =>
    dispatch({ type: "ADD_DOCUMENT", document }), []);

  const updateDocumentStatus = useCallback((id: string, status: DocumentItem["status"]) =>
    dispatch({ type: "UPDATE_DOCUMENT_STATUS", id, status }), []);

  const addGuarantee = useCallback((guarantee: GuaranteeItem) =>
    dispatch({ type: "ADD_GUARANTEE", guarantee }), []);

  const updateGuarantee = useCallback((id: string, changes: Partial<GuaranteeItem>) =>
    dispatch({ type: "UPDATE_GUARANTEE", id, changes }), []);

  const addAttachment = useCallback((attachment: ProcurementAttachment) =>
    dispatch({ type: "ADD_ATTACHMENT", attachment }), []);

  const addDeadline = useCallback((deadline: DeadlineItem) =>
    dispatch({ type: "ADD_DEADLINE", deadline }), []);

  const updateDeadline = useCallback((id: string, changes: Partial<DeadlineItem>) =>
    dispatch({ type: "UPDATE_DEADLINE", id, changes }), []);

  const updateDeadlineStatus = useCallback((id: string, status: "On Track" | "At Risk" | "Overdue" | "Selesai") =>
    dispatch({ type: "UPDATE_DEADLINE_STATUS", id, status }), []);

  const updateActionStatus = useCallback((id: string, status: ActionItem["status"]) =>
    dispatch({ type: "UPDATE_ACTION_STATUS", id, status }), []);

  const markNotificationRead = useCallback((id: string) =>
    dispatch({ type: "MARK_NOTIFICATION_READ", id }), []);

  const markAllRead = useCallback(() =>
    dispatch({ type: "MARK_ALL_READ" }), []);

  const updateSettings = useCallback((settings: Partial<ProcurementState["settings"]>) =>
    dispatch({ type: "UPDATE_SETTINGS", settings }), []);

  return (
    <ProcurementContext.Provider value={{
      state, dispatch,
      addRequest, moveRequest, updateRequestOperationalStatus, moveRequestStep, addDocument, updateDocumentStatus,
      addGuarantee, updateGuarantee, addAttachment, addDeadline, updateDeadline, updateDeadlineStatus, updateActionStatus,
      markNotificationRead, markAllRead, updateSettings,
    }}>
      {children}
    </ProcurementContext.Provider>
  );
}

// ─── HOOK ────────────────────────────────────────────────────────────────────

export function useProcurement() {
  const ctx = useContext(ProcurementContext);
  if (!ctx) throw new Error("useProcurement must be used inside ProcurementProvider");
  return ctx;
}
