export type GuaranteeStatus = "Aktif" | "Mendekati Expiry" | "Expired";

export type GuaranteeItem = {
  id: string;
  referenceNo: string;
  type: string;
  value: string;
  issueDate: string;
  expiryDate: string;
  remainingDays: number;
  pic: string;
  status: GuaranteeStatus;
  nextAction?: string;
};
