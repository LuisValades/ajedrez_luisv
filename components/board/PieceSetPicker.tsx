"use client";

import { motion } from "framer-motion";
import { PIECE_SETS, type PieceSetId } from "@/lib/pieceSets";
import { PieceSvg } from "./Pieces";
import { cn } from "@/lib/utils";

type PieceSetPickerProps = {
  current: PieceSetId;
  onChange: (id: PieceSetId) => void;
};

export function PieceSetPicker({ current, onChange }: PieceSetPickerProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {PIECE_SETS.map((set) => {
        const active = current === set.id;
        const palette = set.palette;
        return (
          <motion.button
            key={set.id}
            type="button"
            onClick={() => onChange(set.id)}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            aria-pressed={active}
            className={cn(
              "rounded-2xl p-3 sm:p-4 text-left border-2 shadow-[0_5px_0_0_rgba(58,36,23,0.3)]",
              "active:translate-y-[2px] active:shadow-[0_3px_0_0_rgba(58,36,23,0.3)]",
              active
                ? "ring-4 ring-[var(--color-gold)] border-[var(--color-gold)]"
                : "border-[var(--color-wood-dark)]/15",
              "bg-white",
            )}
          >
            <div className="flex items-start gap-3">
              <div
                className="rounded-xl p-1 shrink-0 shadow-inner"
                style={{
                  background: `linear-gradient(145deg, ${palette.frameStart}, ${palette.frameEnd})`,
                }}
              >
                <div
                  className="rounded-lg p-0.5"
                  style={{
                    background: `linear-gradient(145deg, ${palette.borderStart}, ${palette.borderEnd})`,
                  }}
                >
                  <div
                    className="grid grid-cols-4 grid-rows-2 rounded-md overflow-hidden"
                    style={{ width: 96, height: 48 }}
                  >
                    {Array.from({ length: 8 }).map((_, i) => {
                      const f = i % 4;
                      const r = Math.floor(i / 4);
                      const isDark = (f + r) % 2 === 1;
                      return (
                        <div
                          key={i}
                          style={{
                            background: isDark ? palette.dark : palette.light,
                            position: "relative",
                          }}
                        >
                          {(i === 0 || i === 6) && (
                            <span
                              style={{
                                position: "absolute",
                                inset: 0,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                pointerEvents: "none",
                              }}
                            >
                              <PieceSvg
                                piece={{ type: "q", color: i === 0 ? "w" : "b" }}
                                size={22}
                                pieceSet={set.id}
                              />
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span aria-hidden className="text-xl leading-none">
                    {set.emoji}
                  </span>
                  <p className="font-bold text-base text-[var(--color-wood-dark)]">
                    {set.name}
                  </p>
                </div>
                <p className="text-xs text-[var(--color-wood-dark)]/70 mt-0.5 leading-tight">
                  {set.tagline}
                </p>
                {active && (
                  <span className="inline-block mt-1.5 rounded-full bg-[var(--color-gold)] text-[var(--color-wood-dark)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide">
                    En uso
                  </span>
                )}
              </div>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
