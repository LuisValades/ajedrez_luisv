"use client";

import type { Color, Piece } from "@/lib/chessEngine";
import type { ThemeId } from "@/lib/themes";

/**
 * Renders a kawaii cartoon PNG that is ALREADY pre-coloured for the theme.
 *
 * Files live at `/pieces/{themeId}/{w|b}/{p|r|n|b|q|k}.png` — for example
 * `/pieces/ninos/w/q.png` is the bronze queen for the Niños theme.
 *
 * A short, soft WHITE drop-shadow halo is layered behind so the piece pops
 * out against either light or dark squares. A subtle dark drop-shadow keeps
 * the grounding shadow.
 */
export function CartoonPiece({
  piece,
  size = 64,
  themeId,
}: {
  piece: Piece;
  size?: number;
  themeId: ThemeId;
}) {
  const src = `/pieces/${themeId}/${piece.color}/${piece.type}.png`;
  // Soft, short white halo (single drop-shadow) so the piece pops on either
  // light or dark squares without looking like a sticker. Dark grounding
  // shadow stays underneath for depth.
  const filter =
    "drop-shadow(0 0 1.2px rgba(255,255,255,0.7))" +
    " drop-shadow(0 2px 2.5px rgba(0,0,0,0.4))";

  return (
    <div
      style={{
        position: "relative",
        width: size,
        height: size,
        filter,
      }}
      aria-hidden
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        draggable={false}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "contain",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

export type { Color };
