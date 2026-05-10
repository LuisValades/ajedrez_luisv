"use client";

import type { Color, Piece } from "@/lib/chessEngine";

type Skin = {
  bodyTop: string;
  bodyMid: string;
  bodyBot: string;
  bodyShadow: string;
  outline: string;
  bow: string;
  bowDark: string;
  gem: string;
  highlight: string;
  shadow: string;
  cheek: string;
  faceLine: string;
};

/** White body with subtle pink shadow for the highlights. */
const WHITE_PRINCESS: Skin = {
  bodyTop: "#ffffff",
  bodyMid: "#fff5f8",
  bodyBot: "#f9d2e0",
  bodyShadow: "#c46899",
  outline: "#831843",
  bow: "#f472b6",
  bowDark: "#db2777",
  gem: "#ec4899",
  highlight: "#ffffff",
  shadow: "rgba(131,24,67,0.40)",
  cheek: "#fb7185",
  faceLine: "#831843",
};

/** Dark mauve body keeps high contrast vs pink board. */
const BLACK_PRINCESS: Skin = {
  bodyTop: "#7e3066",
  bodyMid: "#5a1c4b",
  bodyBot: "#3b0a25",
  bodyShadow: "#1f0414",
  outline: "#1f0414",
  bow: "#f0abfc",
  bowDark: "#c026d3",
  gem: "#facc15",
  highlight: "#fbcfe8",
  shadow: "rgba(0,0,0,0.55)",
  cheek: "#f0abfc",
  faceLine: "#fbcfe8",
};

const skinFor = (c: Color): Skin => (c === "w" ? WHITE_PRINCESS : BLACK_PRINCESS);

type Props = { color: Color; size?: number };

const wrap = (children: React.ReactNode, color: Color, size: number) => (
  <svg
    viewBox="0 0 100 100"
    width={size}
    height={size}
    xmlns="http://www.w3.org/2000/svg"
    style={{ display: "block", filter: `drop-shadow(0 3px 4px ${skinFor(color).shadow})` }}
  >
    {children}
  </svg>
);

