"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { AppShell } from "@/components/layout/AppShell";
import { GAMES } from "@/lib/minigames/games";
import { useProgressStore } from "@/store/progressStore";
import { useCoach } from "@/components/coach/CoachContext";
import { cn } from "@/lib/utils";

export default function MinijuegosIndexPage() {
  const minigameStars = useProgressStore((s) => s.minigameStars);
  const coach = useCoach();
  const greeted = useRef(false);

  useEffect(() => {
    if (greeted.current) return;
    greeted.current = true;
    coach.say({
      text: "¡Aquí están los mini-juegos! Una aventura por cada pieza del reino.",
      durationMs: 5000,
    });
  }, [coach]);

  return (
    <AppShell title="Mini-Juegos" emoji="🎮">
      <div className="w-full max-w-[860px] flex flex-col gap-3 sm:gap-4">
        <header className="text-center px-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-[var(--color-wood-dark)]">
            Aventuras del reino
          </h2>
          <p className="text-sm sm:text-base text-[var(--color-wood-dark)]/70">
            5 niveles por cada pieza · ⭐ por completar rápido
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {GAMES.map((g, idx) => {
            const stars = g.levels.reduce(
              (s, l) => s + (minigameStars[g.id]?.[l.index] ?? 0),
              0,
            );
            const maxStars = g.levels.length * 3;
            const completed = g.levels.every(
              (l) => (minigameStars[g.id]?.[l.index] ?? 0) > 0,
            );
            return (
              <motion.div
                key={g.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Link
                  href={`/minijuegos/${g.id}`}
                  className={cn(
                    "relative block rounded-3xl p-4 sm:p-5 border-2 shadow-[0_8px_0_0_rgba(58,36,23,0.3)]",
                    "active:translate-y-[3px] active:shadow-[0_5px_0_0_rgba(58,36,23,0.3)]",
                    "bg-gradient-to-br text-[var(--color-wood-dark)]",
                    g.gradient,
                    completed
                      ? "ring-4 ring-[var(--color-gold)]"
                      : "border-[var(--color-wood-dark)]/20",
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span aria-hidden className="text-5xl drop-shadow-[0_2px_0_rgba(58,36,23,0.4)]">
                      {g.emoji}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wide rounded-full bg-white/40 px-2 py-1 text-[var(--color-wood-dark)]">
                      {g.levels.length} niveles
                    </span>
                  </div>
                  <p className="mt-2 text-lg sm:text-xl font-bold leading-tight drop-shadow-[0_1px_0_rgba(255,255,255,0.4)]">
                    {g.title}
                  </p>
                  <p className="text-sm opacity-90">{g.subtitle}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider">
                      {stars} / {maxStars} ⭐
                    </span>
                    {completed && <span className="text-xl">🏆</span>}
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}

