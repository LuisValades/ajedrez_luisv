"use client";

import type { Color, Piece } from "@/lib/chessEngine";

type Skin = {
  bodyTop: string;
  bodyMid: string;
  bodyBot: string;
  bodyShadow: string;
  outline: string;
  accent: string;
  highlight: string;
  shadow: string;
  faceLine: string;
};

const WHITE: Skin = {
  bodyTop: "#ffffff",
  bodyMid: "#f0e7d4",
  bodyBot: "#cdb88f",
  bodyShadow: "#a08760",
  outline: "#3a2417",
  accent: "#f5c518",
  highlight: "#ffffff",
  shadow: "rgba(58,36,23,0.45)",
  faceLine: "#3a2417",
};

const BLACK: Skin = {
  bodyTop: "#5d4031",
  bodyMid: "#3a2417",
  bodyBot: "#1f120a",
  bodyShadow: "#0a0503",
  outline: "#0a0503",
  accent: "#f5c518",
  highlight: "#a37b59",
  shadow: "rgba(0,0,0,0.55)",
  faceLine: "#fff5e0",
};

const skinFor = (c: Color): Skin => (c === "w" ? WHITE : BLACK);

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

/** Big cartoon face: huge sparkly eyes + smile. */
function CartoonFace({
  color,
  cx = 50,
  cy = 48,
  scale = 1,
  smile = "happy",
}: {
  color: Color;
  cx?: number;
  cy?: number;
  scale?: number;
  smile?: "happy" | "wide" | "soft";
}) {
  const s = skinFor(color);
  const eyeR = 5.5 * scale;
  const eyeOffset = 7 * scale;
  const pupilR = 3.2 * scale;
  return (
    <g>
      {/* eye whites */}
      <ellipse
        cx={cx - eyeOffset}
        cy={cy}
        rx={eyeR}
        ry={eyeR * 1.05}
        fill="#ffffff"
        stroke={s.outline}
        strokeWidth={1.5 * scale}
      />
      <ellipse
        cx={cx + eyeOffset}
        cy={cy}
        rx={eyeR}
        ry={eyeR * 1.05}
        fill="#ffffff"
        stroke={s.outline}
        strokeWidth={1.5 * scale}
      />
      {/* pupils — big black with offset for a friendly look */}
      <circle cx={cx - eyeOffset + 0.6} cy={cy + 1} r={pupilR} fill="#1a1a1a" />
      <circle cx={cx + eyeOffset + 0.6} cy={cy + 1} r={pupilR} fill="#1a1a1a" />
      {/* sparkle highlights */}
      <circle cx={cx - eyeOffset - 1} cy={cy - 1.5} r={1.4 * scale} fill="#ffffff" />
      <circle cx={cx + eyeOffset - 1} cy={cy - 1.5} r={1.4 * scale} fill="#ffffff" />
      <circle cx={cx - eyeOffset + 2.2} cy={cy + 2.5} r={0.7 * scale} fill="#ffffff" opacity="0.6" />
      <circle cx={cx + eyeOffset + 2.2} cy={cy + 2.5} r={0.7 * scale} fill="#ffffff" opacity="0.6" />
      {/* smile */}
      {smile === "happy" && (
        <path
          d={`M ${cx - 5 * scale} ${cy + 7 * scale} Q ${cx} ${cy + 11 * scale} ${cx + 5 * scale} ${cy + 7 * scale}`}
          fill="none"
          stroke={s.faceLine}
          strokeWidth={1.8 * scale}
          strokeLinecap="round"
        />
      )}
      {smile === "wide" && (
        <>
          <path
            d={`M ${cx - 7 * scale} ${cy + 7 * scale} Q ${cx} ${cy + 14 * scale} ${cx + 7 * scale} ${cy + 7 * scale} Z`}
            fill="#7a1f17"
            stroke={s.outline}
            strokeWidth={1.5 * scale}
            strokeLinejoin="round"
          />
          <path
            d={`M ${cx - 7 * scale} ${cy + 7 * scale} Q ${cx} ${cy + 9 * scale} ${cx + 7 * scale} ${cy + 7 * scale}`}
            fill="#ffffff"
            stroke="none"
          />
        </>
      )}
      {smile === "soft" && (
        <path
          d={`M ${cx - 4 * scale} ${cy + 7 * scale} Q ${cx} ${cy + 9 * scale} ${cx + 4 * scale} ${cy + 7 * scale}`}
          fill="none"
          stroke={s.faceLine}
          strokeWidth={1.6 * scale}
          strokeLinecap="round"
        />
      )}
    </g>
  );
}

