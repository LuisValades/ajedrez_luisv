"use client";

import { useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Chess } from "chess.js";
import { AppShell } from "@/components/layout/AppShell";
import { ChessBoard } from "@/components/board/ChessBoard";
import { LevelSelector } from "@/components/partida/LevelSelector";
import { ColorPicker } from "@/components/partida/ColorPicker";
import { PartidaStatus } from "@/components/partida/PartidaStatus";
import { PartidaControls } from "@/components/partida/PartidaControls";
import { CapturedStrip } from "@/components/partida/CapturedStrip";
import { EndGameModal } from "@/components/partida/EndGameModal";
import { usePartidaStore } from "@/store/partidaStore";
import { getLevel } from "@/lib/stockfish/levels";
import { useStockfish } from "@/lib/stockfish/useStockfish";
import { useCoach } from "@/components/coach/CoachContext";
import { isCheck, makeMove } from "@/lib/chessEngine";
import { PIECE_NAMES_ES } from "@/components/board/Pieces";
import { sfx } from "@/lib/audio/sfx";
import { SkinBar } from "@/components/board/SkinBar";

const CAPTURE_LINES = [
  "¡Órale, qué buena comida!",
  "¡Te volaste una pieza, súper!",
  "¡Ataque maestro!",
  "¡Eso es, sigue así!",
];

