/**
 * ============================================================
 * PERTAMINA PROCUREMENT DASHBOARD - Centralized Mock Data
 * Referensi: PPT Checklist Pra Tender, Proposal, Prosedur Input
 *
 * Semua data saling terhubung melalui requestId (FK ke ProcurementRequest).
 * Ketika request berpindah stage di Tracker, status dokumen, jaminan, dan SLA ikut mencerminkan
 * konteks yang relevan.
 * ============================================================
 */

import type {
  ProcurementState,
  ProcurementStep,
  ProcurementMilestone,
  ProcurementRequest,
  DocumentItem,
  GuaranteeItem,
  ProcurementAttachment,
  DeadlineItem,
  ActionItem,
  NotificationItem,
  HistoryItem,
} from "@/types";

import mockRequestsRaw from "../data/mock/requests.json";
import mockDocumentsRaw from "../data/mock/documents.json";
import mockGuaranteesRaw from "../data/mock/guarantees.json";
import mockDeadlinesRaw from "../data/mock/deadlines.json";
import mockActionsRaw from "../data/mock/actions.json";
import mockNotificationsRaw from "../data/mock/notifications.json";

// Type assertions for JSON imports to match our strict types
const mockRequests = mockRequestsRaw as ProcurementRequest[];
const mockDocuments = mockDocumentsRaw as DocumentItem[];
const mockGuarantees = mockGuaranteesRaw as GuaranteeItem[];
const mockDeadlines = mockDeadlinesRaw as DeadlineItem[];
const mockActions = mockActionsRaw as ActionItem[];
const mockNotifications = mockNotificationsRaw as NotificationItem[];

const procurementSteps: ProcurementStep[] = [
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

const mockMilestones: ProcurementMilestone[] = mockRequests.flatMap(request => {
  const currentIndex = procurementSteps.indexOf(request.currentStep);
  return procurementSteps.map((step, index) => ({
    id: `${request.id}-${String(index + 1).padStart(2, "0")}`,
    requestId: request.id,
    step,
    status: index < currentIndex ? "Done" : index === currentIndex ? "In Progress" : "Pending",
    date: index <= currentIndex ? request.updatedAt : undefined,
    pic: request.pic,
  }));
});

const mockAttachments: ProcurementAttachment[] = [];

const mockHistory: HistoryItem[] = [];

// ─── INITIAL STATE (Single Source of Truth) ────────────────────────────────
export const initialProcurementState: ProcurementState = {
  requests: mockRequests,
  milestones: mockMilestones,
  documents: mockDocuments,
  guarantees: mockGuarantees,
  attachments: mockAttachments,
  deadlines: mockDeadlines,
  actions: mockActions,
  notifications: mockNotifications,
  history: mockHistory,
  settings: {
    emailNotifications: true,
    whatsappNotifications: false,
    slaWarningDays: 3,
    autoEscalation: true,
    aiSensitivity: "High",
    theme: "Light",
  }
};
