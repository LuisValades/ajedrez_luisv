"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { GoalBoard } from "./GoalBoard";
import { TrophyModal } from "@/components/feedback/TrophyModal";
import { useCoach } from "@/components/coach/CoachContext";
import { useProgressStore } from "@/store/progressStore";
import { legalMovesForPiece, type CellState_ } from "@/lib/minigames/engine";
import type { MgGameDef, MgItemKind, MgLevel, MgObstacleKind } from "@/lib/minigames/types";

type Props = {
  game: MgGameDef;
  level: MgLevel;
  onLevelChange: (newIdx: number) => void;
};

type Item = { at: string; kind: MgItemKind };
type Obstacle = { at: string; kind: MgObstacleKind };

export function MinigameRunner({ game, level, onLevelChange }: Props) {
  const router = useRouter();
  const coach = useCoach();
  const recordMinigame = useProgressStore((s) => s.recordMinigame);
  const [playerAt, setPlayerAt] = useState(level.player.at);
  const [items, setItems] = useState<Item[]>(level.items);
  const [obstacles, setObstacles] = useState<Obstacle[]>(level.obstacles);
  const [moves, setMoves] = useState(0);
  const [outcome, setOutcome] = useState<null | "win" | "lose">(null);
  const [stars, setStars] = useState(0);
  const greeted = useRef<{ id: string; idx: number } | null>(null);

  // Reset state when level changes (set-state-during-render pattern).
  const [trackedLevelIdx, setTrackedLevelIdx] = useState(level.index);
  if (trackedLevelIdx !== level.index) {
    setTrackedLevelIdx(level.index);
    setPlayerAt(level.player.at);
    setItems(level.items);
    setObstacles(level.obstacles);
    setMoves(0);
    setOutcome(null);
    setStars(0);
  }

  useEffect(() => {
    const key = { id: game.id, idx: level.index };
    if (greeted.current && greeted.current.id === key.id && greeted.current.idx === key.idx) return;
    greeted.current = key;
    coach.say({
      text: `${level.title}. ${level.hint}`,
      durationMs: 5500,
    });
  }, [coach, game.id, level.index, level.title, level.hint]);

  // Build cell state map for engine.
  const cellState = useMemo(() => {
    const m = new Map<string, CellState_>();
    for (const it of items) {
      m.set(it.at, { blocked: false, blocksPath: true });
    }
    for (const o of obstacles) {
      if (o.kind === "fire" || o.kind === "rock") {
        m.set(o.at, { blocked: true, blocksPath: true });
      } else if (o.kind === "enemy-pawn") {
        // Enemy pawn: pawn-player can capture diagonally; for slide pieces it's blocking-of-path obstacle (capturable)
        m.set(o.at, { blocked: false, blocksPath: true });
      }
    }
    return m;
  }, [items, obstacles]);

  const legalMoves = useMemo(() => {
    if (outcome) return [];
    const allMoves = legalMovesForPiece(
      level.player.kind,
      playerAt,
      cellState,
      "w",
    );
    // Pawn special-case: pawn can only go forward to empty cell, diagonal only to enemy.
    if (level.player.kind === "p") {
      return allMoves.filter((target) => {
        const fileDiff = Math.abs(target.charCodeAt(0) - playerAt.charCodeAt(0));
        const isDiag = fileDiff === 1;
        const cell = cellState.get(target);
        // forward (no diagonal): must be empty
        if (!isDiag) return !cell;
        // diagonal: must capture enemy pawn
        const obs = obstacles.find((o) => o.at === target);
        return obs?.kind === "enemy-pawn";
      });
    }
    return allMoves;
  }, [level.player.kind, playerAt, cellState, outcome, obstacles]);

  const goalTarget = level.goal.kind === "reach" ? level.goal.target : undefined;

  const finalize = (won: boolean, totalMoves: number) => {
    if (won) {
      let s = 1;
      if (totalMoves <= level.threeStarMoves) s = 3;
      else if (totalMoves <= level.twoStarMoves) s = 2;
      setStars(s);
      setOutcome("win");
      recordMinigame(game.id, level.index, s);
      coach.celebrate(
        s === 3
          ? "¡Tres estrellas! ¡Increíble!"
          : s === 2
            ? "¡Bien hecho! Casi tres estrellas."
            : "¡Lo lograste! Sigue practicando.",
      );
    } else {
      setOutcome("lose");
      coach.say({
        text: "¡Casi! Inténtalo otra vez con menos jugadas.",
        durationMs: 4000,
        state: "thinking",
      });
    }
  };

  const handleTap = (square: string) => {
    if (outcome) return;
    if (!legalMoves.includes(square)) return;

    // Apply move
    const remainingItems = items.filter((it) => it.at !== square);
    const remainingObstacles = obstacles.filter((o) => {
      // Captured enemy pawn at destination → remove
      return !(o.at === square && o.kind === "enemy-pawn");
    });
    setItems(remainingItems);
    setObstacles(remainingObstacles);
    setPlayerAt(square);
    const newMoves = moves + 1;
    setMoves(newMoves);

    // Win check
    let won = false;
    if (level.goal.kind === "collect-all" && remainingItems.length === 0) {
      won = true;
    } else if (level.goal.kind === "reach" && square === level.goal.target) {
      won = true;
    } else if (
      level.goal.kind === "collect-then-reach" &&
      remainingItems.length === 0 &&
      square === level.goal.target
    ) {
      won = true;
    }

    if (won) {
      finalize(true, newMoves);
      return;
    }

    if (newMoves >= level.maxMoves) {
      finalize(false, newMoves);
    }
  };

  const reset = () => {
    setPlayerAt(level.player.at);
    setItems(level.items);
    setObstacles(level.obstacles);
    setMoves(0);
    setOutcome(null);
    setStars(0);
  };

  const nextLevelIdx = level.index + 1 < game.levels.length ? level.index + 1 : null;

  return (
    <div className="w-full flex flex-col items-center gap-3 sm:gap-4">
      <div className="w-full max-w-[640px] flex items-center justify-between gap-2">
        <div className="rounded-2xl bg-white/85 px-3 py-2 text-sm font-bold text-[var(--color-wood-dark)] shadow flex items-center gap-2">
          <span aria-hidden className="text-xl">{game.emoji}</span>
          <span>Nivel {level.index + 1}/{game.levels.length}</span>
        </div>
        <div className="rounded-2xl bg-white/85 px-3 py-2 text-xs sm:text-sm font-semibold text-[var(--color-wood-dark)]/80 shadow">
          Jugadas: {moves} / {level.maxMoves}
        </div>
      </div>

      <h2 className="text-xl sm:text-2xl font-bold text-[var(--color-wood-dark)] text-center">
        {level.title}
      </h2>
      <p className="text-sm text-[var(--color-wood-dark)]/75 text-center max-w-[640px] -mt-1">
        🎯 {level.hint}
      </p>

      <div className="w-full">
        <GoalBoard
          player={{ kind: level.player.kind, at: playerAt, color: level.player.color }}
          items={items}
          obstacles={obstacles}
          legalMoves={legalMoves}
          goalTarget={goalTarget}
          onTap={handleTap}
        />
      </div>

      <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={reset}
          className="min-w-[110px] min-h-[60px] rounded-2xl bg-white text-[var(--color-wood-dark)] px-4 py-2 text-sm font-bold shadow-[0_4px_0_0_rgba(58,36,23,0.35)] active:translate-y-[3px] active:shadow-[0_1px_0_0_rgba(58,36,23,0.35)] flex flex-col items-center"
        >
          <span aria-hidden className="text-2xl leading-none">🔁</span>
          <span>Reiniciar</span>
        </button>
        {level.index > 0 && (
          <button
            type="button"
            onClick={() => onLevelChange(level.index - 1)}
            className="min-w-[110px] min-h-[60px] rounded-2xl bg-white text-[var(--color-wood-dark)] px-4 py-2 text-sm font-bold shadow-[0_4px_0_0_rgba(58,36,23,0.35)] active:translate-y-[3px] active:shadow-[0_1px_0_0_rgba(58,36,23,0.35)] flex flex-col items-center"
          >
            <span aria-hidden className="text-2xl leading-none">⬅️</span>
            <span>Anterior</span>
          </button>
        )}
        {nextLevelIdx !== null && (
          <button
            type="button"
            onClick={() => onLevelChange(nextLevelIdx)}
            className="min-w-[110px] min-h-[60px] rounded-2xl bg-[var(--color-success)] text-white px-4 py-2 text-sm font-bold shadow-[0_4px_0_0_rgba(58,36,23,0.4)] active:translate-y-[3px] active:shadow-[0_1px_0_0_rgba(58,36,23,0.4)] flex flex-col items-center"
          >
            <span aria-hidden className="text-2xl leading-none">➡️</span>
            <span>Siguiente</span>
          </button>
        )}
      </div>

      {outcome === "win" && (
        <TrophyModal
          open
          emoji={game.emoji}
          title="¡Nivel completado!"
          subtitle={`${game.title} · Nivel ${level.index + 1}`}
          stars={stars}
          totalStars={3}
          primaryLabel={
            nextLevelIdx !== null ? "Siguiente nivel →" : "Volver al juego"
          }
          onPrimary={() => {
            if (nextLevelIdx !== null) onLevelChange(nextLevelIdx);
            else router.push(`/minijuegos`);
          }}
          secondaryLabel="Repetir"
          onSecondary={reset}
          tertiaryLabel="Inicio"
          onTertiary={() => router.push("/")}
        />
      )}
      {outcome === "lose" && (
        <TrophyModal
          open
          emoji="💔"
          title="Casi casi"
          subtitle="Te quedaste sin jugadas. ¡Otra vez!"
          stars={0}
          totalStars={3}
          primaryLabel="Reiniciar"
          onPrimary={reset}
          secondaryLabel="Lista"
          onSecondary={() => router.push(`/minijuegos`)}
          tertiaryLabel="Inicio"
          onTertiary={() => router.push("/")}
        />
      )}
    </div>
  );
}
