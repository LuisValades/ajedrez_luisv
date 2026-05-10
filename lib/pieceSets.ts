export type PieceSetId = "wood" | "kids" | "princess" | "fairy";

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
    name: "Premium Madera",
    tagline: "Clásico de torneo, alto contraste",
    description: "Silueta limpia, blancas con borde negro grueso, negras con acento dorado.",
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
    tagline: "Caritas amigables, colores cálidos",
    description: "Personajes del reino con expresiones simpáticas. Ideal para los más peques.",
    emoji: "🐲",
    palette: {
      light: "#F5E6C8",
      dark: "#8B6F47",
      frameStart: "#8b6f47",
      frameMid: "#6b4423",
      frameEnd: "#4a2f18",
      borderStart: "#f5c518",
      borderEnd: "#c89409",
      lastMove: "#ffe27a",
      selected: "#f5c518",
      hint: "#42a5f5",
      capture: "#e53935",
      threat: "#ffb300",
      innerBorder: "#3a2417",
    },
  },
  {
    id: "princess",
    name: "Princesas",
    tagline: "Lazos rosa y caritas tiernas",
    description: "Piezas blancas con lazos rosa, gemas, mejillas y pestañas largas.",
    emoji: "👑",
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
  {
    id: "fairy",
    name: "Encantado",
    tagline: "Alas, brillos y magia dorada",
    description: "Estilo cuento de hadas: alas en piezas mayores, brillos dorados, paleta esmeralda.",
    emoji: "✨",
    palette: {
      light: "#fef3c7",
      dark: "#5b9a6c",
      frameStart: "#a7f3d0",
      frameMid: "#10b981",
      frameEnd: "#064e3b",
      borderStart: "#fde68a",
      borderEnd: "#f59e0b",
      lastMove: "#fde68a",
      selected: "#facc15",
      hint: "#22d3ee",
      capture: "#dc2626",
      threat: "#f59e0b",
      innerBorder: "#064e3b",
    },
  },
];

export function getPieceSet(id: PieceSetId | undefined): PieceSetMeta {
  return PIECE_SETS.find((p) => p.id === id) ?? PIECE_SETS[0];
}
