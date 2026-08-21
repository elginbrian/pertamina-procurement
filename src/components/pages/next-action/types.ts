export type ActionPriority = "High" | "Medium" | "Low";
export type ActionSource = "Dokumen" | "Jaminan" | "SLA/Jatuh Tempo" | "Proses Pengadaan";

export interface ActionItem {
  id: string;
  referenceId: string; // e.g. REQ-2026-101 or DOC-001
  title: string;
  source: ActionSource;
  priority: ActionPriority;
  dateAdded: string; // YYYY-MM-DD
  dueDate: string; // YYYY-MM-DD
  description: string;
  assignee: string;
  status: "Pending" | "In Progress" | "Completed";
  actionType: "Review" | "Approval" | "Follow Up" | "Upload";
}
