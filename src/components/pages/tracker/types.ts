export type TrackerStage = "PR" | "CS30" | "PO" | "DONE";

export interface TrackerItem {
  id: string;
  title: string;
  pic: string;
  amount: string;
  stage: TrackerStage;
  department: string;
  daysInStage: number;
  isUrgent?: boolean;
}
