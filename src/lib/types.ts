/**
 * ============================================================
 * PERTAMINA PROCUREMENT DASHBOARD - Centralized Type Definitions
 * Referensi: PPT Checklist Pra Tender, Proposal, Prosedur Input
 * ============================================================
 */

// ─── DOMAIN: PROCUREMENT REQUEST (Entitas Utama) ───────────────────────────

/** Tahapan Kanban sesuai alur Procurement Pertamina */
export type ProcurementStage =
  | "Persiapan"    // Fase I: Persiapan DP3 oleh FPP
  | "Sourcing"     // Fase II/III: Pemeriksaan & Rapat Pra-Tender
  | "Evaluasi"     // Evaluasi Teknis & Komersial
  | "Contracting"  // Contracting / Pembuatan PO
  | "Selesai";     // Kontrak ditandatangani, PO diterbitkan

/** Status operasional pekerjaan, terpisah dari tahap proses procurement. */
export type ProcurementOperationalStatus = "On Going" | "On Hold" | "Batal";

/** Tahapan Berita Acara dan deliverable utama pada proses pemilihan. */
export type ProcurementStep =
  | "Rapat Pra-Tender"
  | "Pengumuman Pengadaan"
  | "Prebid Meeting"
  | "Pemasukan Dokumen Penawaran"
  | "Pembukaan Penawaran"
  | "Evaluasi Dokumen Penawaran"
  | "Sosialisasi e-Auction"
  | "Negosiasi e-Auction"
  | "Negosiasi Manual"
  | "Laporan Hasil Pemilihan"
  | "Pengumuman Pemenang"
  | "Penunjukan Pemenang";

export type ProcurementMilestoneStatus = "Pending" | "In Progress" | "Done";

export interface ProcurementMilestone {
  id: string;
  requestId: string;
  step: ProcurementStep;
  status: ProcurementMilestoneStatus;
  documentId?: string;
  date?: string;
  pic?: string;
  notes?: string;
}

export interface ProcurementRequest {
  id: string;               // e.g. "REQ-2026-101"
  title: string;            // Judul pengadaan
  pic: string;              // PIC Procurement (P3)
  fpp: string;              // PIC FPP (Fungsi Peminta Pengadaan)
  amount: string;           // Nilai (formatted)
  amountRaw: number;        // Nilai numerik (untuk sorting/filter)
  stage: ProcurementStage;
  operationalStatus: ProcurementOperationalStatus;
  operationalStatusReason?: string;
  currentStep: ProcurementStep;
  department: string;       // Fungsi/Departemen peminta
  daysInStage: number;      // Berapa hari di stage ini
  isUrgent?: boolean;
  createdAt: string;        // ISO date string
  updatedAt: string;        // ISO date string
}

// ─── DOMAIN: D1 - DOKUMEN PRA-TENDER ──────────────────────────────────────

/** Status dokumen berdasarkan hasil review Procurement */
export type DocumentStatus =
  | "Lulus Verifikasi"     // Dokumen lengkap, tidak ada catatan
  | "Catatan Procurement"  // Ada catatan, bisa lanjut tapi perlu perbaikan
  | "Tindak Lanjut FPP";   // Harus dikembalikan ke FPP untuk dilengkapi

/** Tipe dokumen sesuai Checklist Pra-Tender Pertamina */
export type DocumentType =
  | "Wajib"
  | "Kondisional"
  | "Best Practice"
  | "Dokumentasi";

/** Template validasi D1 untuk membandingkan informasi lintas dokumen. */
export type DocumentKind = "Surat Penawaran" | "Surat Pengajuan" | "RKS" | "Pakta Integritas" | "TKDN" | "Lainnya";

export interface DocumentExtractedData {
  workName?: string;
  tenderNumber?: string;
  documentDate?: string;
}

export interface DocumentItem {
  id: string;               // e.g. "DOC-2026-001"
  requestId: string;        // FK → ProcurementRequest.id
  name: string;             // Nama dokumen
  type: DocumentType;
  documentKind?: DocumentKind;
  status: DocumentStatus;
  uploadDate: string;       // ISO date string
  pic: string;              // PIC yang upload
  issues: string[];         // Daftar temuan AI/manual
  nextAction?: string;      // Rekomendasi tindak lanjut
  procurementStep?: ProcurementStep;
  documentDate?: string;
  documentNumber?: string;
  canGenerateAiDraft?: boolean;
  fileName?: string;        // Nama file yang diupload
  fileSize?: number;        // Byte
  extractedData?: DocumentExtractedData;
}

// ─── DOMAIN: D2 - JAMINAN ─────────────────────────────────────────────────

export type GuaranteeStatus =
  | "Aktif"
  | "Mendekati Expiry"
  | "Expired";

