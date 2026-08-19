import type { ReactNode } from "react";

export function PanelHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-4 mt-4 flex items-center justify-between gap-4">
      <div>
        <h2 className="text-base font-bold text-slate-800 sm:text-lg">{title}</h2>
        <p className="text-xs text-slate-500">{subtitle}</p>
      </div>
      {action}
    </div>
  );
}
