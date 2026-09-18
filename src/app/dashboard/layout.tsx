import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ReactNode } from "react";

export default function Layout({ children }: Readonly<{ children: ReactNode }>) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
