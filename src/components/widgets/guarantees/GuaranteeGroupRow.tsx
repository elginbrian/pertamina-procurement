import { useState } from "react";
import { ChevronDown, ChevronRight, FileText, Folder, Eye, XCircle } from "lucide-react";
import type { GuaranteeItem, ProcurementRequest } from "@/lib/types";

interface GuaranteeGroupRowProps {
  request: ProcurementRequest;
  guarantees: GuaranteeItem[];
  onEdit: (guarantee: GuaranteeItem) => void;
}

function statusClass(status: GuaranteeItem["status"]) {
  if (status === "Aktif") return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (status === "Expired") return "bg-red-50 text-red-700 border-red-200";
  return "bg-blue-50 text-[#0a4d8c] border-blue-200";
}

export function GuaranteeGroupRow({ request, guarantees, onEdit }: GuaranteeGroupRowProps) {
  const [expanded, setExpanded] = useState(false);
  const [expandedGuaranteeId, setExpandedGuaranteeId] = useState<string | null>(null);
  const [previewingGuaranteeId, setPreviewingGuaranteeId] = useState<string | null>(null);
  const expiredCount = guarantees.filter(guarantee => guarantee.status === "Expired").length;
  const attentionCount = guarantees.filter(guarantee => guarantee.status === "Mendekati Expiry").length;
  const latestExpiry = guarantees.reduce((latest, guarantee) => guarantee.expiryDate < latest ? guarantee.expiryDate : latest, guarantees[0]?.expiryDate || "-");

  return (
    <>
      <tr
        onClick={() => setExpanded(value => !value)}
        className={`cursor-pointer transition-colors hover:bg-blue-50/40 ${expanded ? "bg-blue-50/30" : ""}`}
      >
        <td className="px-4 py-4">
          <div className="flex items-start gap-3">
            <div className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${expanded ? "bg-[#0a4d8c] text-white" : "bg-blue-50 text-[#0a4d8c]"}`}>
              <Folder size={18} />
            </div>
            <div className="min-w-0">
              <div className="text-[13px] font-medium text-slate-800">{request.title}</div>
              <div className="mt-1 text-[11px] text-slate-500">{request.id} · {request.department} · {request.pic}</div>
            </div>
          </div>
        </td>
        <td className="px-4 py-4 text-sm font-semibold text-slate-700">{guarantees.length} jaminan</td>
        <td className="px-4 py-4 text-sm text-slate-600">{guarantees.map(guarantee => guarantee.value).join(" · ")}</td>
        <td className="px-4 py-4 text-sm font-medium text-slate-700">{latestExpiry}</td>
        <td className="px-4 py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex flex-wrap gap-1.5">
              {expiredCount > 0 && <span className="rounded-full border border-red-200 bg-red-50 px-2 py-0.5 text-[11px] font-semibold text-red-700">{expiredCount} expired</span>}
              {attentionCount > 0 && <span className="rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-[#0a4d8c]">{attentionCount} mendekati</span>}
              {expiredCount === 0 && attentionCount === 0 && <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">Aman</span>}
            </div>
            {expanded ? <ChevronDown className="shrink-0 text-slate-400" size={18} /> : <ChevronRight className="shrink-0 text-slate-400" size={18} />}
          </div>
        </td>
      </tr>
      {expanded && (
        <tr>
          <td colSpan={5} className="border-b border-slate-200 bg-slate-50/70 p-0">
            <div className="space-y-2 px-5 py-4 sm:px-16">
              {guarantees.map(guarantee => (
                <div key={guarantee.id}>
                  <button onClick={() => setExpandedGuaranteeId(current => current === guarantee.id ? null : guarantee.id)} className="flex w-full flex-col gap-3 rounded-lg border border-slate-200 bg-white p-3 text-left transition hover:border-[#0a4d8c]/40 hover:bg-blue-50/40 sm:flex-row sm:items-center">
                    <FileText className="shrink-0 text-slate-400" size={17} />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[12px] font-medium text-slate-800">{guarantee.referenceNo} · {guarantee.type}</div>
                      <div className="mt-1 text-[11px] text-slate-500">{guarantee.vendor} · {guarantee.issuer} · Terbit {guarantee.issueDate} · Expiry {guarantee.expiryDate}</div>
                    </div>
                    <div className="text-sm font-medium text-slate-700">{guarantee.value}</div>
                    <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${statusClass(guarantee.status)}`}>{guarantee.status}</span>
                    {expandedGuaranteeId === guarantee.id ? <ChevronDown className="shrink-0 text-slate-400" size={16} /> : <ChevronRight className="shrink-0 text-slate-400" size={16} />}
                  </button>
                  {expandedGuaranteeId === guarantee.id && (
                    <div className="border-x border-b border-slate-200 bg-slate-50 px-4 py-3 sm:px-12">
                      <div className="grid grid-cols-1 gap-3 text-xs text-slate-600 sm:grid-cols-3">
                        <div><div className="font-bold uppercase tracking-wider text-[10px] text-slate-400">Referensi</div><div className="mt-1">{guarantee.referenceNo}</div></div>
                        <div><div className="font-bold uppercase tracking-wider text-[10px] text-slate-400">PIC</div><div className="mt-1">{guarantee.pic}</div></div>
                        <div><div className="font-bold uppercase tracking-wider text-[10px] text-slate-400">Hari tersisa</div><div className="mt-1">{guarantee.remainingDays < 0 ? `Terlewat ${Math.abs(guarantee.remainingDays)} hari` : `${guarantee.remainingDays} hari lagi`}</div></div>
                        <div><div className="font-bold uppercase tracking-wider text-[10px] text-slate-400">Penerbit</div><div className="mt-1">{guarantee.issuerType ? `${guarantee.issuerType} · ` : ""}{guarantee.issuer}</div></div>
                        <div className="sm:col-span-2"><div className="font-bold uppercase tracking-wider text-[10px] text-slate-400">Penerima jaminan</div><div className="mt-1">{guarantee.beneficiary || "Belum diisi"}</div></div>
                      </div>
                      {guarantee.nextAction && <div className="mt-3 text-xs text-slate-600"><span className="font-semibold text-[#0a4d8c]">Next Action:</span> {guarantee.nextAction}</div>}
                      <button type="button" onClick={() => onEdit(guarantee)} className="mt-3 rounded-md border border-blue-200 bg-blue-50 px-2.5 py-1.5 text-xs font-semibold text-[#0a4d8c] hover:bg-blue-100">Koreksi Data Ekstraksi</button>
                      {guarantee.fileName && <button type="button" onClick={() => setPreviewingGuaranteeId(guarantee.id)} className="ml-2 mt-3 inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:border-[#0a4d8c] hover:text-[#0a4d8c]"><Eye size={13} /> Lihat Dokumen Asli</button>}
                      {previewingGuaranteeId === guarantee.id && <div className="mt-4 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm"><div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-3 py-2"><div className="flex min-w-0 items-center gap-2"><FileText size={15} className="shrink-0 text-[#0a4d8c]" /><span className="truncate text-xs font-semibold text-slate-700">{guarantee.fileName}</span></div><button type="button" onClick={() => setPreviewingGuaranteeId(null)} aria-label="Tutup preview dokumen" className="text-slate-400 hover:text-slate-700"><XCircle size={16} /></button></div><div className="relative h-52 overflow-hidden bg-slate-100 p-5"><div className="mx-auto flex h-full max-w-md flex-col bg-white p-5 shadow-sm"><div className="mx-auto h-3 w-1/2 rounded bg-slate-200" /><div className="mt-5 h-2 w-full rounded bg-slate-100" /><div className="mt-2 h-2 w-5/6 rounded bg-slate-100" /><div className="mt-2 h-2 w-full rounded bg-slate-100" /><div className="mt-5 rounded border border-blue-100 bg-blue-50/50 p-3"><div className="h-2 w-1/3 rounded bg-blue-200" /><div className="mt-2 h-2 w-3/4 rounded bg-blue-100" /></div><div className="mt-auto text-center text-[10px] text-slate-400">Preview mock dokumen jaminan</div></div></div><div className="border-t border-slate-100 px-3 py-2 text-[11px] text-slate-500">Dokumen asli tersimpan sebagai metadata pada mockup ini; preview file nyata memerlukan penyimpanan file/backend.</div></div>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
