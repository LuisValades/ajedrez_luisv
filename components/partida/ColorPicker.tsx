"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import type { Color } from "@/lib/chessEngine";
import { PieceSvg } from "@/components/board/Pieces";
import { cn } from "@/lib/utils";

type ColorPickerProps = {
  current: Color;
  onSelect: (c: Color) => void;
  onConfirm: () => void;
  onRandom: () => void;
};

export function ColorPicker({
  current,
  onSelect,
  onConfirm,
  onRandom,
}: ColorPickerProps) {
  const [tossing, setTossing] = useState(false);

  const handleToss = () => {
    setTossing(true);
    setTimeout(() => {
      setTossing(false);
      onRandom();
    }, 1300);
  };

  return (
    <div className="w-full max-w-[860px] flex flex-col items-center gap-5">
      <header className="text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-[var(--color-wood-dark)]">
          ¿De qué color juegas?
        </h2>
        <p className="text-sm sm:text-base text-[var(--color-wood-dark)]/70">
          Las blancas mueven primero
        </p>
      </header>

      <div className="flex items-center gap-4 sm:gap-8">
        <ColorCard
          color="w"
          label="Blancas"
          selected={current === "w"}
          onClick={() => onSelect("w")}
        />

        <motion.div
          aria-hidden
          animate={
            tossing
              ? { rotateY: [0, 540, 1080], y: [0, -40, 0], scale: [1, 1.1, 1] }
              : { rotateY: 0, y: 0, scale: 1 }
          }
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="text-5xl sm:text-6xl drop-shadow-[0_4px_0_rgba(58,36,23,0.4)]"
        >
          🪙
        </motion.div>

        <ColorCard
          color="b"
          label="Negras"
          selected={current === "b"}
          onClick={() => onSelect("b")}
        />
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <button
          type="button"
          onClick={handleToss}
          disabled={tossing}
          className={cn(
            "rounded-2xl bg-white text-[var(--color-wood-dark)] px-6 py-3 text-base font-bold shadow-[0_6px_0_0_rgba(58,36,23,0.35)] active:translate-y-[3px] active:shadow-[0_3px_0_0_rgba(58,36,23,0.35)]",
            tossing && "opacity-70",
          )}
        >
          🪙 Lanzar moneda
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="rounded-2xl bg-[var(--color-success)] text-white px-8 py-4 text-lg font-bold shadow-[0_6px_0_0_rgba(58,36,23,0.45)] active:translate-y-[3px] active:shadow-[0_3px_0_0_rgba(58,36,23,0.45)]"
        >
          ¡A jugar! ⚔️
        </button>
      </div>
    </div>
  );
}

function ColorCard({
  color,
  label,
  selected,
  onClick,
}: {
  color: Color;
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
      whileHover={{ y: -3 }}
      aria-pressed={selected}
      aria-label={`Jugar con ${label.toLowerCase()}`}
      className={cn(
        "rounded-3xl p-4 sm:p-5 flex flex-col items-center justify-center gap-2 min-w-[110px] sm:min-w-[140px] min-h-[140px] sm:min-h-[160px]",
        "border-2 shadow-[0_8px_0_0_rgba(58,36,23,0.35)]",
        "active:translate-y-[3px] active:shadow-[0_5px_0_0_rgba(58,36,23,0.35)]",
        selected
          ? "ring-4 ring-[var(--color-gold)]"
          : "",
        color === "w"
          ? "bg-[var(--color-square-light)] border-[var(--color-wood-dark)]/25"
          : "bg-[var(--color-wood-dark)] border-[var(--color-wood)]",
      )}
    >
      <PieceSvg piece={{ type: "k", color }} size={70} />
      <p
        className={cn(
          "text-base sm:text-lg font-bold",
          color === "w" ? "text-[var(--color-wood-dark)]" : "text-white",
        )}
      >
        {label}
      </p>
    </motion.button>
  );
}
