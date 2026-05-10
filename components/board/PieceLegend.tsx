"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, X } from "lucide-react";
import { PieceSvg } from "./Pieces";
import { useSettingsStore } from "@/store/settingsStore";
import { getPieceSet } from "@/lib/pieceSets";
import type { Piece } from "@/lib/chessEngine";
import { cn } from "@/lib/utils";

type LegendEntry = {
  type: Piece["type"];
  name: string;
  glyphWhite: string;
  glyphBlack: string;
  movesShort: string;
};

const LEGEND: LegendEntry[] = [
  {
    type: "p",
    name: "Peón",
    glyphWhite: "♙",
    glyphBlack: "♟",
    movesShort: "Avanza 1 casilla. La primera vez puede 2. Come en diagonal.",
  },
  {
    type: "r",
    name: "Torre",
    glyphWhite: "♖",
    glyphBlack: "♜",
    movesShort: "Líneas rectas: arriba, abajo, izquierda y derecha.",
  },
  {
    type: "n",
    name: "Caballo",
    glyphWhite: "♘",
    glyphBlack: "♞",
    movesShort: "Salta en L. Es la única pieza que brinca sobre otras.",
  },
  {
    type: "b",
    name: "Alfil",
    glyphWhite: "♗",
    glyphBlack: "♝",
    movesShort: "Diagonales largas, siempre del mismo color de casilla.",
  },
  {
    type: "q",
    name: "Reina",
    glyphWhite: "♕",
    glyphBlack: "♛",
    movesShort: "La más fuerte. Combina líneas rectas y diagonales.",
  },
  {
    type: "k",
    name: "Rey",
    glyphWhite: "♔",
    glyphBlack: "♚",
    movesShort: "Una casilla en cualquier dirección. ¡Hay que protegerlo!",
  },
];

export function PieceLegendButton({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const activeSkin = useSettingsStore((s) => s.pieceSet);
  const palette = getPieceSet(activeSkin).palette;

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
        aria-label="Ver piezas y nombres"
        className={cn(
          "inline-flex items-center justify-center h-12 w-12 rounded-2xl shadow-[0_4px_0_0_rgba(58,36,23,0.35)] active:translate-y-[2px] active:shadow-[0_2px_0_0_rgba(58,36,23,0.35)]",
          "bg-gradient-to-br from-[#fbbf24] via-[#f59e0b] to-[#b45309] text-white",
          className,
        )}
      >
        <BookOpen size={20} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[var(--color-wood-dark)]/55 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              className="w-full max-w-[760px] rounded-3xl bg-white p-4 sm:p-6 shadow-[0_18px_40px_-12px_rgba(0,0,0,0.5)] border-4 border-[var(--color-gold)] my-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg sm:text-2xl font-bold text-[var(--color-wood-dark)] flex items-center gap-2">
                  <BookOpen size={22} />
                  Las 6 piezas del reino
                </h3>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Cerrar"
                  className="rounded-xl bg-[var(--color-wood-dark)]/10 p-2 text-[var(--color-wood-dark)]"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {LEGEND.map((entry) => (
                  <div
                    key={entry.type}
                    className="rounded-2xl border-2 border-[var(--color-wood-dark)]/15 bg-gradient-to-br from-white to-[var(--color-bg)] p-3 sm:p-4 shadow-[0_4px_0_0_rgba(58,36,23,0.15)]"
                  >
                    <div className="flex items-center gap-3">
                      {/* Visual piece preview — uses active skin */}
                      <div
                        className="shrink-0 rounded-xl flex items-center justify-center"
                        style={{
                          width: 64,
                          height: 64,
                          background: palette.light,
                          border: `2px solid ${palette.innerBorder}`,
                        }}
                      >
                        <PieceSvg piece={{ type: entry.type, color: "w" }} size={56} />
                      </div>
                      <div
                        className="shrink-0 rounded-xl flex items-center justify-center"
                        style={{
                          width: 64,
                          height: 64,
                          background: palette.dark,
                          border: `2px solid ${palette.innerBorder}`,
                        }}
                      >
                        <PieceSvg piece={{ type: entry.type, color: "b" }} size={56} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-base sm:text-lg font-extrabold text-[var(--color-wood-dark)] leading-tight">
                          {entry.name}
                        </p>
                        <p className="text-2xl sm:text-3xl leading-none mt-1 text-[var(--color-wood-dark)]">
                          <span className="mr-1">{entry.glyphWhite}</span>
                          <span>{entry.glyphBlack}</span>
                        </p>
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-[var(--color-wood-dark)]/75 mt-2 leading-snug">
                      {entry.movesShort}
                    </p>
                  </div>
                ))}
              </div>

              <p className="mt-4 text-center text-xs text-[var(--color-wood-dark)]/60">
                Toca el botón 🎨 para cambiar el estilo de las piezas
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
