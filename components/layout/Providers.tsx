"use client";

import { CoachProvider } from "@/components/coach/CoachContext";
import { PWARegister } from "./PWARegister";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CoachProvider>
      {children}
      <PWARegister />
    </CoachProvider>
  );
}
