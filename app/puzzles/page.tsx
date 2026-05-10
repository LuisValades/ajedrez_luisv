"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { AppShell } from "@/components/layout/AppShell";
import { PUZZLES, THEME_META, type PuzzleTheme } from "@/lib/puzzles/loader";
import { useProgressStore } from "@/store/progressStore";
import { useCoach } from "@/components/coach/CoachContext";
import { StarBurst } from "@/components/feedback/StarBurst";
import { cn } from "@/lib/utils";

const THEME_ORDER: PuzzleTheme[] = [
  "mate-en-1",
  "captura",
  "defiende-rey",
  "promociona-peon",
];

export default function PuzzlesIndexPage() {
  const puzzlesSolved = useProgressStore((s) => s.puzzlesSolved);
  const coach = useCoach();
  const greeted = useRef(false);
  const [theme, setTheme] = useState<PuzzleTheme | "todos">("todos");

  useEffect(() => {
    if (greeted.current) return;
    greeted.current = true;
    coach.say({
      text: "¡Bienvenida a los puzzles del reino! Resuelve cada uno con la menor cantidad de intentos para ganar 3 estrellas.",
      durationMs: 5500,
    });
  }, [coach]);

  const filtered = useMemo(() => {
    if (theme === "todos") return PUZZLES;
    return PUZZLES.filter((p) => p.tema === theme);
  }, [theme]);

  return (
    <AppShell title="Puzzles" emoji="🧩">
      <div className="w-full max-w-[860px] flex flex-col gap-3 sm:gap-4">
        <header className="text-center px-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-[var(--color-wood-dark)]">
            Retos del reino
          </h2>
          <p className="text-sm sm:text-base text-[var(--color-wood-dark)]/70">
            {filtered.length} puzzles · ⭐ por intentos pocos
          </p>
        </header>

        <div className="flex flex-wrap justify-center gap-2">
          <FilterPill
            active={theme === "todos"}
            label="Todos"
            emoji="✨"
            onClick={() => setTheme("todos")}
          />
          {THEME_ORDER.map((t) => (
            <FilterPill
              key={t}
              active={theme === t}
              label={THEME_META[t].label}
              emoji={THEME_META[t].emoji}
              onClick={() => setTheme(t)}
            />
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {filtered.map((p, idx) => {
            const solvedRecord = puzzlesSolved[p.id];
            const meta = THEME_META[p.tema];
            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(0.3, idx * 0.02) }}
              >
                <Link
                  href={`/puzzles/${p.id}`}
                  className={cn(
                    "relative block rounded-2xl p-3 sm:p-4 border-2 shadow-[0_6px_0_0_rgba(58,36,23,0.3)]",
                    "active:translate-y-[3px] active:shadow-[0_3px_0_0_rgba(58,36,23,0.3)]",
                    "bg-gradient-to-br text-white",
                    meta.color,
                    "border-[var(--color-wood-dark)]/20",
                  )}
                >
                  <div className="flex items-start justify-between gap-1">
                    <span aria-hidden className="text-3xl drop-shadow-[0_2px_0_rgba(58,36,23,0.4)]">
                      {meta.emoji}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wide rounded-full bg-white/30 px-2 py-0.5">
                      #{p.id.slice(1)}
                    </span>
                  </div>
                  <p className="mt-2 text-sm sm:text-base font-bold leading-tight drop-shadow-[0_1px_0_rgba(58,36,23,0.3)]">
                    {p.titulo}
                  </p>
                  <p className="text-[10px] sm:text-xs opacity-90">
                    {meta.label}
                  </p>
                  {solvedRecord && (
                    <div className="mt-2">
                      <StarBurst stars={solvedRecord.stars} size="sm" />
                    </div>
                  )}
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}

function FilterPill({
  active,
  label,
  emoji,
  onClick,
}: {
  active: boolean;
  label: string;
  emoji: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-full px-3 py-1.5 text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-[0_3px_0_0_rgba(58,36,23,0.25)] active:translate-y-[1px] active:shadow-[0_1px_0_0_rgba(58,36,23,0.25)]",
        active
          ? "bg-[var(--color-gold)] text-[var(--color-wood-dark)]"
          : "bg-white/85 text-[var(--color-wood-dark)]/80",
      )}
    >
      <span aria-hidden>{emoji}</span>
      <span>{label}</span>
    </button>
  );
}
