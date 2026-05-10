"use client";

import {
  Eye,
  EyeOff,
  FlipHorizontal,
  Lightbulb,
  RotateCcw,
  ShieldAlert,
  Undo2,
} from "lucide-react";
import { useGameStore } from "@/store/gameStore";
import { cn } from "@/lib/utils";

type ControlButtonProps = {
  label: string;
  onClick: () => void;
  active?: boolean;
  emoji: string;
  icon: React.ReactNode;
  variant?: "default" | "danger";
};

function ControlButton({
  label,
  onClick,
  active = false,
  emoji,
  icon,
  variant = "default",
}: ControlButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      className={cn(
        "min-w-[88px] min-h-[72px] flex flex-col items-center justify-center gap-1 rounded-2xl px-3 py-2 font-semibold text-sm transition-all active:scale-95",
        "shadow-[0_4px_0_0_rgba(58,36,23,0.45)] active:shadow-[0_1px_0_0_rgba(58,36,23,0.45)] active:translate-y-[3px]",
        variant === "danger" && "bg-[var(--color-danger)] text-white",
        variant === "default" &&
          (active
            ? "bg-[var(--color-gold)] text-[var(--color-wood-dark)]"
            : "bg-white/85 text-[var(--color-wood-dark)] hover:bg-white"),
      )}
    >
      <span className="text-2xl leading-none" aria-hidden>
        {emoji}
      </span>
      <span className="flex items-center gap-1 text-[13px]">
        {icon}
        <span>{label}</span>
      </span>
    </button>
  );
}

export function GameControls() {
  const {
    history,
    showHints,
    showThreats,
    showCoordinates,
    undo,
    reset,
    flipBoard,
    toggleHints,
    toggleThreats,
    toggleCoordinates,
  } = useGameStore();

  return (
    <div className="flex flex-wrap justify-center gap-2 sm:gap-3 px-2">
      <ControlButton
        label="Deshacer"
        emoji="↩️"
        icon={<Undo2 size={14} />}
        onClick={undo}
      />
      <ControlButton
        label="Voltear"
        emoji="🔄"
        icon={<FlipHorizontal size={14} />}
        onClick={flipBoard}
      />
      <ControlButton
        label="Pistas"
        emoji="💡"
        icon={<Lightbulb size={14} />}
        active={showHints}
        onClick={toggleHints}
      />
      <ControlButton
        label="Avisos"
        emoji="⚠️"
        icon={<ShieldAlert size={14} />}
        active={showThreats}
        onClick={toggleThreats}
      />
      <ControlButton
        label="Letras"
        emoji="🔤"
        icon={showCoordinates ? <Eye size={14} /> : <EyeOff size={14} />}
        active={showCoordinates}
        onClick={toggleCoordinates}
      />
      <ControlButton
        label="Reiniciar"
        emoji="🆕"
        icon={<RotateCcw size={14} />}
        onClick={() => {
          if (history.length === 1) {
            reset();
            return;
          }
          if (
            typeof window !== "undefined" &&
            window.confirm("¿Empezar de nuevo? Se borra esta partida.")
          ) {
            reset();
          }
        }}
        variant="danger"
      />
    </div>
  );
}
