import DocumentResultPage from "@/components/pages/documents/DocumentResultPage";
import { Suspense } from "react";

export default function DocumentResultRoute() {
  return (
    <Suspense fallback={<div className="rounded-xl border border-slate-200 bg-white p-8 text-sm text-slate-500">Memuat hasil pemeriksaan...</div>}>
      <DocumentResultPage />
    </Suspense>
  );
}
