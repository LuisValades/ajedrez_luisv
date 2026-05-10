"use client";

import { motion } from "framer-motion";
import { PIECE_SETS } from "@/lib/pieceSets";
import { PieceSvg } from "./Pieces";
import { useSettingsStore } from "@/store/settingsStore";
import { cn } from "@/lib/utils";

type SkinBarProps = {
  className?: string;
  /** "compact" — small chips, "full" — bigger preview cards */
  variant?: "compact" | "full";
  showLabel?: boolean;
};

export function SkinBar({
  className,
  variant = "compact",
  showLabel = true,
}: SkinBarProps) {
  const current = useSettingsStore((s) => s.pieceSet);
  const setPieceSet = useSettingsStore((s) => s.setPieceSet);

  return (
    <div className={cn("w-full max-w-[640px] flex flex-col items-center gap-1.5", className)}>
      {showLabel && (
        <p className="text-[11px] sm:text-xs font-bold uppercase tracking-wide text-[var(--color-wood-dark)]/70">
          🎨 Estilo del tablero
        </p>
      )}
      <div className="flex w-full justify-center gap-1.5 sm:gap-2 flex-wrap">
        {PIECE_SETS.map((set) => {
          const active = current === set.id;
          const palette = set.palette;
          if (variant === "full") {
            return (
              <motion.button
                key={set.id}
                type="button"
                onClick={() => setPieceSet(set.id)}
                whileTap={{ scale: 0.95 }}
                aria-pressed={active}
                aria-label={`Estilo ${set.name}`}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-2xl p-2 sm:p-2.5 border-2 shadow-[0_4px_0_0_rgba(58,36,23,0.3)]",
                  "active:translate-y-[2px] active:shadow-[0_2px_0_0_rgba(58,36,23,0.3)]",
                  "bg-white min-w-[78px] sm:min-w-[96px]",
                  active
                    ? "ring-4 ring-[var(--color-gold)] border-[var(--color-gold)]"
                    : "border-[var(--color-wood-dark)]/15",
                )}
              >
                <div
                  className="rounded-md p-0.5 w-full"
                  style={{
                    background: `linear-gradient(145deg, ${palette.borderStart}, ${palette.borderEnd})`,
                  }}
                >
                  <div
                    className="grid grid-cols-2 grid-rows-2 rounded-sm overflow-hidden"
                    style={{ aspectRatio: "1 / 1" }}
                  >
                    {Array.from({ length: 4 }).map((_, i) => {
                      const f = i % 2;
                      const r = Math.floor(i / 2);
                      const isDark = (f + r) % 2 === 1;
                      return (
                        <div
                          key={i}
                          className="relative"
                          style={{ background: isDark ? palette.dark : palette.light }}
                        >
                          {i === 0 && (
                            <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
                              <PieceSvg
                                piece={{ type: "q", color: "w" }}
                                size={18}
                                pieceSet={set.id}
                              />
                            </span>
                          )}
                          {i === 3 && (
                            <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
                              <PieceSvg
                                piece={{ type: "n", color: "b" }}
                                size={18}
                                pieceSet={set.id}
                              />
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
                <p className="text-[11px] sm:text-xs font-bold text-[var(--color-wood-dark)] leading-tight flex items-center gap-1">
                  <span aria-hidden>{set.emoji}</span>
                  {set.name}
                </p>
              </motion.button>
            );
          }
          // compact
          return (
            <motion.button
              key={set.id}
              type="button"
              onClick={() => setPieceSet(set.id)}
              whileTap={{ scale: 0.95 }}
              aria-pressed={active}
              aria-label={`Estilo ${set.name}`}
              className={cn(
                "flex items-center gap-1.5 rounded-full px-3 py-1.5 border-2 text-xs sm:text-sm font-bold shadow-[0_3px_0_0_rgba(58,36,23,0.25)]",
                "active:translate-y-[1px] active:shadow-[0_1px_0_0_rgba(58,36,23,0.25)]",
                active
                  ? "ring-4 ring-[var(--color-gold)] border-[var(--color-gold)] bg-white text-[var(--color-wood-dark)]"
                  : "border-[var(--color-wood-dark)]/20 bg-white/85 text-[var(--color-wood-dark)]/85",
              )}
            >
              <span
                aria-hidden
                className="inline-block rounded-sm overflow-hidden"
                style={{
                  width: 22,
                  height: 22,
                  background: `linear-gradient(135deg, ${palette.light} 0% 50%, ${palette.dark} 50% 100%)`,
                  border: `1.5px solid ${palette.innerBorder}`,
                }}
              />
              <span>{set.name}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
