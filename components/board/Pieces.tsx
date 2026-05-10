"use client";

import type { Piece, Color } from "@/lib/chessEngine";
import type { PlayerPalette, Theme } from "@/lib/themes";
import { useSettingsStore } from "@/store/settingsStore";
import { getTheme } from "@/lib/themes";
import { CartoonPiece } from "./skins/Cartoon";

export const PIECE_NAMES_ES: Record<Piece["type"], string> = {
  p: "peón",
  r: "torre",
  n: "caballo",
  b: "alfil",
  q: "reina",
  k: "rey",
};

type SvgProps = { size: number };

const wrap = (children: React.ReactNode, size: number) => (
  <svg
    viewBox="0 0 60 60"
    width={size}
    height={size}
    xmlns="http://www.w3.org/2000/svg"
    style={{
      display: "block",
      filter: "drop-shadow(0 2px 2.5px rgba(0,0,0,0.45))",
    }}
  >
    {children}
  </svg>
);

const FILL = "var(--piece-fill)";
const STROKE = "var(--piece-stroke)";
const ACCENT = "var(--piece-accent)";
const HIGHLIGHT = "var(--piece-highlight, rgba(255,255,255,0.4))";

function Base() {
  return (
    <>
      <ellipse cx="30" cy="55" rx="14" ry="2.4" fill="rgba(0,0,0,0.35)" />
      <path
        d="M16 53 L44 53 L41 49 L19 49 Z"
        fill={FILL}
        stroke={STROKE}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <rect x="17" y="48" width="26" height="2.5" fill={ACCENT} opacity="0.85" />
    </>
  );
}

function Pawn({ size }: SvgProps) {
  return wrap(
    <>
      <Base />
      <path
        d="M22 48 L38 48 L36 33 L24 33 Z"
        fill={FILL}
        stroke={STROKE}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <ellipse
        cx="30"
        cy="26"
        rx="7"
        ry="7"
        fill={FILL}
        stroke={STROKE}
        strokeWidth="1.8"
      />
      <ellipse cx="29" cy="24" rx="2.5" ry="2" fill={HIGHLIGHT} opacity="0.6" />
    </>,
    size,
  );
}

function Rook({ size }: SvgProps) {
  return wrap(
    <>
      <Base />
      <path
        d="M19 48 L19 35 L41 35 L41 48 Z"
        fill={FILL}
        stroke={STROKE}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <rect x="20" y="36" width="20" height="2" fill={ACCENT} opacity="0.7" />
      <path
        d="M17 35 L17 28 L21 28 L21 25 L25 25 L25 28 L29 28 L29 25 L31 25 L31 28 L35 28 L35 25 L39 25 L39 28 L43 28 L43 35 Z"
        fill={FILL}
        stroke={STROKE}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <rect x="20" y="29" width="20" height="2" fill={HIGHLIGHT} opacity="0.45" />
    </>,
    size,
  );
}

function Bishop({ size }: SvgProps) {
  return wrap(
    <>
      <Base />
      <path
        d="M23 48 L37 48 L35 41 L25 41 Z"
        fill={FILL}
        stroke={STROKE}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <ellipse cx="30" cy="40" rx="9" ry="2.5" fill={FILL} stroke={STROKE} strokeWidth="1.4" />
      <path
        d="M30 12 Q22 22 23 36 Q26 40 30 40 Q34 40 37 36 Q38 22 30 12 Z"
        fill={FILL}
        stroke={STROKE}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <line x1="26" y1="26" x2="34" y2="26" stroke={STROKE} strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="30" cy="11" r="2.2" fill={ACCENT} stroke={STROKE} strokeWidth="1.2" />
    </>,
    size,
  );
}

function Knight({ size }: SvgProps) {
  return wrap(
    <>
      <Base />
      <path
        d="M20 48 L40 48 L38 41 L22 41 Z"
        fill={FILL}
        stroke={STROKE}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M22 41 Q18 33 21 25 Q24 18 31 16 Q36 15 39 19 Q42 24 41 30 Q42 34 41 38 Q40 41 38 41 Z"
        fill={FILL}
        stroke={STROKE}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M31 16 L28 13 L26 17 Z"
        fill={FILL}
        stroke={STROKE}
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path
        d="M38 19 L40 15 L42 19 Z"
        fill={FILL}
        stroke={STROKE}
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path
        d="M21 28 Q23 32 26 32 L27 36 L23 36 Q20 33 21 28 Z"
        fill={FILL}
        stroke={STROKE}
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <circle cx="34" cy="23" r="1.4" fill={STROKE} />
      <circle cx="34" cy="23" r="0.5" fill={HIGHLIGHT} />
      <line x1="29" y1="30" x2="36" y2="30" stroke={STROKE} strokeWidth="1.2" strokeLinecap="round" />
    </>,
    size,
  );
}