/** Glossy body with vertical 3D gradient. */
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

function Base({ color, gradId }: { color: Color; gradId: string }) {
  const s = skinFor(color);
  return (
    <>
      <ellipse cx="50" cy="93" rx="30" ry="4.5" fill={s.shadow} />
      <ellipse cx="50" cy="88" rx="28" ry="6" fill={`url(#${gradId})`} stroke={s.outline} strokeWidth="2" />
      <ellipse cx="50" cy="86" rx="28" ry="3" fill={s.bodyShadow} opacity="0.35" />
    </>
  );
}

/* =============================== PEÓN =============================== */
export function KidsPawn({ color, size = 64 }: Props) {
  const s = skinFor(color);
  return wrap(
    <>
      {bodyGradient("kpawn", s)}
      <Base color={color} gradId="kpawn" />
      {/* trunk */}
      <path
        d="M40 84 Q38 76 42 65 L58 65 Q62 76 60 84 Z"
        fill="url(#kpawn)"
        stroke={s.outline}
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      {/* collar / waist */}
      <ellipse cx="50" cy="65" rx="11" ry="3" fill={s.bodyShadow} stroke={s.outline} strokeWidth="1.6" />
      {/* head */}
      <circle cx="50" cy="48" r="15" fill="url(#kpawn)" stroke={s.outline} strokeWidth="2.2" />
      {/* face — small */}
      <CartoonFace color={color} cx={50} cy={48} scale={0.85} smile="soft" />
      {/* cheeks */}
      <circle cx="38" cy="54" r="2.2" fill="#ff8aa3" opacity="0.55" />
      <circle cx="62" cy="54" r="2.2" fill="#ff8aa3" opacity="0.55" />
    </>,
    color,
    size,
  );
}

/* =============================== TORRE =============================== */
export function KidsRook({ color, size = 64 }: Props) {
  const s = skinFor(color);
  return wrap(
    <>
      {bodyGradient("krook", s)}
      <Base color={color} gradId="krook" />
      {/* trunk (castle body) */}
      <path
        d="M22 84 L22 42 L78 42 L78 84 Z"
        fill="url(#krook)"
        stroke={s.outline}
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      {/* castle door */}
      <path
        d="M44 84 L44 70 Q50 64 56 70 L56 84 Z"
        fill={s.bodyShadow}
        stroke={s.outline}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <circle cx="46" cy="76" r="0.8" fill={s.accent} />
      {/* battlements */}
      <path
        d="M20 42 L20 28 L30 28 L30 22 L40 22 L40 28 L46 28 L46 22 L54 22 L54 28 L60 28 L60 22 L70 22 L70 28 L80 28 L80 42 Z"
        fill="url(#krook)"
        stroke={s.outline}
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <rect x="22" y="32" width="56" height="3" fill={s.bodyShadow} opacity="0.4" />
      {/* face */}
      <CartoonFace color={color} cx={50} cy={54} scale={1.1} smile="wide" />
    </>,
    color,
    size,
  );
}

