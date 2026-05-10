"use client";

import { motion } from "framer-motion";
import { PieceSvg } from "@/components/board/Pieces";
import {
  MG_ITEM_EMOJI,
  MG_OBSTACLE_EMOJI,
  type MgItemKind,
  type MgObstacleKind,
  type MgPieceKind,
} from "@/lib/minigames/types";
import { sq, parseSq } from "@/lib/minigames/engine";
import { cn } from "@/lib/utils";

type GoalBoardProps = {
  player: { kind: MgPieceKind; at: string; color?: "w" | "b" };
  items: { at: string; kind: MgItemKind }[];
  obstacles: { at: string; kind: MgObstacleKind }[];
  legalMoves: string[];
  goalTarget?: string;
  onTap: (square: string) => void;
};

export function GoalBoard({
  player,
  items,
  obstacles,
  legalMoves,
  goalTarget,
  onTap,
}: GoalBoardProps) {
  const itemMap = new Map(items.map((i) => [i.at, i] as const));
  const obstacleMap = new Map(obstacles.map((o) => [o.at, o] as const));
  const playerColor = player.color ?? "w";

  return (
    <div className="relative mx-auto w-full max-w-[min(92vmin,640px)]">
      <div
        className="rounded-[20px] p-2 sm:p-3 shadow-[0_18px_40px_-12px_rgba(58,36,23,0.55)]"
        style={{
          background:
            "linear-gradient(145deg, #8b6f47 0%, #6b4423 50%, #4a2f18 100%)",
        }}
      >
        <div
          className="rounded-[14px] p-1.5 sm:p-2"
          style={{ background: "linear-gradient(145deg,#f5c518,#c89409)" }}
        >
          <div
            role="grid"
            aria-label="Tablero del mini-juego"
            className="grid grid-cols-8 grid-rows-8 overflow-hidden rounded-[8px] border-2 border-[var(--color-wood-dark)]"
          >
            {Array.from({ length: 64 }).map((_, i) => {
              // Render top-down (rank 8 first row)
              const visualFile = i % 8;
              const visualRank = Math.floor(i / 8); // 0..7 from top
              const file = visualFile;
              const rank = 7 - visualRank;
              const square = sq(file, rank);
              const isDark = (file + rank) % 2 === 1;
              const isPlayer = square === player.at;
              const item = itemMap.get(square);
              const obstacle = obstacleMap.get(square);
              const isLegal = legalMoves.includes(square);
              const isGoal = goalTarget === square;

              return (
                <button
                  key={square}
                  type="button"
                  aria-label={`Casilla ${square}`}
                  onClick={() => onTap(square)}
                  className={cn(
                    "relative aspect-square w-full flex items-center justify-center",
                    isDark ? "bg-[var(--color-square-dark)]" : "bg-[var(--color-square-light)]",
                    isGoal && "outline outline-4 outline-[var(--color-success)] outline-offset-[-4px]",
                  )}
                >
                  {/* Goal marker (faint) */}
                  {isGoal && !isPlayer && !item && !obstacle && (
                    <span
                      aria-hidden
                      className="absolute inset-1 rounded-md ring-4 ring-[var(--color-success)]/60"
                    />
                  )}

                  {/* Obstacle */}
                  {obstacle && (
                    <span
                      aria-hidden
                      className={cn(
                        "absolute inset-0 flex items-center justify-center text-3xl sm:text-4xl",
                        obstacle.kind === "fire" &&
                          "bg-[var(--color-danger)]/85",
                      )}
                    >
                      {obstacle.kind !== "fire" && MG_OBSTACLE_EMOJI[obstacle.kind]}
                      {obstacle.kind === "fire" && "🔥"}
                    </span>
                  )}

                  {/* Item */}
                  {item && (
                    <motion.span
                      key={item.at + item.kind}
                      aria-hidden
                      initial={{ scale: 1 }}
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 1.6, repeat: Infinity }}
                      className="absolute inset-0 flex items-center justify-center text-3xl sm:text-4xl drop-shadow-[0_2px_0_rgba(58,36,23,0.4)]"
                    >
                      {MG_ITEM_EMOJI[item.kind]}
                    </motion.span>
                  )}

                  {/* Player piece */}
                  {isPlayer && (
                    <motion.div
                      layout
                      layoutId={`mg-player-${player.kind}`}
                      transition={{ type: "spring", stiffness: 300, damping: 26 }}
                      className="relative z-10 w-[88%] h-[88%] flex items-center justify-center pointer-events-none"
                    >
                      <PieceSvg
                        piece={{ type: player.kind, color: playerColor }}
                        size={64}
                      />
                    </motion.div>
                  )}

                  {/* Legal move dot */}
                  {isLegal && !isPlayer && !item && !obstacle && (
                    <span
                      aria-hidden
                      className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    >
                      <span
                        className="block rounded-full dot-hint"
                        style={{
                          width: "30%",
                          height: "30%",
                          background: "var(--color-hint)",
                          opacity: 0.75,
                          boxShadow: "0 0 10px rgba(66,165,245,0.55)",
                        }}
                      />
                    </span>
                  )}
                  {isLegal && (item || obstacle) && (
                    <span
                      aria-hidden
                      className="absolute inset-1 rounded-full pointer-events-none dot-hint"
                      style={{
                        border: "5px solid var(--color-danger)",
                        opacity: 0.9,
                        boxShadow: "0 0 12px rgba(229,57,53,0.6)",
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// Re-export for convenience.
export { parseSq };
