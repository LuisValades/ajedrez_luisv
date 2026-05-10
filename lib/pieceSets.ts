export type PieceSetId = "wood" | "kids" | "princess";

export type BoardPalette = {
  /** Light squares */
  light: string;
  /** Dark squares */
  dark: string;
  /** Frame outer (wood) gradient stops */
  frameStart: string;
  frameMid: string;
  frameEnd: string;
  /** Inner border accent (gold) */
  borderStart: string;
  borderEnd: string;
  /** Last move highlight */
  lastMove: string;
  /** Selected piece ring */
  selected: string;
  /** Hint dot color (legal moves) */
  hint: string;
  /** Capture ring color */
  capture: string;
  /** Threat glow color */
  threat: string;
  /** Border for the board (inner) */
  innerBorder: string;
};

export type PieceSetMeta = {
  id: PieceSetId;
  name: string;
  description: string;
  emoji: string;
  palette: BoardPalette;
  /** A short tagline shown under the name in the picker */
  tagline: string;
};

export const PIECE_SETS: PieceSetMeta[] = [
  {
    id: "wood",
    name: "Clásico",
    tagline: "Madera fina, alto contraste",
    description: "Estilo de torneo clásico, blancas con borde negro y negras con acento dorado.",
    emoji: "♛",
    palette: {
      light: "#F0D9B5",
      dark: "#B58863",
      frameStart: "#8b6f47",
      frameMid: "#6b4423",
      frameEnd: "#4a2f18",
      borderStart: "#d4a04a",
      borderEnd: "#a37020",
      lastMove: "#facc15",
      selected: "#facc15",
      hint: "#42a5f5",
      capture: "#e53935",
      threat: "#f59e0b",
      innerBorder: "#3a2417",
    },
  },
  {
    id: "kids",
    name: "Niños",
    tagline: "Cartoon en azul mágico",
    description: "Piezas 3D con caritas y tinte azul. Casillas celestes y marco azul.",
    emoji: "💙",
    palette: {
      light: "#dbeafe",
      dark: "#3b82f6",
      frameStart: "#60a5fa",
      frameMid: "#1d4ed8",
      frameEnd: "#1e3a8a",
      borderStart: "#fbbf24",
      borderEnd: "#d97706",
      lastMove: "#fde047",
      selected: "#fbbf24",
      hint: "#22d3ee",
      capture: "#ef4444",
      threat: "#f59e0b",
      innerBorder: "#1e3a8a",
    },
  },
  {
    id: "princess",
    name: "Niñas",
    tagline: "Cartoon en rosa princesa",
    description: "Las mismas piezas con tinte rosa. Casillas pastel y marco fucsia.",
    emoji: "💖",
    palette: {
      light: "#fff5f9",
      dark: "#f9a8d4",
      frameStart: "#fbcfe8",
      frameMid: "#ec4899",
      frameEnd: "#9d174d",
      borderStart: "#fde68a",
      borderEnd: "#f59e0b",
      lastMove: "#fde68a",
      selected: "#f472b6",
      hint: "#60a5fa",
      capture: "#ef4444",
      threat: "#fb923c",
      innerBorder: "#831843",
    },
  },
];

export function getPieceSet(id: PieceSetId | undefined): PieceSetMeta {
  return PIECE_SETS.find((p) => p.id === id) ?? PIECE_SETS[0];
}
