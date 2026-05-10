"use client";

import { Loader2 } from "lucide-react";
import { Chess } from "chess.js";
import type { LevelConfig } from "@/lib/stockfish/levels";
import type { Color } from "@/lib/chessEngine";

type PartidaStatusProps = {
  fen: string;
  level: LevelConfig;
  playerColor: Color;
  iaThinking: boolean;
};

export function PartidaStatus({
  fen,
  level,
  playerColor,
  iaThinking,
}: PartidaStatusProps) {
  const game = new Chess(fen);
  const turn: Color = game.turn();
  const inCheck = game.inCheck();
  const isMate = game.isCheckmate();
  const isStalemate = game.isStalemate();
  const isDraw = game.isDraw();

  let statusText = "";
  let statusEmoji = "";
  let statusClass = "text-[var(--color-wood-dark)]";

  const playerTurn = turn === playerColor;

  if (isMate) {
    statusEmoji = "🏆";
    statusText = playerTurn ? "Te dieron mate" : "¡Jaque mate!";
    statusClass = "text-[var(--color-danger)]";
  } else if (isStalemate) {
    statusEmoji = "🤝";
    statusText = "Tablas — ahogado";
  } else if (isDraw) {
    statusEmoji = "🤝";
    statusText = "Tablas";
  } else if (inCheck) {
    statusEmoji = "⚡";
    statusText = playerTurn ? "¡Jaque a tu rey!" : `¡Jaque a ${level.name}!`;
    statusClass = "text-[var(--color-danger)]";
  } else if (iaThinking) {
    statusEmoji = level.emoji;
    statusText = `${level.name} está pensando...`;
  } else {
    statusEmoji = playerTurn ? "✨" : level.emoji;
    statusText = playerTurn ? "Tu turno" : `Turno de ${level.name}`;
  }

  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl bg-white/80 px-4 py-3 shadow-[0_4px_0_0_rgba(58,36,23,0.25)]">
      <div className="flex items-center gap-2">
        <span className="text-2xl" aria-hidden>
          {statusEmoji}
        </span>
        <span className={`font-bold text-base sm:text-lg ${statusClass}`}>
          {statusText}
        </span>
        {iaThinking && (
          <Loader2 size={18} className="animate-spin text-[var(--color-wood-dark)]/60" />
        )}
      </div>
      <div className="text-xs sm:text-sm font-semibold text-[var(--color-wood-dark)]/70">
        VS {level.emoji} {level.name}
      </div>
    </div>
  );
}
