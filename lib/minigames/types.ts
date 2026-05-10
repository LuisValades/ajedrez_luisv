import type { MinigameId } from "@/store/progressStore";

export type MgPieceKind = "p" | "r" | "n" | "b" | "q" | "k";
export type MgItemKind = "coin" | "torch" | "dragon" | "carrot" | "ally-rook";
export type MgObstacleKind = "fire" | "enemy-pawn" | "rock";

export type Square = string; // "a1".."h8" (or any NxM coordinate, we standardize 8x8)

export type GoalKind =
  | { kind: "collect-all" }
  | { kind: "reach"; target: Square }
  | { kind: "collect-then-reach"; target: Square };

export type MgLevel = {
  index: number; // 0..4
  title: string;
  hint: string;
  player: { kind: MgPieceKind; at: Square; color?: "w" | "b" };
  items: { at: Square; kind: MgItemKind }[];
  obstacles: { at: Square; kind: MgObstacleKind }[];
  goal: GoalKind;
  maxMoves: number;
  threeStarMoves: number;
  twoStarMoves: number;
};

export type MgGameDef = {
  id: MinigameId;
  emoji: string;
  title: string;
  subtitle: string;
  pieceKind: MgPieceKind;
  pieceLabel: string;
  itemEmoji: string;
  /** Optional intro narration. */
  intro: string;
  gradient: string;
  levels: MgLevel[];
};

export const MG_ITEM_EMOJI: Record<MgItemKind, string> = {
  coin: "🪙",
  torch: "🔥",
  dragon: "🐲",
  carrot: "🥕",
  "ally-rook": "🏰",
};

export const MG_OBSTACLE_EMOJI: Record<MgObstacleKind, string> = {
  fire: "🟥",
  "enemy-pawn": "♟",
  rock: "🪨",
};
