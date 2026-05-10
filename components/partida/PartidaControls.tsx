"use client";

import {
  FlipHorizontal,
  Lightbulb,
  Loader2,
  RotateCcw,
  Undo2,
} from "lucide-react";
import { cn } from "@/lib/utils";

type ButtonProps = {
  label: string;
  emoji: string;
  icon: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  variant?: "default" | "primary" | "danger";
};

function PartidaButton({
  label,
  emoji,
  icon,
  onClick,
  disabled = false,
  variant = "default",
}: ButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={cn(
        "min-w-[88px] min-h-[72px] flex flex-col items-center justify-center gap-1 rounded-2xl px-3 py-2 font-semibold text-sm",
        "shadow-[0_4px_0_0_rgba(58,36,23,0.45)] active:translate-y-[3px] active:shadow-[0_1px_0_0_rgba(58,36,23,0.45)]",
        disabled && "opacity-50 cursor-not-allowed active:translate-y-0",
        variant === "danger" && "bg-[var(--color-danger)] text-white",
        variant === "primary" && "bg-[var(--color-hint)] text-white",
        variant === "default" && "bg-white/85 text-[var(--color-wood-dark)]",
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

type PartidaControlsProps = {
  onHint: () => void;
  onUndo: () => void;
  onFlip: () => void;
  onResign: () => void;
  hintLoading?: boolean;
  hintDisabled?: boolean;
  undoDisabled?: boolean;
};

export function PartidaControls({
  onHint,
  onUndo,
  onFlip,
  onResign,
  hintLoading = false,
  hintDisabled = false,
  undoDisabled = false,
}: PartidaControlsProps) {
  return (
    <div className="flex flex-wrap justify-center gap-2 sm:gap-3 px-2">
      <PartidaButton
        label="Pista"
        emoji="💡"
        icon={
          hintLoading ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Lightbulb size={14} />
          )
        }
        onClick={onHint}
        disabled={hintDisabled || hintLoading}
        variant="primary"
      />
      <PartidaButton
        label="Deshacer"
        emoji="↩️"
        icon={<Undo2 size={14} />}
        onClick={onUndo}
        disabled={undoDisabled}
      />
      <PartidaButton
        label="Voltear"
        emoji="🔄"
        icon={<FlipHorizontal size={14} />}
        onClick={onFlip}
      />
      <PartidaButton
        label="Rendirse"
        emoji="🏳️"
        icon={<RotateCcw size={14} />}
        onClick={onResign}
        variant="danger"
      />
    </div>
  );
}
