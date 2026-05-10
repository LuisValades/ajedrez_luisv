"use client";

import type { Color, Piece } from "@/lib/chessEngine";

type Skin = {
  body: string;
  bodyDark: string;
  outline: string;
  wing: string;
  wingDark: string;
  gem: string;
  highlight: string;
  shadow: string;
};

const WHITE_FAIRY: Skin = {
  body: "#fef9c3",
  bodyDark: "#fcd34d",
  outline: "#7c2d12",
  wing: "#fde047",
  wingDark: "#facc15",
  gem: "#22d3ee",
  highlight: "#ffffff",
  shadow: "rgba(124,45,18,0.35)",
};

const BLACK_FAIRY: Skin = {
  body: "#064e3b",
  bodyDark: "#022c22",
  outline: "#022c22",
  wing: "#10b981",
  wingDark: "#047857",
  gem: "#facc15",
  highlight: "#a7f3d0",
  shadow: "rgba(0,0,0,0.45)",
};

const skinFor = (c: Color): Skin => (c === "w" ? WHITE_FAIRY : BLACK_FAIRY);

type Props = { color: Color; size?: number };

const wrap = (children: React.ReactNode, color: Color, size: number) => (
  <svg
    viewBox="0 0 100 100"
    width={size}
    height={size}
    xmlns="http://www.w3.org/2000/svg"
    style={{
      display: "block",
      filter: `drop-shadow(0 2px 3px ${skinFor(color).shadow}) drop-shadow(0 0 6px ${skinFor(color).gem}55)`,
    }}
  >
    {children}
  </svg>
);

function Base({ color }: { color: Color }) {
  const s = skinFor(color);
  return (
    <>
      <ellipse cx="50" cy="92" rx="28" ry="5" fill={s.shadow} />
      <path
        d="M22 88 Q22 80 32 78 L68 78 Q78 80 78 88 L78 92 Q78 95 75 95 L25 95 Q22 95 22 92 Z"
        fill={s.bodyDark}
        stroke={s.outline}
        strokeWidth="2"
      />
      <rect x="26" y="80" width="48" height="3" fill={s.wing} opacity="0.7" />
      <circle cx="30" cy="84" r="1.4" fill={s.gem} />
      <circle cx="50" cy="84" r="1.6" fill={s.gem} />
      <circle cx="70" cy="84" r="1.4" fill={s.gem} />
    </>
  );
}

function Sparkle({ x, y, size = 3, fill }: { x: number; y: number; size?: number; fill: string }) {
  return (
    <path
      d={`M ${x} ${y - size} L ${x + size * 0.3} ${y - size * 0.3} L ${x + size} ${y} L ${x + size * 0.3} ${y + size * 0.3} L ${x} ${y + size} L ${x - size * 0.3} ${y + size * 0.3} L ${x - size} ${y} L ${x - size * 0.3} ${y - size * 0.3} Z`}
      fill={fill}
    />
  );
}

function Wings({ color, cx = 50, cy = 50 }: { color: Color; cx?: number; cy?: number }) {
  const s = skinFor(color);
  return (
    <g opacity="0.75">
      <path
        d={`M ${cx - 6} ${cy} Q ${cx - 22} ${cy - 18} ${cx - 14} ${cy - 4} Q ${cx - 22} ${cy + 6} ${cx - 6} ${cy + 4} Z`}
        fill={s.wing}
        stroke={s.wingDark}
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path
        d={`M ${cx + 6} ${cy} Q ${cx + 22} ${cy - 18} ${cx + 14} ${cy - 4} Q ${cx + 22} ${cy + 6} ${cx + 6} ${cy + 4} Z`}
        fill={s.wing}
        stroke={s.wingDark}
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </g>
  );
}

export function FairyPawn({ color, size = 64 }: Props) {
  const s = skinFor(color);
  return wrap(
    <>
      <Base color={color} />
      <path
        d="M40 78 L60 78 L57 60 L43 60 Z"
        fill={s.body}
        stroke={s.outline}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <ellipse cx="50" cy="48" rx="13" ry="14" fill={s.body} stroke={s.outline} strokeWidth="2.5" />
      <Sparkle x={50} y={36} size={4} fill={s.gem} />
      <circle cx="46" cy="50" r="1.4" fill={s.outline} />
      <circle cx="54" cy="50" r="1.4" fill={s.outline} />
      <path d="M46 56 Q50 58 54 56" fill="none" stroke={s.outline} strokeWidth="1.6" strokeLinecap="round" />
    </>,
    color,
    size,
  );
}

export function FairyRook({ color, size = 64 }: Props) {
  const s = skinFor(color);
  return wrap(
    <>
      <Base color={color} />
      <path
        d="M28 78 L28 60 L72 60 L72 78 Z"
        fill={s.body}
        stroke={s.outline}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <rect x="30" y="62" width="40" height="3" fill={s.wing} opacity="0.7" />
      <path
        d="M26 60 L26 50 L34 50 L34 44 L40 44 L40 50 L46 50 L46 44 L54 44 L54 50 L60 50 L60 44 L66 50 L66 50 L74 50 L74 60 Z"
        fill={s.body}
        stroke={s.outline}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <rect x="32" y="46" width="36" height="4" fill={s.bodyDark} stroke={s.outline} strokeWidth="1.5" />
      <Sparkle x={37} y={32} size={3} fill={s.gem} />
      <Sparkle x={50} y={28} size={3.5} fill={s.gem} />
      <Sparkle x={63} y={32} size={3} fill={s.gem} />
    </>,
    color,
    size,
  );
}

