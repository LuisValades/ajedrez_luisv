"use client";

import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import { LEVELS, type LevelId } from "@/lib/stockfish/levels";
import { cn } from "@/lib/utils";

type LevelSelectorProps = {
  current: LevelId;
  starsTotal: number;
  onSelect: (id: LevelId) => void;
  onConfirm: () => void;
};

export function LevelSelector({
  current,
  starsTotal,
  onSelect,
  onConfirm,
}: LevelSelectorProps) {
  return (
    <div className="w-full max-w-[860px] flex flex-col items-center gap-4">
      <header className="text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-[var(--color-wood-dark)]">
          ¿Contra quién quieres jugar?
        </h2>
        <p className="text-sm sm:text-base text-[var(--color-wood-dark)]/70">
          Elige a tu rival del reino
        </p>
      </header>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 w-full">
        {LEVELS.map((lvl) => {
          const locked = starsTotal < lvl.unlockStars;
          const isCurrent = lvl.id === current;
          return (
            <motion.button
              key={lvl.id}
              type="button"
              whileTap={{ scale: locked ? 1 : 0.95 }}
              whileHover={{ y: locked ? 0 : -2 }}
              disabled={locked}
              onClick={() => !locked && onSelect(lvl.id)}
              aria-pressed={isCurrent}
              aria-label={`Nivel ${lvl.name} ${lvl.short}${locked ? " (bloqueado)" : ""}`}
              className={cn(
                "relative rounded-3xl p-3 sm:p-4 flex flex-col items-center justify-between gap-1 text-center min-h-[170px]",
                "border-2 shadow-[0_8px_0_0_rgba(58,36,23,0.25)]",
                "active:translate-y-[3px] active:shadow-[0_5px_0_0_rgba(58,36,23,0.25)]",
                `bg-gradient-to-br ${lvl.gradient}`,
                isCurrent
                  ? "border-[var(--color-gold)] ring-4 ring-[var(--color-gold-soft)]"
                  : "border-[var(--color-wood-dark)]/25",
                locked && "opacity-60 cursor-not-allowed",
              )}
            >
              <span aria-hidden className="text-5xl sm:text-6xl drop-shadow-[0_3px_0_rgba(58,36,23,0.3)]">
                {lvl.emoji}
              </span>
              <div>
                <p className="text-base sm:text-lg font-bold text-[var(--color-wood-dark)] drop-shadow-[0_1px_0_rgba(255,255,255,0.5)]">
                  {lvl.name}
                </p>
                <p className="text-[11px] sm:text-xs font-semibold text-[var(--color-wood-dark)]/80">
                  {lvl.short}
                </p>
              </div>
              {locked && (
                <span className="absolute top-2 right-2 inline-flex items-center gap-1 rounded-full bg-white/85 px-2 py-1 text-[10px] font-bold text-[var(--color-wood-dark)]">
                  <Lock size={11} />
                  {lvl.unlockStars}⭐
                </span>
              )}
            </motion.button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={onConfirm}
        className="mt-2 rounded-2xl bg-[var(--color-success)] text-white px-8 py-4 text-lg font-bold shadow-[0_6px_0_0_rgba(58,36,23,0.45)] active:translate-y-[3px] active:shadow-[0_3px_0_0_rgba(58,36,23,0.45)]"
      >
        Continuar →
      </button>
    </div>
  );
}
