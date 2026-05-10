"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { THEMES_LIST, type ThemeId } from "@/lib/themes";
import { PieceSvg } from "./Pieces";
import { cn } from "@/lib/utils";

type PieceSetPickerProps = {
  current: ThemeId;
  onChange: (id: ThemeId) => void;
};

export function PieceSetPicker({ current, onChange }: PieceSetPickerProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {THEMES_LIST.map((theme) => {
        const active = current === theme.id;
        return (
          <motion.button
            key={theme.id}
            type="button"
            onClick={() => onChange(theme.id)}
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
                style={{ background: theme.board.frame }}
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
                          background: isDark ? theme.board.dark : theme.board.light,
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
                              palette={i === 0 ? theme.player1 : theme.player2}
                              themeOverride={theme}
                            />
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span aria-hidden className="text-xl leading-none">
                    {theme.emoji}
                  </span>
                  <p className="font-bold text-base text-[var(--color-wood-dark)]">
                    {theme.name}
                  </p>
                </div>
                <p className="text-xs text-[var(--color-wood-dark)]/70 mt-0.5 leading-tight">
                  {theme.short} — {theme.description}
                </p>
                {active && (
                  <span className="inline-flex items-center gap-1 mt-1.5 rounded-full bg-[var(--color-gold)] text-[var(--color-wood-dark)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide">
                    <Check size={10} strokeWidth={3} /> En uso
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
