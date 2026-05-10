"use client";

import { Chess } from "chess.js";
import { PieceSvg } from "@/components/board/Pieces";
import { useSettingsStore } from "@/store/settingsStore";
import { getTheme } from "@/lib/themes";
import type { Color, Piece } from "@/lib/chessEngine";

const STARTING = {
  p: 8,
  n: 2,
  b: 2,
  r: 2,
  q: 1,
  k: 1,
} as const;

const VALUE: Record<string, number> = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };

/** Group order for icons — pawns first, then minor, major, queen. */
const TYPE_ORDER: Piece["type"][] = ["p", "n", "b", "r", "q"];

export function CapturedStrip({ fen }: { fen: string }) {
  const themeId = useSettingsStore((s) => s.themeId);
  const theme = getTheme(themeId);
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

  /** Pieces this color has LOST (i.e. that the other side captured). */
  const lostBy = (color: Color) =>
    TYPE_ORDER.flatMap((t) => {
      const n = STARTING[t] - counts[color][t];
      return n > 0 ? [{ type: t, n }] : [];
    });

  const score = (forSide: Color) => {
    const opp: Color = forSide === "w" ? "b" : "w";
    const myLostPts = lostBy(forSide).reduce((s, x) => s + VALUE[x.type] * x.n, 0);
    const oppLostPts = lostBy(opp).reduce((s, x) => s + VALUE[x.type] * x.n, 0);
    return oppLostPts - myLostPts;
  };

  const renderRow = (capturerSide: Color) => {
    // Show pieces of the OPPONENT that this side captured.
    const oppSide: Color = capturerSide === "w" ? "b" : "w";
    const lost = lostBy(oppSide);
    const palette = oppSide === "w" ? theme.player1 : theme.player2;
    const adv = score(capturerSide);

    if (!lost.length) {
      return (
        <span className="text-[10px] text-[var(--color-wood-dark)]/40 italic">
          —
        </span>
      );
    }

    return (
      <span className="flex items-center flex-wrap gap-1">
        {lost.map((entry) => (
          <span
            key={entry.type}
            className="relative inline-flex items-center justify-center"
            style={{ width: 26, height: 26 }}
          >
            <PieceSvg
              piece={{ type: entry.type, color: oppSide }}
              size={26}
              palette={palette}
            />
            {entry.n > 1 && (
              <span
                aria-label={`${entry.n} ${entry.type}`}
                className="absolute -bottom-1 -right-1 inline-flex h-[14px] min-w-[14px] items-center justify-center rounded-full bg-[var(--color-wood-dark)] px-[3px] text-[9px] font-bold leading-none text-white"
              >
                ×{entry.n}
              </span>
            )}
          </span>
        ))}
        {adv > 0 && (
          <span className="ml-1 text-xs font-bold text-[var(--color-success)]">
            +{adv}
          </span>
        )}
      </span>
    );
  };

  return (
    <div className="rounded-2xl bg-white/70 px-2.5 py-1.5 shadow-[0_3px_0_0_rgba(58,36,23,0.2)]">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <span aria-hidden className="text-base">⚪</span>
          {renderRow("w")}
        </div>
        <span aria-hidden className="text-[var(--color-wood-dark)]/30 text-xs font-bold">
          vs
        </span>
        <div className="flex items-center gap-1.5 justify-end min-w-0">
          {renderRow("b")}
          <span aria-hidden className="text-base">⚫</span>
        </div>
      </div>
    </div>
  );
}
