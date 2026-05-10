"use client";

import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const DISMISS_KEY = "reino-install-dismissed";

export function PWARegister() {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    return localStorage.getItem(DISMISS_KEY) === "1";
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;

    if (process.env.NODE_ENV === "production") {
      navigator.serviceWorker
        .register("/sw.js", { scope: "/" })
        .catch(() => {});
    }

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setInstallEvent(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  const handleInstall = async () => {
    if (!installEvent) return;
    await installEvent.prompt();
    await installEvent.userChoice;
    setInstallEvent(null);
  };

  const handleDismiss = () => {
    setDismissed(true);
    if (typeof window !== "undefined") {
      localStorage.setItem(DISMISS_KEY, "1");
    }
  };

  const visible = !!installEvent && !dismissed;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          className="fixed bottom-3 left-1/2 -translate-x-1/2 z-50 max-w-[92vw]"
        >
          <div className="flex items-center gap-2 rounded-2xl bg-[var(--color-wood-dark)] text-white px-3 py-2 shadow-[0_8px_20px_-8px_rgba(0,0,0,0.5)]">
            <span aria-hidden className="text-2xl">📲</span>
            <div className="flex-1 text-xs sm:text-sm font-semibold leading-tight">
              <div>Instala ReinoChess</div>
              <div className="opacity-80 text-[11px]">Funciona sin internet</div>
            </div>
            <button
              type="button"
              onClick={handleInstall}
              className="rounded-xl bg-[var(--color-success)] text-white px-3 py-2 text-sm font-bold flex items-center gap-1"
            >
              <Download size={14} />
              Instalar
            </button>
            <button
              type="button"
              onClick={handleDismiss}
              aria-label="Cerrar"
              className="rounded-xl bg-white/15 text-white p-2"
            >
              <X size={14} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
