export type DocumentStatus = "Ready" | "Needs Attention" | "Not Ready";

export type DocumentItem = {
  id: string;
  name: string;
  type: string;
  status: DocumentStatus;
  uploadDate: string;
  pic: string;
  issues: string[];
  nextAction?: string;
  canGenerateAiDraft?: boolean;
};
