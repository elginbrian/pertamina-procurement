export type TrackerStage = "Persiapan" | "Sourcing" | "Evaluasi" | "Contracting" | "Selesai";

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
