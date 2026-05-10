"use client";

import { motion } from "framer-motion";
import { LEVELS, type LevelConfig } from "@/lib/stockfish/levels";
import type { EndReason } from "@/store/partidaStore";
import { cn } from "@/lib/utils";

type EndGameModalProps = {
  reason: EndReason;
  level: LevelConfig;
  onRematch: () => void;
  onChangeLevel: () => void;
  onHome: () => void;
};

const COPY: Record<
  EndReason,
  { emoji: string; title: string; subtitle: string; happy: boolean }
> = {
  "checkmate-player": {
    emoji: "🏆",
    title: "¡Ganaste!",
    subtitle: "Diste jaque mate. ¡Eres una campeona del reino!",
    happy: true,
  },
  "checkmate-ia": {
    emoji: "💔",
    title: "Casi casi",
    subtitle: "Esta vez te dio mate. ¡La próxima ganarás!",
    happy: false,
  },
  stalemate: {
    emoji: "🤝",
    title: "Tablas",
    subtitle: "Ahogamiento — nadie pudo mover.",
    happy: false,
  },
  draw: {
    emoji: "🤝",
    title: "Tablas",
    subtitle: "Empate justo.",
    happy: false,
  },
  resign: {
    emoji: "🏳️",
    title: "Te rendiste",
    subtitle: "¡No pasa nada! Otra ronda y a darle.",
    happy: false,
  },
};

export function EndGameModal({
  reason,
  level,
  onRematch,
  onChangeLevel,
  onHome,
}: EndGameModalProps) {
  const copy = COPY[reason];
  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-wood-dark)]/55 backdrop-blur-sm p-4"
    >
      <motion.div
        initial={{ scale: 0.85, y: 24, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 320, damping: 24 }}
        className={cn(
          "relative w-full max-w-md rounded-3xl p-6 sm:p-8 text-center bg-gradient-to-br border-4 shadow-[0_18px_40px_-12px_rgba(0,0,0,0.5)]",
          copy.happy
            ? "from-[#fef3c7] via-[#fcd34d] to-[#f59e0b] border-[var(--color-gold)] text-[var(--color-wood-dark)]"
            : "from-white via-white to-[#f1ede1] border-[var(--color-wood-dark)]/30 text-[var(--color-wood-dark)]",
        )}
      >
        <motion.div
          animate={
            copy.happy
              ? { rotate: [-6, 6, -6, 6, 0], scale: [1, 1.15, 1] }
              : { y: [0, -4, 0] }
          }
          transition={{ duration: 1.4, repeat: copy.happy ? 1 : Infinity }}
          className="text-7xl sm:text-8xl mx-auto"
        >
          {copy.emoji}
        </motion.div>
        <h2 className="mt-3 text-3xl sm:text-4xl font-bold">{copy.title}</h2>
        <p className="mt-1 text-base sm:text-lg opacity-90">{copy.subtitle}</p>

        <div className="mt-3 inline-flex items-center gap-1 rounded-full bg-white/80 px-3 py-1 text-xs font-bold">
          {level.emoji} {level.name}
        </div>

        <div className="mt-6 flex flex-col gap-3">
          <button
            type="button"
            onClick={onRematch}
            className="rounded-2xl bg-[var(--color-success)] text-white px-6 py-4 text-lg font-bold shadow-[0_5px_0_0_rgba(58,36,23,0.4)] active:translate-y-[3px] active:shadow-[0_2px_0_0_rgba(58,36,23,0.4)]"
          >
            🔄 Revancha
          </button>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onChangeLevel}
              className="flex-1 rounded-2xl bg-white text-[var(--color-wood-dark)] px-4 py-3 text-sm font-bold shadow-[0_4px_0_0_rgba(58,36,23,0.3)] active:translate-y-[2px] active:shadow-[0_2px_0_0_rgba(58,36,23,0.3)]"
            >
              Cambiar rival
            </button>
            <button
              type="button"
              onClick={onHome}
              className="flex-1 rounded-2xl bg-[var(--color-wood-dark)] text-white px-4 py-3 text-sm font-bold shadow-[0_4px_0_0_rgba(58,36,23,0.3)] active:translate-y-[2px] active:shadow-[0_2px_0_0_rgba(58,36,23,0.3)]"
            >
              Inicio
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export const ALL_LEVELS = LEVELS;
