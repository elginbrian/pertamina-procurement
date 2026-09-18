import { DashboardShell } from "@/components/layout/DashboardShell";

export default async function DashboardPage({ params }: { params: Promise<{ tab: string[] }> }) {
  const { tab } = await params;

  return <DashboardShell routeSegments={tab} />;
}