function Queen({ size }: SvgProps) {
  return wrap(
    <>
      <Base />
      <path
        d="M20 48 L40 48 L38 38 L22 38 Z"
        fill={FILL}
        stroke={STROKE}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <ellipse cx="30" cy="37" rx="11" ry="2.5" fill={FILL} stroke={STROKE} strokeWidth="1.4" />
      <path
        d="M22 36 Q22 23 30 18 Q38 23 38 36 Z"
        fill={FILL}
        stroke={STROKE}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M19 19 L22 11 L26 17 L30 9 L34 17 L38 11 L41 19 L38 23 L22 23 Z"
        fill={FILL}
        stroke={STROKE}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="22" cy="11" r="1.7" fill={ACCENT} stroke={STROKE} strokeWidth="1" />
      <circle cx="30" cy="9" r="2" fill={ACCENT} stroke={STROKE} strokeWidth="1" />
      <circle cx="38" cy="11" r="1.7" fill={ACCENT} stroke={STROKE} strokeWidth="1" />
      <rect x="22" y="23" width="16" height="1.8" fill={ACCENT} opacity="0.85" />
    </>,
    size,
  );
}

function King({ size }: SvgProps) {
  return wrap(
    <>
      <Base />
      <path
        d="M19 48 L41 48 L39 38 L21 38 Z"
        fill={FILL}
        stroke={STROKE}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <ellipse cx="30" cy="37" rx="12" ry="2.5" fill={FILL} stroke={STROKE} strokeWidth="1.4" />
      <path
        d="M21 36 Q21 23 30 18 Q39 23 39 36 Z"
        fill={FILL}
        stroke={STROKE}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M18 19 L21 9 L26 16 L30 4 L34 16 L39 9 L42 19 L39 23 L21 23 Z"
        fill={ACCENT}
        stroke={STROKE}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <rect x="28" y="0" width="4" height="4" fill={ACCENT} stroke={STROKE} strokeWidth="1.1" />
      <rect x="26" y="2" width="8" height="2.5" fill={ACCENT} stroke={STROKE} strokeWidth="1.1" />
      <rect x="22" y="23" width="16" height="1.8" fill={ACCENT} opacity="0.85" />
    </>,
    size,
  );
}

type PieceSvgProps = {
  piece: Piece;
  size?: number;
  /** Override the player palette for SVG previews (legend, picker
   *  thumbnails) without depending on the CSS vars from a parent square. */
  palette?: PlayerPalette;
  /** Override the active theme — useful for previews. */
  themeOverride?: Theme;
};

/**
 * Theme-aware piece renderer.
 *
 * If the active theme uses `pieceStyle: "cartoon"`, renders the user's kawaii
 * PNG art tinted by `theme.cartoonTints`. Otherwise renders the SVG geometry,
 * coloured via CSS custom properties (`--piece-fill/stroke/accent`) set by the
 * parent square (or by the `palette` prop in standalone previews).
 */
export function PieceSvg({
  piece,
  size = 64,
  palette,
  themeOverride,
}: PieceSvgProps) {
  const activeId = useSettingsStore((s) => s.themeId);
  const theme = themeOverride ?? getTheme(activeId);

  if (theme.pieceStyle === "cartoon") {
    return <CartoonPiece piece={piece} size={size} themeId={theme.id} />;
  }

  const inner = renderPiece(piece, size);
  if (!palette) return inner;
  return (
    <span
      style={
        {
          "--piece-fill": palette.fill,
          "--piece-stroke": palette.stroke,
          "--piece-accent": palette.accent,
          display: "inline-flex",
        } as React.CSSProperties
      }
    >
      {inner}
    </span>
  );
}

function renderPiece(piece: Piece, size: number) {
  switch (piece.type) {
    case "p":
      return <Pawn size={size} />;
    case "r":
      return <Rook size={size} />;
    case "n":
      return <Knight size={size} />;
    case "b":
      return <Bishop size={size} />;
    case "q":
      return <Queen size={size} />;
    case "k":
      return <King size={size} />;
    default:
      return null;
  }
}

/** Helper for callers that just want the right palette for a piece color. */
export function paletteForColor(
  theme: { player1: PlayerPalette; player2: PlayerPalette },
  color: Color,
): PlayerPalette {
  return color === "w" ? theme.player1 : theme.player2;
}
