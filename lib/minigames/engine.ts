import type { MgPieceKind, Square } from "./types";

const FILES = ["a", "b", "c", "d", "e", "f", "g", "h"] as const;

export function sq(file: number, rank: number): Square {
  return `${FILES[file]}${rank + 1}`;
}

export function parseSq(s: Square): { file: number; rank: number } {
  const file = FILES.indexOf(s[0] as (typeof FILES)[number]);
  const rank = parseInt(s.slice(1), 10) - 1;
  return { file, rank };
}

type CellState = {
  blocked: boolean; // obstacle that blocks movement entirely (rock, fire, enemy)
  blocksPath: boolean; // blocks path-of-sight (rocks/items in path block sliding pieces)
};

export function legalMovesForPiece(
  kind: MgPieceKind,
  from: Square,
  /** map of square -> what's there */
  state: Map<Square, CellState>,
  /** number of forward direction for pawn ("w" up, "b" down) */
  pawnDir: "w" | "b" = "w",
): Square[] {
  const { file: ff, rank: fr } = parseSq(from);
  const moves: Square[] = [];

  const tryAdd = (df: number, dr: number) => {
    const nf = ff + df;
    const nr = fr + dr;
    if (nf < 0 || nf > 7 || nr < 0 || nr > 7) return;
    const target = sq(nf, nr);
    const st = state.get(target);
    if (!st || (!st.blocked && !st.blocksPath)) {
      moves.push(target);
    } else if (!st.blocked) {
      moves.push(target); // ítem está aquí, recogemos al moverse
    }
    // si st.blocked → no agregar
  };

  const slide = (df: number, dr: number, maxSteps = 7) => {
    for (let step = 1; step <= maxSteps; step++) {
      const nf = ff + df * step;
      const nr = fr + dr * step;
      if (nf < 0 || nf > 7 || nr < 0 || nr > 7) return;
      const target = sq(nf, nr);
      const st = state.get(target);
      if (st?.blocked) return; // obstáculo que bloquea
      moves.push(target);
      if (st?.blocksPath) return; // ítem en path: podemos pisar pero no continuar
    }
  };

  switch (kind) {
    case "p": {
      const fwd = pawnDir === "w" ? 1 : -1;
      tryAdd(0, fwd); // adelante
      // captura diagonal solo si hay enemigo (manejado por blocked/blocksPath en motor del juego)
      tryAdd(-1, fwd);
      tryAdd(1, fwd);
      break;
    }
    case "r": {
      slide(1, 0);
      slide(-1, 0);
      slide(0, 1);
      slide(0, -1);
      break;
    }
    case "b": {
      slide(1, 1);
      slide(-1, 1);
      slide(1, -1);
      slide(-1, -1);
      break;
    }
    case "q": {
      slide(1, 0);
      slide(-1, 0);
      slide(0, 1);
      slide(0, -1);
      slide(1, 1);
      slide(-1, 1);
      slide(1, -1);
      slide(-1, -1);
      break;
    }
    case "k": {
      tryAdd(1, 0);
      tryAdd(-1, 0);
      tryAdd(0, 1);
      tryAdd(0, -1);
      tryAdd(1, 1);
      tryAdd(-1, 1);
      tryAdd(1, -1);
      tryAdd(-1, -1);
      break;
    }
    case "n": {
      const deltas = [
        [1, 2],
        [2, 1],
        [-1, 2],
        [-2, 1],
        [1, -2],
        [2, -1],
        [-1, -2],
        [-2, -1],
      ];
      for (const [df, dr] of deltas) {
        tryAdd(df, dr);
      }
      break;
    }
  }
  return moves;
}

export type CellState_ = CellState;