export default function JugarPage() {
  const router = useRouter();
  const coach = useCoach();
  const { engine, ready, error } = useStockfish();
  const partida = usePartidaStore();
  const {
    stage,
    level,
    playerColor,
    fen,
    history,
    iaThinking,
    hint,
    endReason,
  } = partida;
  const lvl = getLevel(level);

  const hintTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const greetedRef = useRef(false);
  const playingInitRef = useRef(false);

  // Greet on first arrival.
  useEffect(() => {
    if (greetedRef.current) return;
    greetedRef.current = true;
    if (stage === "level") {
      coach.say({
        text: "¡Va! Elige a tu rival. Empieza con Pollito si es tu primera vez.",
        durationMs: 6000,
      });
    }
  }, [coach, stage]);

  const reactToMove = useCallback(
    (
      result: { captured?: string; newFen: string },
      byIa: boolean,
    ) => {
      if (result.captured) sfx.play("capture");
      else sfx.play("move");
      if (isCheck(result.newFen)) sfx.play("check");
      if (result.captured) {
        const pieceName =
          PIECE_NAMES_ES[result.captured as keyof typeof PIECE_NAMES_ES] ?? "pieza";
        if (byIa) {
          coach.say({
            text: `${lvl.name} se comió tu ${pieceName}. ¡Tú puedes recuperar!`,
            durationMs: 3500,
            state: "thinking",
          });
        } else {
          const line = CAPTURE_LINES[Math.floor(Math.random() * CAPTURE_LINES.length)];
          coach.say({
            text: `${line} Comiste un ${pieceName}.`,
            durationMs: 3000,
          });
        }
      } else if (isCheck(result.newFen)) {
        if (byIa) {
          coach.say({
            text: "¡Cuidado! Tu rey está en jaque, sálvalo.",
            state: "talking",
            durationMs: 3000,
          });
        } else {
          coach.say({
            text: `¡Jaque! Atacas a ${lvl.name}.`,
            durationMs: 2500,
          });
        }
      }
    },
    [coach, lvl.name],
  );

  const runIaTurn = useCallback(async () => {
    const state = usePartidaStore.getState();
    if (state.stage !== "playing") return;
    const game = new Chess(state.fen);
    if (game.isGameOver()) return;
    if (game.turn() === playerColor) return;

    partida.setIaThinking(true);
    coach.think(`${lvl.name} está pensando...`);
    try {
      const best = await engine.getBestMove(state.fen, lvl);
      const result = makeMove(state.fen, best.from, best.to, best.promotion ?? "q");
      if (!result.ok) {
        partida.setIaThinking(false);
        return;
      }
      partida.pushIaMove(result);
      reactToMove(result, true);
      const post = new Chess(result.newFen);
      if (post.isCheckmate()) {
        sfx.play("error");
        partida.finish("checkmate-ia");
        coach.say({ text: lvl.voiceLose, durationMs: 5500 });
      } else if (post.isStalemate()) {
        partida.finish("stalemate");
        coach.say({ text: "¡Tablas! Nadie puede mover. Jugaste con calma.", durationMs: 4500 });
      } else if (post.isDraw()) {
        partida.finish("draw");
        coach.say({ text: "Tablas, fue empate justo.", durationMs: 4000 });
      }
    } catch {
      partida.setIaThinking(false);
    }
  }, [coach, engine, lvl, partida, playerColor, reactToMove]);

  useEffect(() => {
    if (stage !== "playing") {
      playingInitRef.current = false;
      return;
    }
    if (!ready) return;
    if (playingInitRef.current) return;
    playingInitRef.current = true;

    let cancelled = false;
    engine.newGame().then(() => {
      if (cancelled) return;
      if (playerColor === "b") runIaTurn();
    });

    return () => {
      cancelled = true;
    };
  }, [stage, ready, playerColor, engine, runIaTurn]);

  // Player move handler.
  const handlePlayerMove = (result: {
    ok: boolean;
    newFen: string;
    captured?: string;
  }) => {
    if (!result.ok) return;
    partida.pushPlayerMove(result as Parameters<typeof partida.pushPlayerMove>[0]);
    reactToMove(result, false);

    const post = new Chess(result.newFen);
    if (post.isCheckmate()) {
      sfx.play("win");
      partida.finish("checkmate-player");
      coach.celebrate(lvl.voiceWin);
      return;
    }
    if (post.isStalemate()) {
      partida.finish("stalemate");
      coach.say({ text: "¡Tablas! Le dejaste sin movimientos.", durationMs: 4500 });
      return;
    }
    if (post.isDraw()) {
      partida.finish("draw");
      coach.say({ text: "Tablas, fue empate justo.", durationMs: 4000 });
      return;
    }
    // Trigger IA
    setTimeout(() => runIaTurn(), 350);
  };

  const handleHint = async () => {
    if (!ready) return;
    if (iaThinking) return;
    const state = usePartidaStore.getState();
    const game = new Chess(state.fen);
    if (game.turn() !== playerColor) return;
    coach.think("Déjame ver...");
    try {
      const best = await engine.getHint(state.fen);
      partida.setHint({ from: best.from, to: best.to });
      coach.say({
        text: "Mira la flecha azul, ahí va una buena.",
        durationMs: 3500,
      });
      if (hintTimeoutRef.current) clearTimeout(hintTimeoutRef.current);
      hintTimeoutRef.current = setTimeout(() => partida.setHint(null), 4500);
    } catch {
      coach.say({ text: "Ups, no encontré pista. Intenta tú.", durationMs: 3000 });
    }
  };

  const handleUndo = () => {
    if (iaThinking) return;
    partida.undoLastPair();
    coach.say({ text: "¡Va, deshecho! Intenta otra movida.", durationMs: 2500 });
  };

  const handleResign = () => {
    if (typeof window !== "undefined" && window.confirm("¿Te rindes esta partida?")) {
      partida.finish("resign");
      coach.say({
        text: "¡No te preocupes! Otra ronda y le ganas.",
        state: "thinking",
        durationMs: 4000,
      });
    }
  };

  const lastMove = (() => {
    const last = history[history.length - 1];
    if (!last || !last.from || !last.to) return null;
    return { from: last.from, to: last.to };
  })();

  // Stages
  if (stage === "level") {
    return (
      <AppShell title="Partida" emoji="⚔️" coachPosition="bottom-right">
        <LevelSelector
          current={level}
          starsTotal={0}
          onSelect={(id) => {
            partida.setLevel(id);
            const lvl2 = getLevel(id);
            coach.say({ text: lvl2.voiceChosen, durationMs: 4000 });
          }}
          onConfirm={() => {
            partida.setStage("color");
            coach.say({
              text: "Ahora elige tu color. Las blancas mueven primero.",
              durationMs: 4500,
            });
          }}
        />
      </AppShell>
    );
  }

  if (stage === "color") {
    return (
      <AppShell title="Partida" emoji="⚔️" coachPosition="bottom-right">
        <ColorPicker
          current={playerColor}
          onSelect={(c) => {
            partida.setPlayerColor(c);
            coach.say({
              text: c === "w" ? "Juegas con blancas, mueves primero." : "Juegas con negras, ya viene tu turno.",
              durationMs: 3500,
            });
          }}
          onRandom={() => {
            const random: "w" | "b" = Math.random() < 0.5 ? "w" : "b";
            partida.setPlayerColor(random);
            coach.celebrate(
              random === "w"
                ? "¡La moneda dice blancas! Mueves primero."
                : "¡La moneda dice negras! Ya viene tu turno.",
            );
          }}
          onConfirm={() => {
            partida.startPartida();
            coach.say({
              text: "¡Va! Que empiece la partida.",
              durationMs: 3000,
              state: "celebrating",
            });
          }}
        />
      </AppShell>
    );
  }

  // playing or ended
  return (
    <AppShell title={`Partida vs ${lvl.name}`} emoji={lvl.emoji} coachPosition="bottom-right">
      {error && (
        <div className="rounded-xl bg-[var(--color-danger)]/15 text-[var(--color-danger)] px-4 py-2 text-sm font-semibold">
          No se pudo cargar el motor de ajedrez: {error.message}
        </div>
      )}
      {!ready && !error && (
        <div className="rounded-xl bg-white/85 px-4 py-2 text-sm text-[var(--color-wood-dark)] font-semibold flex items-center gap-2">
          <span aria-hidden>🐲</span>
          <span>Despertando al motor del reino...</span>
        </div>
      )}

      <div className="w-full max-w-[640px] flex flex-col gap-2">
        <PartidaStatus
          fen={fen}
          level={lvl}
          playerColor={playerColor}
          iaThinking={iaThinking}
        />
        <CapturedStrip fen={fen} />
        <SkinBar variant="full" className="mt-1" />
      </div>

      <div className="w-full">
        <ChessBoard
          fen={fen}
          orientation={playerColor}
          interactive={!iaThinking && stage === "playing"}
          playableColor={playerColor}
          showHints
          showThreats
          showCoordinates={false}
          hintMove={hint}
          lastMove={lastMove}
          onMove={handlePlayerMove}
        />
      </div>

      <div className="w-full max-w-[640px]">
        <PartidaControls
          onHint={handleHint}
          onUndo={handleUndo}
          onFlip={() => {
            partida.setPlayerColor(playerColor === "w" ? "b" : "w");
          }}
          onResign={handleResign}
          hintLoading={false}
          hintDisabled={iaThinking || !ready || stage !== "playing"}
          undoDisabled={history.length <= 1 || iaThinking || stage !== "playing"}
        />
      </div>

      {stage === "ended" && endReason && (
        <EndGameModal
          reason={endReason}
          level={lvl}
          onRematch={() => {
            partida.rematch();
            playingInitRef.current = false;
          }}
          onChangeLevel={() => {
            partida.resetToSelector();
            playingInitRef.current = false;
          }}
          onHome={() => router.push("/")}
        />
      )}
    </AppShell>
  );
}
