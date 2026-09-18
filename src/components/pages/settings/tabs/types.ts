import { User } from "@/types";

export interface SettingsTabProps {
  formData: any;
  handleChange: (key: string, value: any) => void;
  users?: User[];
}