/** Princess face: huge sparkly eyes + LONG eyelashes + big rosy cheeks + heart mouth. */
function PrincessFace({
  color,
  cx = 50,
  cy = 48,
  scale = 1,
}: {
  color: Color;
  cx?: number;
  cy?: number;
  scale?: number;
}) {
  const s = skinFor(color);
  const eyeR = 5.8 * scale;
  const eyeOffset = 7 * scale;
  const pupilR = 3.4 * scale;
  return (
    <g>
      <ellipse
        cx={cx - eyeOffset}
        cy={cy}
        rx={eyeR}
        ry={eyeR * 1.1}
        fill="#ffffff"
        stroke={s.outline}
        strokeWidth={1.5 * scale}
      />
      <ellipse
        cx={cx + eyeOffset}
        cy={cy}
        rx={eyeR}
        ry={eyeR * 1.1}
        fill="#ffffff"
        stroke={s.outline}
        strokeWidth={1.5 * scale}
      />
      <circle cx={cx - eyeOffset} cy={cy + 1} r={pupilR} fill="#1a1a1a" />
      <circle cx={cx + eyeOffset} cy={cy + 1} r={pupilR} fill="#1a1a1a" />
      <circle cx={cx - eyeOffset - 1.2} cy={cy - 1.8} r={1.5 * scale} fill="#ffffff" />
      <circle cx={cx + eyeOffset - 1.2} cy={cy - 1.8} r={1.5 * scale} fill="#ffffff" />
      <circle cx={cx - eyeOffset + 2.2} cy={cy + 2.5} r={0.7 * scale} fill="#ffffff" opacity="0.6" />
      <circle cx={cx + eyeOffset + 2.2} cy={cy + 2.5} r={0.7 * scale} fill="#ffffff" opacity="0.6" />
      {/* eyelashes */}
      <path d={`M ${cx - eyeOffset - 4 * scale} ${cy - 4 * scale} L ${cx - eyeOffset - 6 * scale} ${cy - 7 * scale}`} stroke={s.outline} strokeWidth={1.4 * scale} strokeLinecap="round" />
      <path d={`M ${cx - eyeOffset - 1 * scale} ${cy - 5.2 * scale} L ${cx - eyeOffset - 1 * scale} ${cy - 8.8 * scale}`} stroke={s.outline} strokeWidth={1.4 * scale} strokeLinecap="round" />
      <path d={`M ${cx - eyeOffset + 2.5 * scale} ${cy - 4.5 * scale} L ${cx - eyeOffset + 4.5 * scale} ${cy - 7.5 * scale}`} stroke={s.outline} strokeWidth={1.4 * scale} strokeLinecap="round" />
      <path d={`M ${cx + eyeOffset - 2.5 * scale} ${cy - 4.5 * scale} L ${cx + eyeOffset - 4.5 * scale} ${cy - 7.5 * scale}`} stroke={s.outline} strokeWidth={1.4 * scale} strokeLinecap="round" />
      <path d={`M ${cx + eyeOffset + 1 * scale} ${cy - 5.2 * scale} L ${cx + eyeOffset + 1 * scale} ${cy - 8.8 * scale}`} stroke={s.outline} strokeWidth={1.4 * scale} strokeLinecap="round" />
      <path d={`M ${cx + eyeOffset + 4 * scale} ${cy - 4 * scale} L ${cx + eyeOffset + 6 * scale} ${cy - 7 * scale}`} stroke={s.outline} strokeWidth={1.4 * scale} strokeLinecap="round" />
      {/* big rosy cheeks */}
      <ellipse cx={cx - 11 * scale} cy={cy + 6 * scale} rx={3.6 * scale} ry={2.6 * scale} fill={s.cheek} opacity="0.75" />
      <ellipse cx={cx + 11 * scale} cy={cy + 6 * scale} rx={3.6 * scale} ry={2.6 * scale} fill={s.cheek} opacity="0.75" />
      {/* heart mouth */}
      <path
        d={`M ${cx} ${cy + 11 * scale}
            C ${cx - 4 * scale} ${cy + 7.5 * scale} ${cx - 4 * scale} ${cy + 6.5 * scale} ${cx - 2 * scale} ${cy + 6.8 * scale}
            C ${cx - 0.6 * scale} ${cy + 7 * scale} ${cx} ${cy + 7.6 * scale} ${cx} ${cy + 8.2 * scale}
            C ${cx} ${cy + 7.6 * scale} ${cx + 0.6 * scale} ${cy + 7 * scale} ${cx + 2 * scale} ${cy + 6.8 * scale}
            C ${cx + 4 * scale} ${cy + 6.5 * scale} ${cx + 4 * scale} ${cy + 7.5 * scale} ${cx} ${cy + 11 * scale} Z`}
        fill={s.bowDark}
      />
    </g>
  );
}

function bodyGradient(id: string, s: Skin) {
  return (
    <defs>
      <linearGradient id={id} x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor={s.bodyTop} />
        <stop offset="55%" stopColor={s.bodyMid} />
        <stop offset="100%" stopColor={s.bodyBot} />
      </linearGradient>
    </defs>
  );
}

function Bow({ x, y, size = 5, fill, dark }: { x: number; y: number; size?: number; fill: string; dark: string }) {
  return (
    <g>
      <path
        d={`M ${x - size * 1.6} ${y - size * 0.7} Q ${x - size * 2.1} ${y} ${x - size * 1.6} ${y + size * 0.7} L ${x - size * 0.3} ${y + size * 0.2} L ${x - size * 0.3} ${y - size * 0.2} Z`}
        fill={fill}
        stroke={dark}
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path
        d={`M ${x + size * 1.6} ${y - size * 0.7} Q ${x + size * 2.1} ${y} ${x + size * 1.6} ${y + size * 0.7} L ${x + size * 0.3} ${y + size * 0.2} L ${x + size * 0.3} ${y - size * 0.2} Z`}
        fill={fill}
        stroke={dark}
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <ellipse cx={x} cy={y} rx={size * 0.5} ry={size * 0.45} fill={dark} stroke={dark} strokeWidth="0.6" />
      <path d={`M ${x - size * 0.4} ${y + size * 0.4} L ${x - size * 0.7} ${y + size * 1.5}`} stroke={dark} strokeWidth="1.4" strokeLinecap="round" />
      <path d={`M ${x + size * 0.4} ${y + size * 0.4} L ${x + size * 0.7} ${y + size * 1.5}`} stroke={dark} strokeWidth="1.4" strokeLinecap="round" />
    </g>
  );
}

