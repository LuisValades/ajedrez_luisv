"use client";

import { use, useState } from "react";
import { notFound } from "next/navigation";
import { motion } from "framer-motion";
import { AppShell } from "@/components/layout/AppShell";
import { MinigameRunner } from "@/components/minigames/MinigameRunner";
import { getGame } from "@/lib/minigames/games";
import { useProgressStore } from "@/store/progressStore";
import { StarBurst } from "@/components/feedback/StarBurst";
import { cn } from "@/lib/utils";

type Params = { gameId: string };

export default function GamePage({ params }: { params: Promise<Params> }) {
  const { gameId } = use(params);
  const game = getGame(gameId);
  const minigameStars = useProgressStore((s) => s.minigameStars);
  const [activeLevelIdx, setActiveLevelIdx] = useState<number | null>(null);

  if (!game) notFound();

  if (activeLevelIdx === null) {
    return (
      <AppShell title={game.title} emoji={game.emoji} backHref="/minijuegos">
        <div className="w-full max-w-[860px] flex flex-col gap-3 sm:gap-4">
          <header className="text-center px-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-[var(--color-wood-dark)]">
              {game.title}
            </h2>
            <p className="text-sm sm:text-base text-[var(--color-wood-dark)]/75 max-w-[520px] mx-auto">
              {game.intro}
            </p>
          </header>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {game.levels.map((lvl) => {
              const stars = minigameStars[game.id]?.[lvl.index] ?? 0;
              const completed = stars > 0;
              return (
                <motion.button
                  key={lvl.index}
                  type="button"
                  onClick={() => setActiveLevelIdx(lvl.index)}
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.96 }}
                  className={cn(
                    "rounded-2xl p-3 sm:p-4 text-center border-2 shadow-[0_6px_0_0_rgba(58,36,23,0.3)]",
                    "active:translate-y-[3px] active:shadow-[0_3px_0_0_rgba(58,36,23,0.3)]",
                    "bg-gradient-to-br text-[var(--color-wood-dark)]",
                    game.gradient,
                    completed
                      ? "ring-4 ring-[var(--color-gold)]"
                      : "border-[var(--color-wood-dark)]/20",
                  )}
                >
                  <p className="text-3xl font-extrabold drop-shadow-[0_2px_0_rgba(255,255,255,0.4)]">
                    {lvl.index + 1}
                  </p>
                  <p className="mt-1 text-xs sm:text-sm font-bold leading-tight">
                    {lvl.title}
                  </p>
                  <div className="mt-2 flex justify-center">
                    <StarBurst stars={stars} size="sm" showEmpty />
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </AppShell>
    );
  }

  const level = game.levels[activeLevelIdx];
  return (
    <AppShell
      title={`${game.title} — Nivel ${activeLevelIdx + 1}`}
      emoji={game.emoji}
      backHref="#"
    >
      <button
        type="button"
        onClick={() => setActiveLevelIdx(null)}
        className="self-start ml-3 -mt-2 rounded-full bg-white/85 px-4 py-2 text-xs font-bold text-[var(--color-wood-dark)] shadow"
      >
        ← Niveles
      </button>
      <MinigameRunner game={game} level={level} onLevelChange={setActiveLevelIdx} />
    </AppShell>
  );
}
