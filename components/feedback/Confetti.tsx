"use client";

import { motion } from "framer-motion";
import { useState } from "react";

type ConfettiProps = {
  burstKey?: string | number;
  pieces?: number;
};

const COLORS = ["#f5c518", "#7cb342", "#42a5f5", "#e53935", "#ff8aa3", "#a78bfa"];
const EMOJIS = ["⭐", "✨", "🎉", "🏅"];

type Item = {
  id: string;
  x: number;
  delay: number;
  rot: number;
  color: string;
  emoji: string;
  size: number;
};

function generate(burstKey: string | number, pieces: number): Item[] {
  return Array.from({ length: pieces }).map((_, i) => ({
    id: `${burstKey}-${i}`,
    x: Math.random() * 100,
    delay: Math.random() * 0.4,
    rot: Math.random() * 540 - 270,
    color: COLORS[i % COLORS.length],
    emoji: EMOJIS[i % EMOJIS.length],
    size: 16 + Math.random() * 14,
  }));
}

export function Confetti({ burstKey = 0, pieces = 28 }: ConfettiProps) {
  // generate once on mount; regenerate if burstKey/pieces change.
  const [trackedKey, setTrackedKey] = useState<string | number | null>(null);
  const [items, setItems] = useState<Item[]>(() => generate(burstKey, pieces));
  const compoundKey = `${burstKey}|${pieces}`;
  if (trackedKey !== compoundKey) {
    setTrackedKey(compoundKey);
    setItems(generate(burstKey, pieces));
  }

  return (
    <div
      className="pointer-events-none fixed inset-0 z-50 overflow-hidden"
      aria-hidden
    >
      {items.map((it) => (
        <motion.span
          key={it.id}
          initial={{ y: -40, x: `${it.x}vw`, rotate: 0, opacity: 1 }}
          animate={{
            y: "110vh",
            rotate: it.rot,
            opacity: [1, 1, 0],
          }}
          transition={{ duration: 2.4, delay: it.delay, ease: "easeIn" }}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            color: it.color,
            fontSize: it.size,
            textShadow: "0 1px 0 rgba(58,36,23,0.5)",
          }}
        >
          {it.emoji}
        </motion.span>
      ))}
    </div>
  );
}
