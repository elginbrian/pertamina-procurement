"use client";

import React, { createContext, useContext, useReducer, useCallback } from "react";
import type { ProcurementState, ProcurementStage, ProcurementRequest, DocumentItem, GuaranteeItem, ActionItem, NotificationItem, DeadlineItem } from "@/lib/types";
import { initialProcurementState } from "@/lib/mockData";

// ─── ACTIONS ────────────────────────────────────────────────────────────────

type ProcurementAction =
  // Tracker
  | { type: "ADD_REQUEST"; request: ProcurementRequest }
  | { type: "MOVE_REQUEST"; id: string; stage: ProcurementStage }
  // D1 Documents
  | { type: "ADD_DOCUMENT"; document: DocumentItem }
  | { type: "UPDATE_DOCUMENT_STATUS"; id: string; status: DocumentItem["status"] }
  // D2 Guarantees
  | { type: "ADD_GUARANTEE"; guarantee: GuaranteeItem }
  // D4 Deadlines
  | { type: "ADD_DEADLINE"; deadline: DeadlineItem }
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

// ─── REDUCER ────────────────────────────────────────────────────────────────

function procurementReducer(state: ProcurementState, action: ProcurementAction): ProcurementState {
  switch (action.type) {

    // Moving a request to a new Kanban stage also adds a system notification
    case "ADD_REQUEST": {
      return {
        ...state,
        requests: [action.request, ...state.requests],
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
        actions: [newAction, ...state.actions],
        notifications: [newNotif, ...state.notifications],
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
      };
    }

    case "ADD_GUARANTEE": {
      const request = state.requests.find(r => r.id === action.guarantee.requestId);
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
        notifications: [newNotif, ...state.notifications],
      };
    }

    case "ADD_DEADLINE":
      return {
        ...state,
        deadlines: [action.deadline, ...state.deadlines],
      };

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
  addDocument: (doc: DocumentItem) => void;
  updateDocumentStatus: (id: string, status: DocumentItem["status"]) => void;
  addGuarantee: (guarantee: GuaranteeItem) => void;
  addDeadline: (deadline: DeadlineItem) => void;
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

  const addDocument = useCallback((document: DocumentItem) =>
    dispatch({ type: "ADD_DOCUMENT", document }), []);

  const updateDocumentStatus = useCallback((id: string, status: DocumentItem["status"]) =>
    dispatch({ type: "UPDATE_DOCUMENT_STATUS", id, status }), []);

  const addGuarantee = useCallback((guarantee: GuaranteeItem) =>
    dispatch({ type: "ADD_GUARANTEE", guarantee }), []);

  const addDeadline = useCallback((deadline: DeadlineItem) =>
    dispatch({ type: "ADD_DEADLINE", deadline }), []);

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
      addRequest, moveRequest, addDocument, updateDocumentStatus,
      addGuarantee, addDeadline, updateDeadlineStatus, updateActionStatus,
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