export function FairyBishop({ color, size = 64 }: Props) {
  const s = skinFor(color);
  return wrap(
    <>
      <Base color={color} />
      <path
        d="M36 78 L64 78 L60 64 L40 64 Z"
        fill={s.body}
        stroke={s.outline}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <ellipse cx="50" cy="60" rx="16" ry="6" fill={s.bodyDark} stroke={s.outline} strokeWidth="2" />
      <path
        d="M50 14 Q34 32 36 52 Q42 60 50 60 Q58 60 64 52 Q66 32 50 14 Z"
        fill={s.body}
        stroke={s.outline}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <Sparkle x={50} y={14} size={5} fill={s.gem} />
      <Wings color={color} cx={50} cy={45} />
      <path d="M44 38 Q50 32 56 38" fill="none" stroke={s.outline} strokeWidth="2" strokeLinecap="round" />
      <circle cx="46" cy="46" r="1.3" fill={s.outline} />
      <circle cx="54" cy="46" r="1.3" fill={s.outline} />
    </>,
    color,
    size,
  );
}

export function FairyKnight({ color, size = 64 }: Props) {
  const s = skinFor(color);
  return wrap(
    <>
      <Base color={color} />
      <path
        d="M30 78 L70 78 L66 64 L34 64 Z"
        fill={s.body}
        stroke={s.outline}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M34 64 Q26 50 32 38 Q38 26 52 22 Q60 20 64 26 Q70 32 70 44 Q72 50 72 56 Q72 62 66 64 Z"
        fill={s.body}
        stroke={s.outline}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path
        d="M52 22 L46 18 L42 24 Z"
        fill={s.bodyDark}
        stroke={s.outline}
        strokeWidth="2"
      />
      <path
        d="M62 28 L66 22 L70 28 Z"
        fill={s.bodyDark}
        stroke={s.outline}
        strokeWidth="2"
      />
      <Wings color={color} cx={50} cy={48} />
      <Sparkle x={68} y={20} size={3} fill={s.gem} />
      <Sparkle x={32} y={28} size={2.5} fill={s.gem} />
      <circle cx="58" cy="36" r="2" fill={s.outline} />
      <circle cx="58" cy="36" r="0.8" fill={s.highlight} />
      <path d="M52 46 Q58 48 64 46" fill="none" stroke={s.outline} strokeWidth="1.8" strokeLinecap="round" />
    </>,
    color,
    size,
  );
}

export function FairyQueen({ color, size = 64 }: Props) {
  const s = skinFor(color);
  return wrap(
    <>
      <Base color={color} />
      <path
        d="M30 78 L70 78 L66 60 L34 60 Z"
        fill={s.body}
        stroke={s.outline}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <ellipse cx="50" cy="58" rx="20" ry="5" fill={s.bodyDark} stroke={s.outline} strokeWidth="2" />
      <path
        d="M34 56 Q34 36 50 28 Q66 36 66 56 Z"
        fill={s.body}
        stroke={s.outline}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <Wings color={color} cx={50} cy={48} />
      <path
        d="M30 30 L36 16 L42 28 L50 12 L58 28 L64 16 L70 30 L66 36 L34 36 Z"
        fill={s.wing}
        stroke={s.outline}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <Sparkle x={36} y={16} size={3.5} fill={s.gem} />
      <Sparkle x={50} y={12} size={4.5} fill={s.gem} />
      <Sparkle x={64} y={16} size={3.5} fill={s.gem} />
      <rect x="34" y="36" width="32" height="3" fill={s.gem} opacity="0.7" />
      <circle cx="46" cy="46" r="1.4" fill={s.outline} />
      <circle cx="54" cy="46" r="1.4" fill={s.outline} />
      <path d="M44 50 Q50 53 56 50" fill="none" stroke={s.outline} strokeWidth="1.8" strokeLinecap="round" />
    </>,
    color,
    size,
  );
}

export function FairyKing({ color, size = 64 }: Props) {
  const s = skinFor(color);
  return wrap(
    <>
      <Base color={color} />
      <path
        d="M28 78 L72 78 L68 60 L32 60 Z"
        fill={s.body}
        stroke={s.outline}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <ellipse cx="50" cy="58" rx="22" ry="5" fill={s.bodyDark} stroke={s.outline} strokeWidth="2" />
      <path
        d="M32 56 Q32 34 50 26 Q68 34 68 56 Z"
        fill={s.body}
        stroke={s.outline}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <Wings color={color} cx={50} cy={45} />
      <path
        d="M28 28 L34 14 L42 24 L50 8 L58 24 L66 14 L72 28 L68 36 L32 36 Z"
        fill={s.wing}
        stroke={s.outline}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <Sparkle x={50} y={4} size={5} fill={s.gem} />
      <circle cx="36" cy="22" r="2.4" fill={s.gem} stroke={s.outline} strokeWidth="1.2" />
      <circle cx="64" cy="22" r="2.4" fill={s.gem} stroke={s.outline} strokeWidth="1.2" />
      <rect x="32" y="36" width="36" height="3" fill={s.gem} opacity="0.7" />
      <circle cx="46" cy="46" r="1.4" fill={s.outline} />
      <circle cx="54" cy="46" r="1.4" fill={s.outline} />
      <path d="M43 50 Q50 54 57 50" fill="none" stroke={s.outline} strokeWidth="2" strokeLinecap="round" />
    </>,
    color,
    size,
  );
}

export function FairyPiece({ piece, size }: { piece: Piece; size?: number }) {
  const props = { color: piece.color, size };
  switch (piece.type) {
    case "p":
      return <FairyPawn {...props} />;
    case "r":
      return <FairyRook {...props} />;
    case "n":
      return <FairyKnight {...props} />;
    case "b":
      return <FairyBishop {...props} />;
    case "q":
      return <FairyQueen {...props} />;
    case "k":
      return <FairyKing {...props} />;
    default:
      return null;
  }
}
