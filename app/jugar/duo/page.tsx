"use client";

import { useEffect, useRef, useState } from "react";
import { Chess } from "chess.js";
import {
  Eye,
  EyeOff,
  FlipHorizontal,
  Lightbulb,
  RotateCcw,
  ShieldAlert,
  Undo2,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { ChessBoard } from "@/components/board/ChessBoard";
import { CapturedStrip } from "@/components/partida/CapturedStrip";
import { useCoach } from "@/components/coach/CoachContext";
import { isCheck, STARTING_FEN, type Color, type MoveResult, type Square } from "@/lib/chessEngine";
import { PIECE_NAMES_ES } from "@/components/board/Pieces";
import { sfx } from "@/lib/audio/sfx";
import { SkinBar } from "@/components/board/SkinBar";
import { cn } from "@/lib/utils";

type HistoryEntry = {
  fen: string;
  from?: Square;
  to?: Square;
  captured?: string;
  san?: string;
};

const initialEntry: HistoryEntry = { fen: STARTING_FEN };

const CAPTURE_LINES = [
  "¡Buena captura!",
  "¡Te volaste una pieza!",
  "¡Súper movida!",
  "¡A comer!",
];

export default function DuoPage() {
  const coach = useCoach();
  const [history, setHistory] = useState<HistoryEntry[]>([initialEntry]);
  const [orientation, setOrientation] = useState<Color>("w");
  const [showHints, setShowHints] = useState(true);
  const [showThreats, setShowThreats] = useState(true);
  const [showCoordinates, setShowCoordinates] = useState(false);
  const [autoFlip, setAutoFlip] = useState(false);
  const [coachOn, setCoachOn] = useState(true);
  const greeted = useRef(false);

  const fen = history[history.length - 1].fen;
  const lastMoveEntry = history[history.length - 1];
  const lastMove =
    lastMoveEntry.from && lastMoveEntry.to
      ? { from: lastMoveEntry.from, to: lastMoveEntry.to }
      : null;
  const turn: Color = fen.split(" ")[1] === "b" ? "b" : "w";

  useEffect(() => {
    if (greeted.current) return;
    greeted.current = true;
    coach.say({
      text: "¡Modo dos jugadoras! Túrnense en el mismo dispositivo. Las blancas mueven primero.",
      durationMs: 6000,
    });
  }, [coach]);

  const sayIfOn = (text: string, opts?: { durationMs?: number; state?: "talking" | "thinking" | "celebrating" }) => {
    if (!coachOn) return;
    coach.say({ text, ...opts });
  };

  const handleMove = (result: MoveResult) => {
    if (!result.ok) return;
    const moverColor: Color = turn; // turn before move == player who just moved
    const next: HistoryEntry = {
      fen: result.newFen,
      from: result.from,
      to: result.to,
      captured: result.captured,
      san: result.san,
    };
    setHistory((h) => [...h, next]);

    // Auto-flip board to face the next player.
    if (autoFlip) {
      setTimeout(() => setOrientation(moverColor === "w" ? "b" : "w"), 360);
    }

    // SFX
    if (result.captured) sfx.play("capture");
    else sfx.play("move");

    // Coach reactions
    const post = new Chess(result.newFen);
    if (post.isCheckmate()) {
      sfx.play("win");
      const winner = moverColor === "w" ? "blancas" : "negras";
      coach.celebrate(`¡Jaque mate! ¡Ganan las ${winner}!`);
      return;
    }
    if (post.isStalemate()) {
      sayIfOn("¡Tablas por ahogado! Nadie puede mover.", { durationMs: 4000, state: "thinking" });
      return;
    }
    if (post.isDraw()) {
      sayIfOn("¡Tablas! Es empate.", { durationMs: 3500, state: "thinking" });
      return;
    }
    if (isCheck(result.newFen)) {
      sfx.play("check");
      const inCheckSide = moverColor === "w" ? "negras" : "blancas";
      sayIfOn(`¡Jaque! Cuídate, ${inCheckSide}.`, { durationMs: 2800 });
      return;
    }
    if (result.captured) {
      const pieceName =
        PIECE_NAMES_ES[result.captured as keyof typeof PIECE_NAMES_ES] ?? "pieza";
      const line = CAPTURE_LINES[Math.floor(Math.random() * CAPTURE_LINES.length)];
      sayIfOn(`${line} Comieron un ${pieceName}.`, { durationMs: 2800 });
      return;
    }
    if (autoFlip) {
      const nextSide = moverColor === "w" ? "negras" : "blancas";
      sayIfOn(`Turno de las ${nextSide}.`, { durationMs: 2200 });
    }
  };

  const handleUndo = () => {
    if (history.length <= 1) return;
    setHistory((h) => h.slice(0, -1));
    if (autoFlip) {
      setOrientation((o) => (o === "w" ? "b" : "w"));
    }
    sayIfOn("¡Va, deshecho!", { durationMs: 1800 });
  };

  const handleReset = () => {
    if (
      history.length > 1 &&
      typeof window !== "undefined" &&
      !window.confirm("¿Empezar partida nueva? Se borra esta.")
    ) {
      return;
    }
    setHistory([initialEntry]);
    setOrientation("w");
    sayIfOn("Partida nueva. ¡Empiezan las blancas!", { durationMs: 3000 });
  };

  // Status bar
  const game = new Chess(fen);
  const inCheck = game.inCheck();
  let statusEmoji = turn === "w" ? "⚪" : "⚫";
  let statusText = turn === "w" ? "Turno: Blancas" : "Turno: Negras";
  let statusColor = "text-[var(--color-wood-dark)]";
  if (game.isCheckmate()) {
    statusEmoji = "🏆";
    statusText = `¡Jaque mate! Ganan ${turn === "w" ? "las negras" : "las blancas"}`;
    statusColor = "text-[var(--color-danger)]";
  } else if (game.isStalemate()) {
    statusEmoji = "🤝";
    statusText = "Tablas — ahogado";
  } else if (game.isDraw()) {
    statusEmoji = "🤝";
    statusText = "Tablas";
  } else if (inCheck) {
    statusEmoji = "⚡";
    statusText = `¡Jaque a ${turn === "w" ? "las blancas" : "las negras"}!`;
    statusColor = "text-[var(--color-danger)]";
  }

  const moveCount = Math.max(0, history.length - 1);

  return (
    <AppShell title="Dos Jugadoras" emoji="👫" coachPosition="bottom-right">
      <div className="w-full max-w-[680px] flex flex-col gap-3">
        {/* Status */}
        <div className="rounded-2xl bg-white/85 px-4 py-3 shadow-[0_4px_0_0_rgba(58,36,23,0.25)] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span aria-hidden className="text-2xl">{statusEmoji}</span>
            <span className={cn("font-bold text-base sm:text-lg", statusColor)}>
              {statusText}
            </span>
          </div>
          <span className="text-xs sm:text-sm font-semibold text-[var(--color-wood-dark)]/70">
            Jugadas: {moveCount}
          </span>
        </div>

        <CapturedStrip fen={fen} />

        {/* Skin chooser — always visible */}
        <SkinBar variant="full" />

        {/* Toggles row — all visual aids */}
        <div className="flex flex-wrap justify-center gap-2">
          <Toggle
            label="Pistas"
            emoji="💡"
            icon={<Lightbulb size={14} />}
            active={showHints}
            onClick={() => setShowHints((v) => !v)}
          />
          <Toggle
            label="Avisos"
            emoji="⚠️"
            icon={<ShieldAlert size={14} />}
            active={showThreats}
            onClick={() => setShowThreats((v) => !v)}
          />
          <Toggle
            label="Letras"
            emoji="🔤"
            icon={showCoordinates ? <Eye size={14} /> : <EyeOff size={14} />}
            active={showCoordinates}
            onClick={() => setShowCoordinates((v) => !v)}
          />
          <Toggle
            label="Voltear auto"
            emoji="🔁"
            icon={<FlipHorizontal size={14} />}
            active={autoFlip}
            onClick={() => setAutoFlip((v) => !v)}
          />
          <Toggle
            label="Voz Drako"
            emoji="🐲"
            icon={<span className="text-[14px]">🗣️</span>}
            active={coachOn}
            onClick={() => {
              setCoachOn((v) => !v);
              if (coachOn) coach.hush();
            }}
          />
        </div>
      </div>

      {/* Board */}
      <div className="w-full">
        <ChessBoard
          fen={fen}
          orientation={orientation}
          showHints={showHints}
          showThreats={showThreats}
          showCoordinates={showCoordinates}
          interactive
          lastMove={lastMove}
          onMove={handleMove}
        />
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
        <ActionButton
          label="Deshacer"
          emoji="↩️"
          icon={<Undo2 size={14} />}
          onClick={handleUndo}
          disabled={history.length <= 1}
        />
        <ActionButton
          label="Voltear"
          emoji="🔄"
          icon={<FlipHorizontal size={14} />}
          onClick={() => setOrientation((o) => (o === "w" ? "b" : "w"))}
        />
        <ActionButton
          label="Reiniciar"
          emoji="🆕"
          icon={<RotateCcw size={14} />}
          onClick={handleReset}
          variant="danger"
        />
      </div>

      <div className="w-full max-w-[680px] rounded-2xl bg-white/70 p-3 text-xs sm:text-sm text-[var(--color-wood-dark)]/85 shadow text-center">
        💡 Las pistas y avisos se pueden apagar para jugar con menos ayuda. El
        tablero se voltea automáticamente para que cada jugadora vea sus piezas
        del lado correcto.
      </div>
    </AppShell>
  );
}

function Toggle({
  label,
  emoji,
  icon,
  active,
  onClick,
}: {
  label: string;
  emoji: string;
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "min-h-[56px] min-w-[80px] flex flex-col items-center justify-center gap-0.5 rounded-2xl px-3 py-1.5 font-semibold text-xs",
        "shadow-[0_3px_0_0_rgba(58,36,23,0.35)] active:translate-y-[2px] active:shadow-[0_1px_0_0_rgba(58,36,23,0.35)]",
        active
          ? "bg-[var(--color-gold)] text-[var(--color-wood-dark)]"
          : "bg-white/80 text-[var(--color-wood-dark)]/60",
      )}
    >
      <span className="text-xl leading-none" aria-hidden>
        {emoji}
      </span>
      <span className="flex items-center gap-1 text-[11px]">
        {icon}
        <span>{label}</span>
      </span>
    </button>
  );
}

function ActionButton({
  label,
  emoji,
  icon,
  onClick,
  disabled = false,
  variant = "default",
}: {
  label: string;
  emoji: string;
  icon: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  variant?: "default" | "danger";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={cn(
        "min-w-[88px] min-h-[72px] flex flex-col items-center justify-center gap-1 rounded-2xl px-3 py-2 font-semibold text-sm",
        "shadow-[0_4px_0_0_rgba(58,36,23,0.45)] active:translate-y-[3px] active:shadow-[0_1px_0_0_rgba(58,36,23,0.45)]",
        disabled && "opacity-50 cursor-not-allowed active:translate-y-0",
        variant === "danger"
          ? "bg-[var(--color-danger)] text-white"
          : "bg-white/85 text-[var(--color-wood-dark)]",
      )}
    >
      <span className="text-2xl leading-none" aria-hidden>
        {emoji}
      </span>
      <span className="flex items-center gap-1 text-[13px]">
        {icon}
        <span>{label}</span>
      </span>
    </button>
  );
}
