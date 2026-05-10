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
  /** Optional extra darkening of the source for black pieces (0..1). */
  blackDarkness?: number;
};

export const KIDS_BLUE: CartoonTheme = {
  whiteTint: "#dbeafe",
  blackTint: "#1d4ed8",
  blackDarkness: 0.55,
};

export const PRINCESS_PINK: CartoonTheme = {
  whiteTint: "#fce7f3",
  blackTint: "#be185d",
  blackDarkness: 0.55,
};

type Props = {
  piece: Piece;
  size?: number;
  theme: CartoonTheme;
};

export function CartoonPiece({ piece, size = 64, theme }: Props) {
  const src = FILE[piece.type];
  const tint = piece.color === "w" ? theme.whiteTint : theme.blackTint;
  const dropShadow =
    piece.color === "w"
      ? "drop-shadow(0 2px 3px rgba(30,58,138,0.35))"
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
      {/* base image — original 3D rendering */}
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
          ...(piece.color === "b" && theme.blackDarkness
            ? { filter: `brightness(${theme.blackDarkness})` }
            : {}),
        }}
      />
      {/* tint overlay restricted to the piece silhouette */}
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
          mixBlendMode: piece.color === "w" ? "multiply" : "color",
          opacity: piece.color === "w" ? 1 : 0.85,
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
