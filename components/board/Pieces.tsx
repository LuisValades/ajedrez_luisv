"use client";

import type { Piece } from "@/lib/chessEngine";
import { useSettingsStore } from "@/store/settingsStore";
import type { PieceSetId } from "@/lib/pieceSets";
import { WoodPiece } from "./skins/Wood";
import { KidsBluePiece, PrincessPinkPiece } from "./skins/Cartoon";

export const PIECE_NAMES_ES: Record<Piece["type"], string> = {
  p: "peón",
  r: "torre",
  n: "caballo",
  b: "alfil",
  q: "reina",
  k: "rey",
};

type PieceSvgProps = {
  piece: Piece;
  size?: number;
  /** Override the active piece set (useful for previews). */
  pieceSet?: PieceSetId;
};

export function PieceSvg({ piece, size = 64, pieceSet }: PieceSvgProps) {
  const active = useSettingsStore((s) => s.pieceSet);
  const set: PieceSetId = pieceSet ?? active;
  switch (set) {
    case "wood":
      return <WoodPiece piece={piece} size={size} />;
    case "kids":
      return <KidsBluePiece piece={piece} size={size} />;
    case "princess":
      return <PrincessPinkPiece piece={piece} size={size} />;
    default:
      return <WoodPiece piece={piece} size={size} />;
  }
}
