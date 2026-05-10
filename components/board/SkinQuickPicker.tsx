"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Palette, X } from "lucide-react";
import { PIECE_SETS } from "@/lib/pieceSets";
import { PieceSvg } from "./Pieces";
import { useSettingsStore } from "@/store/settingsStore";
import { cn } from "@/lib/utils";

type Props = {
  /** className for the trigger button */
  className?: string;
};

export function SkinQuickPicker({ className }: Props) {
  const [open, setOpen] = useState(false);
  const current = useSettingsStore((s) => s.pieceSet);
  const setPieceSet = useSettingsStore((s) => s.setPieceSet);

  useEffect(() => {
    if (!open) return;
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Cambiar estilo de piezas"
        className={cn(
          "inline-flex items-center justify-center h-12 w-12 rounded-2xl shadow-[0_4px_0_0_rgba(58,36,23,0.35)] active:translate-y-[2px] active:shadow-[0_2px_0_0_rgba(58,36,23,0.35)]",
          "bg-gradient-to-br from-[#fbcfe8] via-[#a78bfa] to-[#22d3ee] text-white",
          className,
        )}
      >
        <Palette size={20} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[var(--color-wood-dark)]/55 backdrop-blur-sm p-3 sm:p-4"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              className="w-full max-w-[560px] rounded-3xl bg-white p-4 sm:p-5 shadow-[0_18px_40px_-12px_rgba(0,0,0,0.5)] border-4 border-[var(--color-gold)]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg sm:text-xl font-bold text-[var(--color-wood-dark)] flex items-center gap-2">
                  <Palette size={20} />
                  Estilo de piezas
                </h3>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Cerrar"
                  className="rounded-xl bg-[var(--color-wood-dark)]/10 p-2 text-[var(--color-wood-dark)]"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {PIECE_SETS.map((set) => {
                  const active = current === set.id;
                  const palette = set.palette;
                  return (
                    <motion.button
                      key={set.id}
                      type="button"
                      onClick={() => {
                        setPieceSet(set.id);
                        setTimeout(() => setOpen(false), 250);
                      }}
                      whileTap={{ scale: 0.96 }}
                      whileHover={{ y: -2 }}
                      aria-pressed={active}
                      className={cn(
                        "rounded-2xl p-2 sm:p-3 border-2 shadow-[0_4px_0_0_rgba(58,36,23,0.3)]",
                        "active:translate-y-[2px] active:shadow-[0_2px_0_0_rgba(58,36,23,0.3)]",
                        "bg-white",
                        active
                          ? "ring-4 ring-[var(--color-gold)] border-[var(--color-gold)]"
                          : "border-[var(--color-wood-dark)]/15",
                      )}
                    >
                      <div
                        className="rounded-xl p-1 mb-2"
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
                            style={{ aspectRatio: "2 / 1" }}
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
                                    aspectRatio: "1 / 1",
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
                                        size={28}
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
                      <div className="text-center">
                        <p className="text-sm font-bold text-[var(--color-wood-dark)] flex items-center justify-center gap-1">
                          <span aria-hidden>{set.emoji}</span> {set.name}
                        </p>
                        <p className="text-[10px] text-[var(--color-wood-dark)]/60 leading-tight">
                          {set.tagline}
                        </p>
                        {active && (
                          <span className="mt-1 inline-block rounded-full bg-[var(--color-gold)] text-[var(--color-wood-dark)] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide">
                            En uso
                          </span>
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              <p className="mt-3 text-center text-[11px] text-[var(--color-wood-dark)]/55">
                Toca un estilo para cambiarlo al instante
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
