"use client";

import { motion } from "framer-motion";
import { squareToCoords, type Color, type Square } from "@/lib/chessEngine";

type HintArrowProps = {
  from: Square;
  to: Square;
  orientation?: Color;
};

export function HintArrow({ from, to, orientation = "w" }: HintArrowProps) {
  const f = squareToCoords(from);
  const t = squareToCoords(to);

  const flip = orientation === "b";
  const fx = (flip ? 7 - f.file : f.file) + 0.5;
  const fy = (flip ? 7 - f.rank : f.rank) + 0.5;
  const tx = (flip ? 7 - t.file : t.file) + 0.5;
  const ty = (flip ? 7 - t.rank : t.rank) + 0.5;

  return (
    <svg
      viewBox="0 0 8 8"
      preserveAspectRatio="none"
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ overflow: "visible" }}
      aria-hidden
    >
      <defs>
        <marker
          id="hint-arrow-head"
          viewBox="0 0 10 10"
          refX="6"
          refY="5"
          markerWidth="4"
          markerHeight="4"
          orient="auto-start-reverse"
        >
          <path d="M0,0 L10,5 L0,10 z" fill="#42a5f5" stroke="#1565c0" strokeWidth="0.5" strokeLinejoin="round" />
        </marker>
      </defs>
      <motion.line
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        x1={fx}
        y1={fy}
        x2={tx}
        y2={ty}
        stroke="#42a5f5"
        strokeWidth={0.18}
        strokeLinecap="round"
        markerEnd="url(#hint-arrow-head)"
        style={{ filter: "drop-shadow(0 0 0.06px rgba(21,101,192,0.5))" }}
      />
      <motion.circle
        cx={fx}
        cy={fy}
        r={0.18}
        fill="#42a5f5"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 1.1, 0.85], opacity: 0.85 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      />
    </svg>
  );
}
