"use client";

import Link from "next/link";
import { ArrowLeft, Volume2, VolumeX } from "lucide-react";
import { CoachOverlay } from "@/components/coach/CoachOverlay";
import { SkinQuickPicker } from "@/components/board/SkinQuickPicker";
import { PieceLegendButton } from "@/components/board/PieceLegend";
import { useSettingsStore } from "@/store/settingsStore";
import { cn } from "@/lib/utils";

type AppShellProps = {
  title: string;
  emoji?: string;
  backHref?: string;
  children: React.ReactNode;
  showCoach?: boolean;
  coachPosition?: "bottom-right" | "bottom-left";
  className?: string;
};

export function AppShell({
  title,
  emoji = "🐲",
  backHref = "/",
  children,
  showCoach = true,
  coachPosition = "bottom-right",
  className,
}: AppShellProps) {
  const { voiceOn, setVoiceOn, unlockAudio } = useSettingsStore();

  return (
    <main
      className={cn(
        "min-h-dvh flex flex-col items-center px-3 pt-4 pb-24 sm:pt-6 gap-4",
        className,
      )}
      onPointerDown={unlockAudio}
    >
      <header className="w-full max-w-[720px] flex items-center justify-between gap-3">
        <Link
          href={backHref}
          aria-label="Volver al inicio"
          className="inline-flex items-center gap-2 rounded-2xl bg-white/85 px-4 py-3 text-sm font-bold text-[var(--color-wood-dark)] shadow-[0_4px_0_0_rgba(58,36,23,0.35)] active:translate-y-[2px] active:shadow-[0_2px_0_0_rgba(58,36,23,0.35)]"
        >
          <ArrowLeft size={18} />
          <span>Inicio</span>
        </Link>

        <h1 className="flex items-center gap-2 text-lg sm:text-2xl font-bold text-[var(--color-wood-dark)]">
          <span aria-hidden className="text-2xl sm:text-3xl">
            {emoji}
          </span>
          <span>{title}</span>
        </h1>

        <div className="flex items-center gap-2">
          <PieceLegendButton />
          <SkinQuickPicker />
          <button
            type="button"
            aria-label={voiceOn ? "Apagar voz de Drako" : "Encender voz de Drako"}
            aria-pressed={voiceOn}
            onClick={() => {
              unlockAudio();
              setVoiceOn(!voiceOn);
            }}
            className={cn(
              "inline-flex items-center justify-center h-12 w-12 rounded-2xl shadow-[0_4px_0_0_rgba(58,36,23,0.35)] active:translate-y-[2px] active:shadow-[0_2px_0_0_rgba(58,36,23,0.35)]",
              voiceOn
                ? "bg-[var(--color-gold)] text-[var(--color-wood-dark)]"
                : "bg-white/80 text-[var(--color-wood-dark)]/60",
            )}
          >
            {voiceOn ? <Volume2 size={22} /> : <VolumeX size={22} />}
          </button>
        </div>
      </header>

      <div className="w-full flex-1 flex flex-col items-center gap-4 sm:gap-6">
        {children}
      </div>

      {showCoach && <CoachOverlay position={coachPosition} size={88} />}
    </main>
  );
}
