"use client";

import { useEffect, useRef, useState } from "react";
import { Chess } from "chess.js";
import { Undo2 } from "lucide-react";
import { motion } from "framer-motion";
import { AppShell } from "@/components/layout/AppShell";
import { ChessBoard } from "@/components/board/ChessBoard";
import { CapturedStrip } from "@/components/partida/CapturedStrip";
import { useCoach } from "@/components/coach/CoachContext";
import { isCheck, STARTING_FEN, type Color, type MoveResult, type Square } from "@/lib/chessEngine";
import { PIECE_NAMES_ES } from "@/components/board/Pieces";
import { sfx } from "@/lib/audio/sfx";
import { cn } from "@/lib/utils";
import { useSettingsStore } from "@/store/settingsStore";
import { getTheme } from "@/lib/themes";
import { OptionsSheet, OptionRow, OptionAction, OptionDivider } from "@/components/ui/OptionsSheet";

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
      <div className="w-full max-w-[680px] flex flex-col gap-2">
        {/* Compact top strip: TurnChip + Deshacer + Ayudas trigger */}
        <div className="flex items-stretch gap-2">
          <div className="flex-1 min-w-0">
            <TurnChip
              turn={turn}
              statusEmoji={statusEmoji}
              statusText={statusText}
              statusColor={statusColor}
              moves={moveCount}
            />
          </div>
          <button
            type="button"
            onClick={handleUndo}
            disabled={history.length <= 1}
            aria-label="Deshacer última jugada"
            className={cn(
              "inline-flex items-center justify-center rounded-2xl px-3",
              "bg-white/85 text-[var(--color-wood-dark)] shadow-[0_3px_0_0_rgba(58,36,23,0.25)]",
              "active:translate-y-[1px] active:shadow-[0_1px_0_0_rgba(58,36,23,0.25)]",
              "border border-[var(--color-wood-dark)]/10",
              history.length <= 1 && "opacity-40 cursor-not-allowed active:translate-y-0",
            )}
          >
            <Undo2 size={20} />
          </button>
          <OptionsSheet
            label="Ayudas"
            title="Ayudas y opciones"
            activeCount={
              [showHints, showThreats, showCoordinates, autoFlip, coachOn].filter(
                Boolean,
              ).length
            }
            className="self-stretch"
          >
            <OptionRow
              label="Pistas"
              description="Marca casillas legales al tocar pieza"
              emoji="💡"
              active={showHints}
              onClick={() => setShowHints((v) => !v)}
            />
            <OptionRow
              label="Avisos de peligro"
              description="Resalta piezas amenazadas"
              emoji="⚠️"
              active={showThreats}
              onClick={() => setShowThreats((v) => !v)}
            />
            <OptionRow
              label="Letras y números"
              description="Coordenadas a–h, 1–8 en el tablero"
              emoji="🔤"
              active={showCoordinates}
              onClick={() => setShowCoordinates((v) => !v)}
            />
            <OptionRow
              label="Voltear automático"
              description="Gira el tablero al cambiar de turno"
              emoji="🔁"
              active={autoFlip}
              onClick={() => setAutoFlip((v) => !v)}
            />
            <OptionRow
              label="Voz de Drako"
              description="Habla y celebra tus jugadas"
              emoji="🐲"
              active={coachOn}
              onClick={() => {
                setCoachOn((v) => !v);
                if (coachOn) coach.hush();
              }}
            />

            <OptionDivider label="Acciones" />

            <OptionAction
              label="Voltear ahora"
              description="Gira el tablero una vez"
              emoji="🔄"
              onClick={() => setOrientation((o) => (o === "w" ? "b" : "w"))}
            />
            <OptionAction
              label="Reiniciar partida"
              description="Empieza de cero (pierdes esta partida)"
              emoji="🆕"
              variant="danger"
              onClick={handleReset}
            />
          </OptionsSheet>
        </div>

        <CapturedStrip fen={fen} />
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
    </AppShell>
  );
}

function TurnChip({
  turn,
  statusEmoji,
  statusText,
  statusColor,
  moves,
}: {
  turn: Color;
  statusEmoji: string;
  statusText: string;
  statusColor: string;
  moves: number;
}) {
  const themeId = useSettingsStore((s) => s.themeId);
  const theme = getTheme(themeId);
  const sidePalette = turn === "w" ? theme.player1 : theme.player2;
  return (
    <div className="h-full rounded-2xl bg-white/90 px-3 py-2 shadow-[0_4px_0_0_rgba(58,36,23,0.25)] flex items-center gap-2.5 min-w-0">
      <motion.span
        key={turn}
        aria-hidden
        initial={{ scale: 0.85 }}
        animate={{ scale: [0.85, 1.08, 1] }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="inline-flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full border-[3px] shadow-inner"
        style={{
          background: sidePalette.fill,
          borderColor: sidePalette.stroke,
        }}
      />
      <div className="min-w-0 flex-1">
        <p className={cn("font-bold text-[13px] sm:text-base leading-tight truncate", statusColor)}>
          <span aria-hidden className="mr-1">{statusEmoji}</span>
          {statusText}
        </p>
        <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-wood-dark)]/55">
          {moves} {moves === 1 ? "jugada" : "jugadas"}
        </p>
      </div>
    </div>
  );
}

