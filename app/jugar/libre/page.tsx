"use client";

import { useEffect, useRef } from "react";
import { ChessBoard } from "@/components/board/ChessBoard";
import { GameControls } from "@/components/board/GameControls";
import { StatusBar } from "@/components/board/StatusBar";
import { AppShell } from "@/components/layout/AppShell";
import { useGameStore } from "@/store/gameStore";
import { useCoach } from "@/components/coach/CoachContext";
import { isCheck } from "@/lib/chessEngine";
import { Chess } from "chess.js";
import { PIECE_NAMES_ES } from "@/components/board/Pieces";

const CAPTURE_LINES = [
  "¡Órale, qué buena comida!",
  "¡Te volaste una pieza, súper!",
  "¡Ataque maestro!",
  "¡Eso es, sigue así!",
];

export default function JugarPage() {
  const {
    fen,
    orientation,
    showHints,
    showThreats,
    showCoordinates,
    pushMove,
  } = useGameStore();
  const coach = useCoach();
  const greeted = useRef(false);

  useEffect(() => {
    if (greeted.current) return;
    greeted.current = true;
    coach.say({
      text: "¡Va! Modo libre. Mueve las piezas como quieras y yo te aviso si pasa algo importante.",
      durationMs: 5500,
    });
  }, [coach]);

  return (
    <AppShell title="Jugar Libre" emoji="♟️" coachPosition="bottom-right">
      <div className="w-full max-w-[640px] flex flex-col gap-2">
        <StatusBar />
      </div>

      <div className="w-full">
        <ChessBoard
          fen={fen}
          orientation={orientation}
          showHints={showHints}
          showThreats={showThreats}
          showCoordinates={showCoordinates}
          interactive
          onMove={(result) => {
            pushMove(result);
            const game = new Chess(result.newFen);
            if (game.isCheckmate()) {
              coach.celebrate("¡Jaque mate! ¡Eres una campeona!");
            } else if (game.isStalemate()) {
              coach.say({
                text: "¡Tablas por ahogado! Nadie puede mover, empate.",
                state: "thinking",
              });
            } else if (game.isDraw()) {
              coach.say({
                text: "Tablas, fue empate justo.",
                state: "thinking",
              });
            } else if (isCheck(result.newFen)) {
              coach.say({
                text: "¡Cuidado! ¡Hay jaque al rey!",
                state: "talking",
                durationMs: 2800,
              });
            } else if (result.captured) {
              const pieceName = PIECE_NAMES_ES[result.captured as keyof typeof PIECE_NAMES_ES];
              const line = CAPTURE_LINES[Math.floor(Math.random() * CAPTURE_LINES.length)];
              coach.say({
                text: `${line} Comiste un ${pieceName}.`,
                durationMs: 2800,
              });
            }
          }}
        />
      </div>

      <div className="w-full max-w-[640px]">
        <GameControls />
      </div>
    </AppShell>
  );
}