function Heart({ cx, cy, size, fill, stroke }: { cx: number; cy: number; size: number; fill: string; stroke: string }) {
  return (
    <path
      d={`M ${cx} ${cy + size * 0.9}
          C ${cx - size * 1.2} ${cy - size * 0.2} ${cx - size * 1.2} ${cy - size * 1} ${cx - size * 0.5} ${cy - size * 1}
          C ${cx - size * 0.1} ${cy - size * 1} ${cx} ${cy - size * 0.5} ${cx} ${cy - size * 0.2}
          C ${cx} ${cy - size * 0.5} ${cx + size * 0.1} ${cy - size * 1} ${cx + size * 0.5} ${cy - size * 1}
          C ${cx + size * 1.2} ${cy - size * 1} ${cx + size * 1.2} ${cy - size * 0.2} ${cx} ${cy + size * 0.9} Z`}
      fill={fill}
      stroke={stroke}
      strokeWidth="1.4"
      strokeLinejoin="round"
    />
  );
}

function Base({ color, gradId }: { color: Color; gradId: string }) {
  const s = skinFor(color);
  return (
    <>
      <ellipse cx="50" cy="93" rx="30" ry="4.5" fill={s.shadow} />
      <ellipse cx="50" cy="88" rx="28" ry="6" fill={`url(#${gradId})`} stroke={s.outline} strokeWidth="2" />
      <ellipse cx="50" cy="86" rx="28" ry="3" fill={s.bodyShadow} opacity="0.3" />
    </>
  );
}

/* =============================== PEÓN =============================== */
export function PrincessPawn({ color, size = 64 }: Props) {
  const s = skinFor(color);
  return wrap(
    <>
      {bodyGradient("ppawn", s)}
      <Base color={color} gradId="ppawn" />
      <path
        d="M40 84 Q38 76 42 65 L58 65 Q62 76 60 84 Z"
        fill="url(#ppawn)"
        stroke={s.outline}
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <ellipse cx="50" cy="65" rx="11" ry="3" fill={s.bow} stroke={s.outline} strokeWidth="1.4" />
      <circle cx="50" cy="48" r="15" fill="url(#ppawn)" stroke={s.outline} strokeWidth="2.2" />
      <PrincessFace color={color} cx={50} cy={48} scale={0.85} />
      <Bow x={50} y={36} size={3.5} fill={s.bow} dark={s.bowDark} />
    </>,
    color,
    size,
  );
}

/* =============================== TORRE =============================== */
export function PrincessRook({ color, size = 64 }: Props) {
  const s = skinFor(color);
  return wrap(
    <>
      {bodyGradient("prook", s)}
      <Base color={color} gradId="prook" />
      <path
        d="M22 84 L22 42 L78 42 L78 84 Z"
        fill="url(#prook)"
        stroke={s.outline}
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      {/* heart-shaped door */}
      <Heart cx={50} cy={72} size={6} fill={s.bow} stroke={s.outline} />
      <path
        d="M20 42 L20 28 L30 28 L30 22 L40 22 L40 28 L46 28 L46 22 L54 22 L54 28 L60 28 L60 22 L70 22 L70 28 L80 28 L80 42 Z"
        fill="url(#prook)"
        stroke={s.outline}
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <rect x="22" y="32" width="56" height="3" fill={s.bow} opacity="0.55" />
      <PrincessFace color={color} cx={50} cy={54} scale={1.05} />
      <Bow x={36} y={26} size={3.5} fill={s.bow} dark={s.bowDark} />
      <Bow x={64} y={26} size={3.5} fill={s.bow} dark={s.bowDark} />
    </>,
    color,
    size,
  );
}

