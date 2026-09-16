import type { ProcurementOperationalStatus, ProcurementStage, ProcurementStep } from "@/lib/types";

export type TrackerStage = ProcurementOperationalStatus;

export interface TrackerItem {
  id: string;
  title: string;
  pic: string;
  amount: string;
  stage: ProcurementStage;
  operationalStatus: ProcurementOperationalStatus;
  currentStep: ProcurementStep;
  department: string;
  daysInStage: number;
  isUrgent?: boolean;
}
