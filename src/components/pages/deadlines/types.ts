export type DeadlineStatus = "On Track" | "At Risk" | "Overdue";

export interface DeadlineItem {
  id: string;
  taskName: string;
  relatedId: string; // e.g. REQ-2026-101
  pic: string;
  department: string;
  targetDate: string; // YYYY-MM-DD
  daysRemaining: number;
  status: DeadlineStatus;
  urgencyLevel: "Low" | "Medium" | "High" | "Critical";
  milestone: string;
  nextAction: string;
}
