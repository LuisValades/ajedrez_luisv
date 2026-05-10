"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ChessBoard } from "@/components/board/ChessBoard";
import { TrophyModal } from "@/components/feedback/TrophyModal";
import { useCoach } from "@/components/coach/CoachContext";
import { useProgressStore } from "@/store/progressStore";
import type { Lesson, LessonStep } from "@/lib/tutorial/types";
import type { Square } from "@/lib/chessEngine";
import { cn } from "@/lib/utils";

type Props = {
  lesson: Lesson;
};

const NARRATE_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

export function LessonRunner({ lesson }: Props) {
  const coach = useCoach();
  const router = useRouter();
  const completeLesson = useProgressStore((s) => s.completeLesson);
  const [stepIdx, setStepIdx] = useState(0);
  const [wrongTaps, setWrongTaps] = useState(0);
  const [completed, setCompleted] = useState(false);
  const lastNarratedRef = useRef<number>(-1);

  const step: LessonStep = lesson.steps[stepIdx];
  const total = lesson.steps.length;

  const fen = useMemo(() => {
    if ("fen" in step && step.fen) return step.fen;
    return NARRATE_FEN;
  }, [step]);

  const highlights = useMemo<Square[]>(() => {
    if (step.kind === "tap-piece") return [step.target];
    if (step.kind === "make-move") return [step.from];
    return [];
  }, [step]);

  const handleFinish = () => {
    if (completed) return;
    setCompleted(true);
    completeLesson(lesson.id);
    coach.celebrate(`¡${lesson.badge}! ${lesson.closingText}`);
  };

  // Narrate each step on entry.
  useEffect(() => {
    if (lastNarratedRef.current === stepIdx) return;
    lastNarratedRef.current = stepIdx;
    coach.say({
      text: step.text,
      durationMs: ("durationMs" in step && step.durationMs) ? step.durationMs : 6500,
    });
    setWrongTaps(0);
    if (step.kind === "narrate") {
      const ms = ("durationMs" in step && step.durationMs) ? step.durationMs : 5000;
      const t = setTimeout(() => {
        setStepIdx((idx) => {
          if (idx >= total - 1) {
            handleFinish();
            return idx;
          }
          return idx + 1;
        });
      }, ms);
      return () => clearTimeout(t);
    }
  }, [stepIdx]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSquareTap = (square: Square) => {
    if (step.kind !== "tap-piece") return;
    if (square === step.target) {
      coach.say({ text: "¡Eso es! Súper bien.", durationMs: 1800, state: "celebrating" });
      setTimeout(() => {
        if (stepIdx < total - 1) setStepIdx(stepIdx + 1);
        else handleFinish();
      }, 800);
    } else {
      setWrongTaps((w) => w + 1);
      coach.say({ text: "Esa no es. ¡Mira la casilla que parpadea!", durationMs: 2500 });
    }
  };

  const handleMove = (result: { ok: boolean; from?: string; to?: string; newFen: string }) => {
    if (!result.ok || step.kind !== "make-move") return false;
    if (result.from === step.from && step.to.includes(result.to as Square)) {
      coach.celebrate("¡Buenísimo!");
      setTimeout(() => {
        if (stepIdx < total - 1) setStepIdx(stepIdx + 1);
        else handleFinish();
      }, 900);
      return true;
    }
    setWrongTaps((w) => w + 1);
    if (wrongTaps + 1 >= 2 && step.pista) {
      coach.say({ text: step.pista, durationMs: 4000, state: "thinking" });
    } else {
      coach.say({ text: "No es ahí. ¡Inténtalo otra vez!", durationMs: 2500 });
    }
    return false;
  };

  const isInteractive = step.kind === "tap-piece" || step.kind === "make-move";
  const playableColor: "w" | "b" | undefined =
    step.kind === "make-move" || step.kind === "tap-piece" ? "w" : undefined;

  return (
    <div className="w-full flex flex-col items-center gap-3 sm:gap-4">
      <div className="w-full max-w-[640px] flex items-center justify-between gap-3">
        <div className="rounded-2xl bg-white/85 px-4 py-2 text-xs sm:text-sm font-bold text-[var(--color-wood-dark)] shadow">
          Paso {stepIdx + 1} / {total}
        </div>
        <div className="flex-1 mx-2 h-2.5 rounded-full bg-white/60 overflow-hidden shadow-inner">
          <div
            className="h-full rounded-full bg-[var(--color-success)] transition-all"
            style={{ width: `${((stepIdx + 1) / total) * 100}%` }}
          />
        </div>
      </div>

      <div className="w-full max-w-[640px] rounded-2xl bg-white/90 px-4 py-3 shadow-[0_4px_0_0_rgba(58,36,23,0.25)] text-base sm:text-lg font-semibold text-[var(--color-wood-dark)] leading-snug min-h-[60px]">
        {step.text}
      </div>

      <div className="w-full">
        <ChessBoardWithTaps
          fen={fen}
          interactive={isInteractive}
          playableColor={playableColor}
          highlightSquares={highlights}
          tapMode={step.kind === "tap-piece"}
          onTap={handleSquareTap}
          onMove={handleMove}
        />
      </div>

      <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
        {step.kind === "narrate" && (
          <button
            type="button"
            onClick={() => {
              if (stepIdx < total - 1) setStepIdx(stepIdx + 1);
              else handleFinish();
            }}
            className="rounded-2xl bg-[var(--color-success)] text-white px-6 py-3 text-base font-bold shadow-[0_5px_0_0_rgba(58,36,23,0.4)] active:translate-y-[3px] active:shadow-[0_2px_0_0_rgba(58,36,23,0.4)]"
          >
            Siguiente →
          </button>
        )}
        {stepIdx > 0 && (
          <button
            type="button"
            onClick={() => setStepIdx(Math.max(0, stepIdx - 1))}
            className="rounded-2xl bg-white text-[var(--color-wood-dark)] px-4 py-3 text-sm font-bold shadow-[0_4px_0_0_rgba(58,36,23,0.3)] active:translate-y-[2px] active:shadow-[0_2px_0_0_rgba(58,36,23,0.3)]"
          >
            ← Atrás
          </button>
        )}
      </div>

      {completed && (
        <TrophyModal
          open
          emoji={lesson.emoji}
          title={`¡${lesson.title} completada!`}
          subtitle={lesson.badge}
          stars={3}
          totalStars={3}
          primaryLabel="Siguiente lección →"
          onPrimary={() => router.push("/tutorial")}
          secondaryLabel="Repetir"
          onSecondary={() => {
            setCompleted(false);
            setStepIdx(0);
          }}
          tertiaryLabel="Inicio"
          onTertiary={() => router.push("/")}
        />
      )}
    </div>
  );
}

function ChessBoardWithTaps({
  fen,
  interactive,
  playableColor,
  highlightSquares,
  tapMode,
  onTap,
  onMove,
}: {
  fen: string;
  interactive: boolean;
  playableColor?: "w" | "b";
  highlightSquares: Square[];
  tapMode: boolean;
  onTap: (sq: Square) => void;
  onMove: (r: { ok: boolean; from?: string; to?: string; newFen: string }) => boolean;
}) {
  return (
    <div className="relative">
      <ChessBoard
        fen={fen}
        interactive={interactive && !tapMode}
        playableColor={playableColor}
        showHints
        showThreats={false}
        onMove={(r) => {
          onMove(r);
        }}
      />
      {highlightSquares.length > 0 && (
        <HighlightOverlay squares={highlightSquares} />
      )}
      {tapMode && <TapOverlay onTap={onTap} />}
    </div>
  );
}

function HighlightOverlay({ squares }: { squares: Square[] }) {
  // Convert each square to grid coordinates and render a pulsing ring.
  return (
    <div className="pointer-events-none absolute inset-0">
      <div className="absolute inset-2 sm:inset-3 p-1.5 sm:p-2">
        <div className="relative w-full h-full">
          <div className="grid grid-cols-8 grid-rows-8 absolute inset-0">
            {Array.from({ length: 64 }).map((_, i) => {
              const file = i % 8;
              const rank = Math.floor(i / 8);
              const sq = `${"abcdefgh"[file]}${8 - rank}` as Square;
              const on = squares.includes(sq);
              return (
                <div key={i} className="relative">
                  {on && (
                    <span
                      className={cn(
                        "absolute inset-1 rounded-md ring-4 ring-[var(--color-gold)]",
                        "dot-hint",
                      )}
                      style={{ boxShadow: "0 0 18px rgba(245,197,24,0.7)" }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function TapOverlay({ onTap }: { onTap: (sq: Square) => void }) {
  // 8x8 grid of transparent buttons over the board for tap-piece detection.
  // We mount this only for tap-piece steps, where ChessBoard is also interactive
  // but the user is asked to tap a specific square.
  return (
    <div className="pointer-events-none absolute inset-0">
      <div className="absolute inset-2 sm:inset-3 p-1.5 sm:p-2">
        <div className="grid grid-cols-8 grid-rows-8 w-full h-full pointer-events-auto">
          {Array.from({ length: 64 }).map((_, i) => {
            const file = i % 8;
            const rank = Math.floor(i / 8);
            const sq = `${"abcdefgh"[file]}${8 - rank}` as Square;
            return (
              <button
                key={i}
                type="button"
                aria-label={`Casilla ${sq}`}
                onClick={() => onTap(sq)}
                className="opacity-0"
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