/* =============================== ALFIL =============================== */
export function KidsBishop({ color, size = 64 }: Props) {
  const s = skinFor(color);
  return wrap(
    <>
      {bodyGradient("kbishop", s)}
      <Base color={color} gradId="kbishop" />
      {/* trunk */}
      <path
        d="M34 84 L34 60 L66 60 L66 84 Z"
        fill="url(#kbishop)"
        stroke={s.outline}
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      {/* collar */}
      <ellipse cx="50" cy="60" rx="17" ry="4" fill={s.bodyShadow} stroke={s.outline} strokeWidth="1.6" />
      {/* mitre / bishop head — pointy hat */}
      <path
        d="M50 8 Q34 26 34 52 Q40 60 50 60 Q60 60 66 52 Q66 26 50 8 Z"
        fill="url(#kbishop)"
        stroke={s.outline}
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      {/* characteristic horizontal slit on bishop */}
      <path
        d="M40 32 Q50 26 60 32"
        fill="none"
        stroke={s.outline}
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      {/* tip cross */}
      <circle cx="50" cy="9" r="3" fill={s.accent} stroke={s.outline} strokeWidth="1.6" />
      {/* face */}
      <CartoonFace color={color} cx={50} cy={46} scale={0.95} smile="happy" />
      <circle cx="40" cy="54" r="2" fill="#ff8aa3" opacity="0.55" />
      <circle cx="60" cy="54" r="2" fill="#ff8aa3" opacity="0.55" />
    </>,
    color,
    size,
  );
}

/* =============================== CABALLO =============================== */
export function KidsKnight({ color, size = 64 }: Props) {
  const s = skinFor(color);
  return wrap(
    <>
      {bodyGradient("kknight", s)}
      <Base color={color} gradId="kknight" />
      {/* base column */}
      <path
        d="M28 84 L28 64 L72 64 L72 84 Z"
        fill="url(#kknight)"
        stroke={s.outline}
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      {/* horse body — head shape facing right */}
      <path
        d="M30 64 Q22 50 26 36 Q30 22 46 16 Q60 12 70 22 Q78 32 76 46 Q78 54 75 60 Q73 64 70 64 Z"
        fill="url(#kknight)"
        stroke={s.outline}
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      {/* mane along the back */}
      <path
        d="M30 36 Q26 30 28 24 Q34 26 32 32 Q36 32 36 38 Q40 36 40 42"
        fill="none"
        stroke={s.outline}
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path
        d="M28 38 L24 42 L28 44 L26 48 L30 48"
        fill={s.bodyShadow}
        stroke={s.outline}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      {/* nose / muzzle */}
      <path
        d="M68 38 Q78 42 76 50 L68 50 Z"
        fill={s.bodyShadow}
        stroke={s.outline}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      {/* nostril */}
      <ellipse cx="73" cy="46" rx="1.4" ry="2" fill={s.outline} />
      {/* mouth smile */}
      <path d="M66 54 Q70 58 74 54" fill="none" stroke={s.outline} strokeWidth="1.8" strokeLinecap="round" />
      {/* ears */}
      <path
        d="M44 18 L42 8 L48 14 Z"
        fill="url(#kknight)"
        stroke={s.outline}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M58 14 L62 6 L64 16 Z"
        fill="url(#kknight)"
        stroke={s.outline}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      {/* big sparkly eye */}
      <ellipse cx="56" cy="34" rx="6" ry="6.5" fill="#ffffff" stroke={s.outline} strokeWidth="1.8" />
      <circle cx="57" cy="35.5" r="3.6" fill="#1a1a1a" />
      <circle cx="55.4" cy="33.5" r="1.6" fill="#ffffff" />
      <circle cx="58.8" cy="36.5" r="0.9" fill="#ffffff" opacity="0.6" />
      {/* eyebrow for personality */}
      <path d="M50 28 Q56 24 62 28" fill="none" stroke={s.outline} strokeWidth="2" strokeLinecap="round" />
    </>,
    color,
    size,
  );
}

