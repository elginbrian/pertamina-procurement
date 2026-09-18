import { redirect } from "next/navigation";

export default async function TabPage({ params }: { params: Promise<{ tab: string }> }) {
  const { tab } = await params;
  redirect(`/dashboard/${tab}`);
}
