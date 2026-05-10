"use client";

import { Chess } from "chess.js";
import { PieceSvg } from "@/components/board/Pieces";
import type { Color } from "@/lib/chessEngine";

const STARTING = {
  p: 8,
  n: 2,
  b: 2,
  r: 2,
  q: 1,
  k: 1,
} as const;

const VALUE: Record<string, number> = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };

export function CapturedStrip({ fen }: { fen: string }) {
  const game = new Chess(fen);
  const board = game.board();
  const counts: Record<Color, Record<string, number>> = {
    w: { p: 0, n: 0, b: 0, r: 0, q: 0, k: 0 },
    b: { p: 0, n: 0, b: 0, r: 0, q: 0, k: 0 },
  };
  for (const row of board) {
    for (const sq of row) {
      if (sq) counts[sq.color][sq.type] += 1;
    }
  }

  const captured = (color: Color) => {
    const lost: { type: keyof typeof STARTING; n: number }[] = [];
    (Object.keys(STARTING) as (keyof typeof STARTING)[]).forEach((t) => {
      const lostN = STARTING[t] - counts[color][t];
      if (lostN > 0) lost.push({ type: t, n: lostN });
    });
    return lost;
  };

  const score = (forSide: Color) => {
    const opp: Color = forSide === "w" ? "b" : "w";
    const myLost = captured(forSide).reduce((s, x) => s + VALUE[x.type] * x.n, 0);
    const oppLost = captured(opp).reduce((s, x) => s + VALUE[x.type] * x.n, 0);
    return oppLost - myLost;
  };

  const renderCaptured = (color: Color) => {
    const lost = captured(color);
    const adv = score(color === "w" ? "b" : "w");
    if (!lost.length) {
      return (
        <span className="text-xs text-[var(--color-wood-dark)]/40 italic">
          sin capturas
        </span>
      );
    }
    return (
      <span className="flex items-center flex-wrap gap-0.5">
        {lost.flatMap((l) =>
          Array.from({ length: l.n }).map((_, i) => (
            <span
              key={`${l.type}-${i}`}
              className="inline-block"
              style={{ width: 24, height: 24 }}
            >
              <PieceSvg piece={{ type: l.type, color }} size={24} />
            </span>
          )),
        )}
        {adv > 0 && (
          <span className="ml-1 text-xs font-bold text-[var(--color-success)]">
            +{adv}
          </span>
        )}
      </span>
    );
  };

  return (
    <div className="rounded-2xl bg-white/70 px-3 py-2 shadow-[0_3px_0_0_rgba(58,36,23,0.2)]">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-wood-dark)]/50">
            Negras
          </span>
          {renderCaptured("b")}
        </div>
        <div className="flex items-center gap-2 justify-end">
          {renderCaptured("w")}
          <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-wood-dark)]/50">
            Blancas
          </span>
        </div>
      </div>
    </div>
  );
}