/* =============================== REINA =============================== */
export function KidsQueen({ color, size = 64 }: Props) {
  const s = skinFor(color);
  return wrap(
    <>
      {bodyGradient("kqueen", s)}
      <Base color={color} gradId="kqueen" />
      {/* trunk */}
      <path
        d="M28 84 L30 56 L70 56 L72 84 Z"
        fill="url(#kqueen)"
        stroke={s.outline}
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      {/* belt */}
      <ellipse cx="50" cy="56" rx="21" ry="4" fill={s.bodyShadow} stroke={s.outline} strokeWidth="1.6" />
      {/* head */}
      <path
        d="M32 54 Q32 36 50 28 Q68 36 68 54 Z"
        fill="url(#kqueen)"
        stroke={s.outline}
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      {/* small crown — 5 points with gems */}
      <path
        d="M30 32 L36 16 L42 28 L50 12 L58 28 L64 16 L70 32 L66 38 L34 38 Z"
        fill={s.accent}
        stroke={s.outline}
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <circle cx="36" cy="16" r="2.6" fill="#ef4444" stroke={s.outline} strokeWidth="1.2" />
      <circle cx="50" cy="12" r="3" fill="#22c55e" stroke={s.outline} strokeWidth="1.2" />
      <circle cx="64" cy="16" r="2.6" fill="#3b82f6" stroke={s.outline} strokeWidth="1.2" />
      <rect x="34" y="38" width="32" height="2.5" fill={s.bodyShadow} opacity="0.5" />
      {/* face */}
      <CartoonFace color={color} cx={50} cy={47} scale={1} smile="happy" />
      <circle cx="40" cy="55" r="2.2" fill="#ff8aa3" opacity="0.55" />
      <circle cx="60" cy="55" r="2.2" fill="#ff8aa3" opacity="0.55" />
    </>,
    color,
    size,
  );
}

/* =============================== REY =============================== */
export function KidsKing({ color, size = 64 }: Props) {
  const s = skinFor(color);
  return wrap(
    <>
      {bodyGradient("kking", s)}
      <Base color={color} gradId="kking" />
      {/* trunk — a bit wider than queen */}
      <path
        d="M26 84 L28 54 L72 54 L74 84 Z"
        fill="url(#kking)"
        stroke={s.outline}
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      {/* belt */}
      <ellipse cx="50" cy="54" rx="23" ry="4" fill={s.bodyShadow} stroke={s.outline} strokeWidth="1.6" />
      {/* head — taller than queen */}
      <path
        d="M30 52 Q30 32 50 22 Q70 32 70 52 Z"
        fill="url(#kking)"
        stroke={s.outline}
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      {/* big golden crown with cross */}
      <path
        d="M28 28 L34 12 L42 22 L50 6 L58 22 L66 12 L72 28 L68 34 L32 34 Z"
        fill={s.accent}
        stroke={s.outline}
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      {/* CROSS on top — distinguishing the king */}
      <rect x="48" y="-4" width="4" height="14" fill={s.accent} stroke={s.outline} strokeWidth="1.6" />
      <rect x="44" y="0" width="12" height="4" fill={s.accent} stroke={s.outline} strokeWidth="1.6" />
      {/* gems */}
      <circle cx="34" cy="14" r="2.2" fill="#ef4444" stroke={s.outline} strokeWidth="1.2" />
      <circle cx="50" cy="10" r="2.6" fill="#22c55e" stroke={s.outline} strokeWidth="1.2" />
      <circle cx="66" cy="14" r="2.2" fill="#3b82f6" stroke={s.outline} strokeWidth="1.2" />
      <rect x="32" y="34" width="36" height="2.5" fill={s.bodyShadow} opacity="0.5" />
      {/* face */}
      <CartoonFace color={color} cx={50} cy={43} scale={1.05} smile="happy" />
      <circle cx="38" cy="51" r="2.4" fill="#ff8aa3" opacity="0.55" />
      <circle cx="62" cy="51" r="2.4" fill="#ff8aa3" opacity="0.55" />
      {/* tiny mustache for king personality */}
      <path d="M44 50 Q47 52 50 50 Q53 52 56 50" fill="none" stroke={s.outline} strokeWidth="1.6" strokeLinecap="round" />
    </>,
    color,
    size,
  );
}

export function KidsPiece({ piece, size }: { piece: Piece; size?: number }) {
  const props = { color: piece.color, size };
  switch (piece.type) {
    case "p":
      return <KidsPawn {...props} />;
    case "r":
      return <KidsRook {...props} />;
    case "n":
      return <KidsKnight {...props} />;
    case "b":
      return <KidsBishop {...props} />;
    case "q":
      return <KidsQueen {...props} />;
    case "k":
      return <KidsKing {...props} />;
    default:
      return null;
  }
}