export type GuaranteeType =
  | "Jaminan Pelaksanaan"
  | "Jaminan Masa Pemeliharaan"
  | "Jaminan Uang Muka";

export type GuaranteeIssuerType = "Bank" | "Asuransi" | "Lainnya";

export interface GuaranteeItem {
  id: string;               // e.g. "GUAR-001"
  requestId: string;        // FK → ProcurementRequest.id
  referenceNo: string;      // Nomor referensi bank
  type: GuaranteeType;
  value: string;            // Formatted
  valueRaw: number;         // Numerik
  issuer: string;           // Bank / Asuransi penerbit
  issuerType?: GuaranteeIssuerType;
  beneficiary?: string;
  vendor: string;           // Nama vendor / principal
  issueDate: string;
  submissionDate?: string;
  expiryDate: string;
  remainingDays: number;
  pic: string;
  status: GuaranteeStatus;
  nextAction?: string;
  fileName?: string;
  fileSize?: number;
}

/** Dokumen pendukung per pekerjaan yang disimpan tanpa proses ekstraksi OCR. */
export type ProcurementAttachmentType = "Dokumen Jaminan" | "TKDN" | "Dokumen Pendukung Lain";

export interface ProcurementAttachment {
  id: string;
  requestId: string;
  type: ProcurementAttachmentType;
  name: string;
  uploadedAt: string;
  uploadedBy: string;
  fileName: string;
  fileSize?: number;
  notes?: string;
}

// ─── DOMAIN: D4 - DEADLINES / SLA ─────────────────────────────────────────

export type DeadlineStatus = "On Track" | "At Risk" | "Overdue" | "Selesai";
export type UrgencyLevel = "Low" | "Medium" | "High" | "Critical";

export interface DeadlineItem {
  id: string;               // e.g. "DL-001"
  requestId: string;        // FK → ProcurementRequest.id
  relatedId?: string;       // Legacy / alias for requestId
  taskName: string;
  pic: string;
  department: string;
  targetDate: string;
  startDate?: string;
  daysRemaining: number;
  status: DeadlineStatus;
  urgencyLevel: UrgencyLevel;
  milestone: string;        // Fase/milestone terkait
  nextAction?: string;
  overdueReason?: string;
}

// ─── DOMAIN: TINDAKAN (NEXT ACTION) ───────────────────────────────────────

export type ActionPriority = "High" | "Medium" | "Low";
export type ActionSource = "Dokumen" | "Jaminan" | "Proses Pengadaan" | "Deadline" | "Sistem" | "SLA/Jatuh Tempo";
export type ActionStatus = "Pending" | "In Progress" | "Done" | "Cancelled" | "Completed";
export type ActionType = "Approval" | "Upload" | "Follow Up" | "Review" | "Eskalasi";

export interface ActionItem {
  id: string;               // e.g. "ACT-001"
  requestId?: string;       // FK → ProcurementRequest.id (opsional)
  referenceId: string;      // ID dokumen/jaminan/deadline terkait
  title: string;
  source: ActionSource;
  priority: ActionPriority;
  dateAdded: string;
  dueDate: string;
  description: string;
  assignee: string;
  status: ActionStatus;
  actionType: ActionType;
}

// ─── DOMAIN: NOTIFIKASI ───────────────────────────────────────────────────

export type NotificationType = "success" | "alert" | "system" | "document" | "deadline";
export type NotificationCategory = "Hari Ini" | "Kemarin" | "Lebih Lama";

export interface NotificationItem {
  id: string;
  requestId?: string;       // FK → ProcurementRequest.id (opsional)
  title: string;
  description: string;
  time: string;
  isRead: boolean;
  type: NotificationType;
  category: NotificationCategory;
}

export type HistoryCategory = "Pekerjaan" | "Timeline" | "SLA" | "Dokumen" | "Jaminan";

export interface HistoryItem {
  id: string;
  requestId: string;
  category: HistoryCategory;
  title: string;
  description: string;
  createdAt: string;
}

// ─── DOMAIN: PENGATURAN (SETTINGS) ────────────────────────────────────────
export interface SystemSettings {
  emailNotifications: boolean;
  whatsappNotifications: boolean;
  slaWarningDays: number;
  autoEscalation: boolean;
  aiSensitivity: "Low" | "Medium" | "High";
  theme: "Light" | "Dark" | "System";
}

// ─── GLOBAL STORE STATE ────────────────────────────────────────────────────

export interface ProcurementState {
  requests: ProcurementRequest[];
  milestones: ProcurementMilestone[];
  documents: DocumentItem[];
  guarantees: GuaranteeItem[];
  attachments: ProcurementAttachment[];
  deadlines: DeadlineItem[];
  actions: ActionItem[];
  notifications: NotificationItem[];
  history: HistoryItem[];
  settings: SystemSettings;
}
