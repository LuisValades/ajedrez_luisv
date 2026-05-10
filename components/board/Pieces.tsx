"use client";

import type { Piece } from "@/lib/chessEngine";
import { useSettingsStore } from "@/store/settingsStore";
import type { PieceSetId } from "@/lib/pieceSets";
import { WoodPiece } from "./skins/Wood";
import { KidsPiece } from "./skins/Kids";
import { PrincessPiece } from "./skins/Princess";
import { FairyPiece } from "./skins/Fairy";

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
      return <KidsPiece piece={piece} size={size} />;
    case "princess":
      return <PrincessPiece piece={piece} size={size} />;
    case "fairy":
      return <FairyPiece piece={piece} size={size} />;
    default:
      return <WoodPiece piece={piece} size={size} />;
  }
}
