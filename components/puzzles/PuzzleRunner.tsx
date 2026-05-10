"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Chess } from "chess.js";
import { ChessBoard } from "@/components/board/ChessBoard";
import { TrophyModal } from "@/components/feedback/TrophyModal";
import { useCoach } from "@/components/coach/CoachContext";
import { useProgressStore } from "@/store/progressStore";
import { THEME_META, type Puzzle, nextPuzzleId } from "@/lib/puzzles/loader";
import type { Square, MoveResult } from "@/lib/chessEngine";

type Props = {
  puzzle: Puzzle;
};

export function PuzzleRunner({ puzzle }: Props) {
  const coach = useCoach();
  const router = useRouter();
  const recordPuzzle = useProgressStore((s) => s.recordPuzzle);
  const [fen, setFen] = useState(puzzle.fen);
  const [moveIdx, setMoveIdx] = useState(0);
  const [tries, setTries] = useState(0);
  const [hint, setHint] = useState<{ from: Square; to: Square } | null>(null);
  const [revealedSolution, setRevealedSolution] = useState(false);
  const [solved, setSolved] = useState(false);
  const greeted = useRef(false);
  const meta = THEME_META[puzzle.tema];
  const playerColor: "w" | "b" = puzzle.lado === "blancas" ? "w" : "b";
  const [lastMove, setLastMove] = useState<{ from: Square; to: Square } | null>(null);

  useEffect(() => {
    if (greeted.current) return;
    greeted.current = true;
    coach.say({
      text: `${meta.label}: ${puzzle.titulo}. ${puzzle.pista_voz}`,
      durationMs: 6500,
    });
  }, [coach, meta.label, puzzle]);

  // Compute hint (from chess.js by parsing the SAN expected next).
  const computeExpected = useMemo(() => {
    return (currentFen: string, san: string): { from: Square; to: Square } | null => {
      const probe = new Chess(currentFen);
      const m = probe.move(san);
      if (!m) return null;
      return { from: m.from as Square, to: m.to as Square };
    };
  }, []);

  const handleHint = () => {
    const expected = puzzle.solucion[moveIdx];
    if (!expected) return;
    const arrow = computeExpected(fen, expected);
    if (!arrow) {
      coach.say({ text: "Ups, esto se atoró. Intenta tú.", durationMs: 2500 });
      return;
    }
    setHint(arrow);
    coach.say({
      text: "Mira la flecha azul, ahí va una buena.",
      durationMs: 3500,
      state: "thinking",
    });
    setTimeout(() => setHint(null), 4500);
  };

  const playSolution = () => {
    setRevealedSolution(true);
    coach.say({
      text: "Te muestro la solución, mira con calma.",
      durationMs: 3500,
      state: "thinking",
    });
    let cur = puzzle.fen;
    let idx = 0;
    const playNext = () => {
      const san = puzzle.solucion[idx];
      if (!san) {
        setTimeout(() => finalize(0), 600);
        return;
      }
      const probe = new Chess(cur);
      const m = probe.move(san);
      if (!m) return;
      cur = probe.fen();
      setLastMove({ from: m.from as Square, to: m.to as Square });
      setFen(cur);
      idx += 1;
      setMoveIdx(idx);
      setTimeout(playNext, 1100);
    };
    setTimeout(playNext, 1000);
  };

  const finalize = (stars: number) => {
    setSolved(true);
    recordPuzzle(puzzle.id, stars, tries);
    if (stars > 0) {
      coach.celebrate("¡Lo lograste! ⭐".repeat(stars));
    } else {
      coach.say({
        text: "¡Bien hecho! La próxima vez la sacas a la primera.",
        state: "thinking",
        durationMs: 4000,
      });
    }
  };

  const handleMove = (result: MoveResult) => {
    if (!result.ok) return;
    const expected = puzzle.solucion[moveIdx];
    const probe = new Chess(fen);
    const m = probe.move(expected);
    const correctTo = m?.to;
    const correctFrom = m?.from;
    const wasCorrect = result.from === correctFrom && result.to === correctTo;

    if (!wasCorrect) {
      // Roll back: restore previous fen visually since result.newFen reflects player's wrong move
      setTries((t) => t + 1);
      setTimeout(() => {
        setFen(fen);
        const newTries = tries + 1;
        if (newTries >= 3 && !revealedSolution) {
          playSolution();
        } else if (newTries >= 2) {
          coach.say({
            text: puzzle.pista_voz,
            durationMs: 4000,
            state: "thinking",
          });
        } else {
          coach.say({
            text: "Esa no es. ¡Otra vez!",
            durationMs: 2500,
          });
        }
      }, 350);
      return;
    }

    // Correct!
    setLastMove({ from: result.from!, to: result.to! });
    setFen(result.newFen);
    const nextIdx = moveIdx + 1;
    setMoveIdx(nextIdx);

    if (nextIdx >= puzzle.solucion.length) {
      // Finished — calculate stars
      let stars = 3;
      if (tries === 1) stars = 2;
      else if (tries >= 2) stars = 1;
      if (revealedSolution) stars = Math.min(stars, 1);
      finalize(stars);
      return;
    }

    // If solution has more moves (player + opponent reply), play opponent reply.
    setTimeout(() => {
      const opponentSan = puzzle.solucion[nextIdx];
      if (!opponentSan) return;
      const probe2 = new Chess(result.newFen);
      const opp = probe2.move(opponentSan);
      if (!opp) return;
      setLastMove({ from: opp.from as Square, to: opp.to as Square });
      setFen(probe2.fen());
      setMoveIdx(nextIdx + 1);
      if (nextIdx + 1 >= puzzle.solucion.length) {
        let stars = 3;
        if (tries === 1) stars = 2;
        else if (tries >= 2) stars = 1;
        if (revealedSolution) stars = Math.min(stars, 1);
        finalize(stars);
      }
    }, 700);
  };

  const onRetry = () => {
    setFen(puzzle.fen);
    setMoveIdx(0);
    setTries(0);
    setHint(null);
    setRevealedSolution(false);
    setSolved(false);
    setLastMove(null);
  };

  const next = nextPuzzleId(puzzle.id);

  return (
    <div className="w-full flex flex-col items-center gap-3 sm:gap-4">
      <div className="w-full max-w-[640px] flex items-center justify-between">
        <div className="rounded-2xl bg-white/85 px-4 py-2 text-sm font-bold text-[var(--color-wood-dark)] shadow flex items-center gap-2">
          <span aria-hidden className="text-xl">{meta.emoji}</span>
          <span>{meta.label}</span>
        </div>
        <div className="rounded-2xl bg-white/85 px-3 py-2 text-xs sm:text-sm font-semibold text-[var(--color-wood-dark)]/80 shadow">
          Intentos: {tries}
        </div>
      </div>

      <h2 className="text-xl sm:text-2xl font-bold text-[var(--color-wood-dark)] text-center">
        {puzzle.titulo}
      </h2>

      <div className="w-full">
        <ChessBoard
          fen={fen}
          orientation={playerColor}
          interactive={!solved && !revealedSolution}
          playableColor={playerColor}
          showHints
          showThreats={false}
          hintMove={hint}
          lastMove={lastMove}
          onMove={handleMove}
        />
      </div>

      <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={handleHint}
          disabled={solved || revealedSolution}
          className="min-w-[100px] min-h-[60px] rounded-2xl bg-[var(--color-hint)] text-white px-4 py-2 text-sm font-bold shadow-[0_4px_0_0_rgba(58,36,23,0.4)] active:translate-y-[3px] active:shadow-[0_1px_0_0_rgba(58,36,23,0.4)] disabled:opacity-50 flex flex-col items-center"
        >
          <span aria-hidden className="text-2xl leading-none">💡</span>
          <span>Pista</span>
        </button>
        <button
          type="button"
          onClick={onRetry}
          className="min-w-[100px] min-h-[60px] rounded-2xl bg-white text-[var(--color-wood-dark)] px-4 py-2 text-sm font-bold shadow-[0_4px_0_0_rgba(58,36,23,0.35)] active:translate-y-[3px] active:shadow-[0_1px_0_0_rgba(58,36,23,0.35)] flex flex-col items-center"
        >
          <span aria-hidden className="text-2xl leading-none">🔁</span>
          <span>Reiniciar</span>
        </button>
      </div>

      {solved && (
        <TrophyModal
          open
          emoji={meta.emoji}
          title="¡Puzzle resuelto!"
          subtitle={puzzle.titulo}
          stars={
            revealedSolution
              ? 1
              : tries === 0
                ? 3
                : tries === 1
                  ? 2
                  : 1
          }
          totalStars={3}
          primaryLabel={next ? "Siguiente puzzle →" : "Volver a la lista"}
          onPrimary={() => router.push(next ? `/puzzles/${next}` : "/puzzles")}
          secondaryLabel="Repetir"
          onSecondary={onRetry}
          tertiaryLabel="Inicio"
          onTertiary={() => router.push("/")}
        />
      )}
    </div>
  );
}
