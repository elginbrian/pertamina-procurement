"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface SidebarContextType {
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
  toggleCollapsed: () => void;
  mobileOpen: boolean;
  setMobileOpen: (value: boolean) => void;
  toggleMobileOpen: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within SidebarProvider");
  }
  return context;
};

export const SidebarProvider = ({ children }: { children: ReactNode }) => {
  const STORAGE_KEY = "sidebar:collapsed";

  const [collapsed, setCollapsed] = useState<boolean>(() => {
    try {
      if (typeof window === "undefined") return false;
      return localStorage.getItem(STORAGE_KEY) === "1";
    } catch (err) {
      return false;
    }
  });

  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleCollapsed = () => setCollapsed((c) => !c);
  const toggleMobileOpen = () => setMobileOpen((v) => !v);

  // persist collapsed state so it survives navigation and reloads
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, collapsed ? "1" : "0");
    } catch (err) {
      // ignore
    }
  }, [collapsed]);

  return (
    <SidebarContext.Provider
      value={{ collapsed, setCollapsed, toggleCollapsed, mobileOpen, setMobileOpen, toggleMobileOpen }}
    >
      {children}
    </SidebarContext.Provider>
  );
};
