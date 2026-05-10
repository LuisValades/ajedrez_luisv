"use client";

import { useGameStore } from "@/store/gameStore";
import { isCheck, isGameOver, getTurn } from "@/lib/chessEngine";
import { Chess } from "chess.js";

export function StatusBar() {
  const { fen, history } = useGameStore();
  const turn = getTurn(fen);
  const check = isCheck(fen);
  const game = new Chess(fen);
  const over = isGameOver(fen);
  const isMate = game.isCheckmate();
  const isDraw = game.isDraw();

  let statusEmoji = turn === "w" ? "⚪" : "⚫";
  let statusText = turn === "w" ? "Turno: Blancas" : "Turno: Negras";
  let statusColor = "text-[var(--color-wood-dark)]";

  if (over) {
    if (isMate) {
      statusEmoji = "🏆";
      statusText = `¡Jaque mate! Ganan ${turn === "w" ? "las negras" : "las blancas"}`;
      statusColor = "text-[var(--color-danger)]";
    } else if (isDraw) {
      statusEmoji = "🤝";
      statusText = "Tablas — empate";
      statusColor = "text-[var(--color-wood-dark)]";
    }
  } else if (check) {
    statusEmoji = "⚡";
    statusText = `¡Jaque a ${turn === "w" ? "las blancas" : "las negras"}!`;
    statusColor = "text-[var(--color-danger)]";
  }

  const moveCount = Math.max(0, history.length - 1);

  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl bg-white/80 px-4 py-3 shadow-[0_4px_0_0_rgba(58,36,23,0.25)]">
      <div className="flex items-center gap-2">
        <span className="text-2xl" aria-hidden>
          {statusEmoji}
        </span>
        <span className={`font-bold text-base sm:text-lg ${statusColor}`}>
          {statusText}
        </span>
      </div>
      <div className="text-sm font-semibold text-[var(--color-wood-dark)]/70">
        Jugadas: {moveCount}
      </div>
    </div>
  );
}
