import { Menu, X, UserCircle2, Settings, LogOut } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function DashboardHeader({
  title,
  subtitle,
  userLabel,
  onOpenSidebar,
  onCloseSidebar,
}: {
  title: string;
  subtitle: string;
  userLabel: string;
  onOpenSidebar?: () => void;
  onCloseSidebar?: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="flex h-[92px] items-center justify-between gap-3 border-b border-slate-200 bg-white px-5 py-3 sm:px-7">
      <div className="lg:hidden">
        <button
          type="button"
          aria-label="Open navigation"
          className="flex h-9 w-9 items-center justify-center rounded-[12px] border border-slate-200 bg-white text-slate-700"
          onClick={onOpenSidebar}
        >
          <Menu size={16} />
        </button>
      </div>

      <div className="hidden lg:hidden">
        <button
          type="button"
          aria-label="Close navigation"
          className="flex h-9 w-9 items-center justify-center rounded-[12px] border border-slate-200 bg-white text-slate-700"
          onClick={onCloseSidebar}
        >
          <X size={16} />
        </button>
      </div>

      <div className="min-w-0 flex-1">
        <h1 className="text-[1.35rem] font-bold leading-tight tracking-[-0.03em] text-slate-800 sm:text-[1.6rem]">{title}</h1>
        <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>
      </div>

      <div ref={menuRef} className="relative flex items-center justify-center">
        <button
          type="button"
          aria-label="User profile"
          aria-expanded={menuOpen}
          aria-haspopup="menu"
          onClick={() => setMenuOpen((open) => !open)}
          className="flex items-center rounded-full border border-slate-200 bg-white p-1 shadow-sm transition hover:border-[#0a4d8c]/30 hover:shadow-md"
        >
          <div className="grid h-9 w-9 place-items-center rounded-full border border-slate-200 bg-[#edf5ff] text-[0.68rem] font-bold text-[#0a4d8c]">
            {userLabel}
          </div>
        </button>

        {menuOpen && (
          <div className="absolute right-0 top-full z-50 mt-2 w-72 overflow-hidden rounded-[16px] border border-slate-200 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.12)]">
            <div className="border-b border-slate-200 bg-[#f8fbff] p-4">
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-full border border-[#cfe0ff] bg-[#edf5ff] text-sm font-bold text-[#0a4d8c]">
                  {userLabel}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-800">Ari Rahman</p>
                  <p className="text-xs text-slate-500">Admin Procurement</p>
                </div>
              </div>
            </div>

            <div className="p-2">
              <button
                type="button"
                className="flex w-full items-center gap-3 rounded-[12px] px-3 py-2.5 text-left text-sm text-slate-700 transition hover:bg-slate-100"
              >
                <UserCircle2 size={16} className="text-slate-500" />
                Profil Saya
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
