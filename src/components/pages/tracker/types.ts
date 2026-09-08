import type { ProcurementStage, ProcurementStep } from "@/lib/types";

export type TrackerStage = ProcurementStage;

export interface TrackerItem {
  id: string;
  title: string;
  pic: string;
  amount: string;
  stage: TrackerStage;
  currentStep: ProcurementStep;
  department: string;
  daysInStage: number;
  isUrgent?: boolean;
}
