"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface WindowItem {
  id: number;
  title: string;
  open: boolean;
}

interface DesktopContextProps {
  windows: WindowItem[];
  toggleWindow: (id: number) => void;
}

const DesktopContext = createContext<DesktopContextProps | undefined>(undefined);

export function DesktopProvider({ children }: { children: ReactNode }) {
  const [windows, setWindows] = useState<WindowItem[]>([
    { id: 3, title: "This PC", open: false },
    { id: 1, title: "Projects", open: false },
    { id: 2, title: "About", open: false },
  ]);

  const toggleWindow = (id: number) =>
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, open: !w.open } : w))
    );

  return (
    <DesktopContext.Provider value={{ windows, toggleWindow }}>
      {children}
    </DesktopContext.Provider>
  );
}

export function useDesktop() {
  const ctx = useContext(DesktopContext);
  if (!ctx) throw new Error("useDesktop must be used inside DesktopProvider");
  return ctx;
}
