import { BaseUser, Department } from "./core";

export type UserRole = "Super Admin" | "Procurement Manager" | "Procurement Officer" | "Reviewer" | "Vendor";
export type UserStatus = "Active" | "Inactive" | "Suspended";

export interface User extends BaseUser {
  email: string;
  phone?: string;
  role: UserRole;
  department?: Department;
  status: UserStatus;
  avatarUrl?: string;
  lastLogin?: string;
  createdAt: string;
}