/* =============================== ALFIL =============================== */
export function PrincessBishop({ color, size = 64 }: Props) {
  const s = skinFor(color);
  return wrap(
    <>
      {bodyGradient("pbishop", s)}
      <Base color={color} gradId="pbishop" />
      <path
        d="M34 84 L34 60 L66 60 L66 84 Z"
        fill="url(#pbishop)"
        stroke={s.outline}
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <ellipse cx="50" cy="60" rx="17" ry="4" fill={s.bow} stroke={s.outline} strokeWidth="1.6" />
      <path
        d="M50 8 Q34 26 34 52 Q40 60 50 60 Q60 60 66 52 Q66 26 50 8 Z"
        fill="url(#pbishop)"
        stroke={s.outline}
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      <path d="M40 32 Q50 26 60 32" fill="none" stroke={s.outline} strokeWidth="2.4" strokeLinecap="round" />
      <Bow x={50} y={11} size={4} fill={s.bow} dark={s.bowDark} />
      <PrincessFace color={color} cx={50} cy={46} scale={0.95} />
    </>,
    color,
    size,
  );
}

/* =============================== CABALLO =============================== */
export function PrincessKnight({ color, size = 64 }: Props) {
  const s = skinFor(color);
  return wrap(
    <>
      {bodyGradient("pknight", s)}
      <Base color={color} gradId="pknight" />
      <path
        d="M28 84 L28 64 L72 64 L72 84 Z"
        fill="url(#pknight)"
        stroke={s.outline}
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <path
        d="M30 64 Q22 50 26 36 Q30 22 46 16 Q60 12 70 22 Q78 32 76 46 Q78 54 75 60 Q73 64 70 64 Z"
        fill="url(#pknight)"
        stroke={s.outline}
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      {/* pink wavy mane */}
      <path
        d="M30 36 Q26 30 28 24 Q34 26 32 32 Q36 32 36 38 Q40 36 40 42"
        fill="none"
        stroke={s.bow}
        strokeWidth="3"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path
        d="M32 38 Q28 40 28 44 Q32 44 32 48"
        fill="none"
        stroke={s.bow}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M28 38 L24 42 L28 44 L26 48 L30 48"
        fill={s.bow}
        stroke={s.outline}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      {/* muzzle */}
      <path
        d="M68 38 Q78 42 76 50 L68 50 Z"
        fill={s.bowDark}
        stroke={s.outline}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <ellipse cx="73" cy="46" rx="1.4" ry="2" fill={s.outline} />
      <path d="M66 54 Q70 58 74 54" fill="none" stroke={s.outline} strokeWidth="1.8" strokeLinecap="round" />
      {/* ears */}
      <path d="M44 18 L42 8 L48 14 Z" fill="url(#pknight)" stroke={s.outline} strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M58 14 L62 6 L64 16 Z" fill="url(#pknight)" stroke={s.outline} strokeWidth="1.8" strokeLinejoin="round" />
      {/* big sparkly eye */}
      <ellipse cx="56" cy="34" rx="6.5" ry="7" fill="#ffffff" stroke={s.outline} strokeWidth="1.8" />
      <circle cx="57" cy="35.5" r="3.6" fill="#1a1a1a" />
      <circle cx="55.4" cy="33.5" r="1.7" fill="#ffffff" />
      <circle cx="58.8" cy="36.5" r="0.9" fill="#ffffff" opacity="0.6" />
      {/* eyelashes */}
      <path d="M50 30 L48 27" stroke={s.outline} strokeWidth="1.4" strokeLinecap="round" />
      <path d="M53 28 L52 25" stroke={s.outline} strokeWidth="1.4" strokeLinecap="round" />
      <path d="M56 27 L56 24" stroke={s.outline} strokeWidth="1.4" strokeLinecap="round" />
      <path d="M59 28 L60 25" stroke={s.outline} strokeWidth="1.4" strokeLinecap="round" />
      {/* cheek */}
      <ellipse cx="62" cy="44" rx="2.8" ry="2" fill={s.cheek} opacity="0.7" />
      {/* bow on the head */}
      <Bow x={52} y={18} size={3.5} fill={s.bow} dark={s.bowDark} />
    </>,
    color,
    size,
  );
}

/* =============================== REINA =============================== */
export function PrincessQueen({ color, size = 64 }: Props) {
  const s = skinFor(color);
  return wrap(
    <>
      {bodyGradient("pqueen", s)}
      <Base color={color} gradId="pqueen" />
      <path
        d="M28 84 L30 56 L70 56 L72 84 Z"
        fill="url(#pqueen)"
        stroke={s.outline}
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <ellipse cx="50" cy="56" rx="21" ry="4" fill={s.bow} stroke={s.outline} strokeWidth="1.6" />
      <path
        d="M32 54 Q32 36 50 28 Q68 36 68 54 Z"
        fill="url(#pqueen)"
        stroke={s.outline}
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      {/* tiara — pink with heart */}
      <path
        d="M30 32 L36 16 L42 28 L50 12 L58 28 L64 16 L70 32 L66 38 L34 38 Z"
        fill={s.bow}
        stroke={s.outline}
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <Heart cx={50} cy={11} size={4.5} fill={s.gem} stroke={s.outline} />
      <circle cx="36" cy="16" r="2.4" fill={s.gem} stroke={s.outline} strokeWidth="1.2" />
      <circle cx="64" cy="16" r="2.4" fill={s.gem} stroke={s.outline} strokeWidth="1.2" />
      <rect x="34" y="38" width="32" height="2.5" fill={s.gem} opacity="0.65" />
      <PrincessFace color={color} cx={50} cy={47} scale={1} />
      <Bow x={36} y={70} size={3} fill={s.bow} dark={s.bowDark} />
      <Bow x={64} y={70} size={3} fill={s.bow} dark={s.bowDark} />
    </>,
    color,
    size,
  );
}

/* =============================== REY (Príncipe) =============================== */
export function PrincessKing({ color, size = 64 }: Props) {
  const s = skinFor(color);
  return wrap(
    <>
      {bodyGradient("pking", s)}
      <Base color={color} gradId="pking" />
      <path
        d="M26 84 L28 54 L72 54 L74 84 Z"
        fill="url(#pking)"
        stroke={s.outline}
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <ellipse cx="50" cy="54" rx="23" ry="4" fill={s.bow} stroke={s.outline} strokeWidth="1.6" />
      <path
        d="M30 52 Q30 32 50 22 Q70 32 70 52 Z"
        fill="url(#pking)"
        stroke={s.outline}
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      {/* big crown */}
      <path
        d="M28 28 L34 12 L42 22 L50 6 L58 22 L66 12 L72 28 L68 34 L32 34 Z"
        fill={s.bow}
        stroke={s.outline}
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      {/* big heart on top */}
      <Heart cx={50} cy={4} size={5.5} fill={s.gem} stroke={s.outline} />
      <circle cx="36" cy="14" r="2.6" fill={s.gem} stroke={s.outline} strokeWidth="1.2" />
      <circle cx="64" cy="14" r="2.6" fill={s.gem} stroke={s.outline} strokeWidth="1.2" />
      <rect x="32" y="34" width="36" height="2.5" fill={s.gem} opacity="0.65" />
      <PrincessFace color={color} cx={50} cy={43} scale={1.05} />
      <Bow x={50} y={68} size={4} fill={s.bow} dark={s.bowDark} />
    </>,
    color,
    size,
  );
}

export function PrincessPiece({ piece, size }: { piece: Piece; size?: number }) {
  const props = { color: piece.color, size };
  switch (piece.type) {
    case "p":
      return <PrincessPawn {...props} />;
    case "r":
      return <PrincessRook {...props} />;
    case "n":
      return <PrincessKnight {...props} />;
    case "b":
      return <PrincessBishop {...props} />;
    case "q":
      return <PrincessQueen {...props} />;
    case "k":
      return <PrincessKing {...props} />;
    default:
      return null;
  }
}
