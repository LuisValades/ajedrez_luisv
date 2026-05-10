"use client";

import type { Color, Piece } from "@/lib/chessEngine";

const FILE: Record<Piece["type"], string> = {
  p: "/pieces/peon.png",
  r: "/pieces/torre.png",
  n: "/pieces/caballo.png",
  b: "/pieces/alfil.png",
  q: "/pieces/reina.png",
  k: "/pieces/rey.png",
};

export type CartoonTheme = {
  /** Tint for white pieces (light, lets the 3D detail show through). */
  whiteTint: string;
  /** Tint for black pieces (dark / saturated). */
  blackTint: string;
  /** Optional source brightness for white pieces (0..1, default 1). */
  whiteDarkness?: number;
  /** Optional source brightness for black pieces (0..1). */
  blackDarkness?: number;
};

export const KIDS_BLUE: CartoonTheme = {
  whiteTint: "#7dd3fc",
  blackTint: "#1e3a8a",
  whiteDarkness: 0.95,
  blackDarkness: 0.5,
};

export const PRINCESS_PINK: CartoonTheme = {
  whiteTint: "#fbcfe8",
  blackTint: "#9d174d",
  whiteDarkness: 0.95,
  blackDarkness: 0.5,
};

type Props = {
  piece: Piece;
  size?: number;
  theme: CartoonTheme;
};

export function CartoonPiece({ piece, size = 64, theme }: Props) {
  const src = FILE[piece.type];
  const isWhite = piece.color === "w";
  const tint = isWhite ? theme.whiteTint : theme.blackTint;
  const detailOpacity = isWhite ? 0.55 : 0.4;
  const dropShadow = isWhite
    ? "drop-shadow(0 1px 0 rgba(30,58,138,0.6)) drop-shadow(0 2px 3px rgba(30,58,138,0.35))"
    : "drop-shadow(0 2px 3px rgba(0,0,0,0.55))";

  return (
    <div
      style={{
        position: "relative",
        width: size,
        height: size,
        isolation: "isolate",
        filter: dropShadow,
      }}
      aria-hidden
    >
      {/* solid silhouette — guarantees the body color */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: tint,
          WebkitMaskImage: `url(${src})`,
          maskImage: `url(${src})`,
          WebkitMaskSize: "100% 100%",
          maskSize: "100% 100%",
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          WebkitMaskPosition: "center",
          maskPosition: "center",
          pointerEvents: "none",
        }}
      />
      {/* original image overlay — multiplies kawaii face/details over the solid body */}
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
          mixBlendMode: "multiply",
          opacity: detailOpacity,
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

export function KidsBluePiece({ piece, size }: { piece: Piece; size?: number }) {
  return <CartoonPiece piece={piece} size={size} theme={KIDS_BLUE} />;
}

export function PrincessPinkPiece({ piece, size }: { piece: Piece; size?: number }) {
  return <CartoonPiece piece={piece} size={size} theme={PRINCESS_PINK} />;
}

// Re-export for backward compatibility imports.
export type { Color };
