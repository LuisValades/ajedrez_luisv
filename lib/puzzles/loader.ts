import catalog from "./catalog.json";

export type PuzzleTheme =
  | "mate-en-1"
  | "captura"
  | "defiende-rey"
  | "promociona-peon";

export type Puzzle = {
  id: string;
  tema: PuzzleTheme;
  titulo: string;
  fen: string;
  lado: "blancas" | "negras";
  solucion: string[];
  pista_voz: string;
};

export const PUZZLES: Puzzle[] = catalog as Puzzle[];

export const THEME_META: Record<
  PuzzleTheme,
  { label: string; emoji: string; color: string }
> = {
  "mate-en-1": {
    label: "Mate en 1",
    emoji: "♛",
    color: "from-[#fde68a] via-[#f59e0b] to-[#b45309]",
  },
  captura: {
    label: "Captura",
    emoji: "⚔️",
    color: "from-[#fda4af] via-[#fb7185] to-[#e11d48]",
  },
  "defiende-rey": {
    label: "Defiende al Rey",
    emoji: "🛡️",
    color: "from-[#bae6fd] via-[#38bdf8] to-[#0369a1]",
  },
  "promociona-peon": {
    label: "Promueve al Peón",
    emoji: "✨",
    color: "from-[#a7f3d0] via-[#34d399] to-[#047857]",
  },
};

export function getPuzzle(id: string): Puzzle | undefined {
  return PUZZLES.find((p) => p.id === id);
}

export function nextPuzzleId(currentId: string): string | null {
  const idx = PUZZLES.findIndex((p) => p.id === currentId);
  if (idx < 0 || idx >= PUZZLES.length - 1) return null;
  return PUZZLES[idx + 1].id;
}
