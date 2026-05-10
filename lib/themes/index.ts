/**
 * Theme system for ReinoChess.
 *
 * A Theme = board palette (light/dark/frame) + two PLAYER palettes (fill/stroke/accent).
 * Player1 = white/bottom side, Player2 = black/top side.
 *
 * Rule: within a theme, the two player palettes must use DIFFERENT HUES, not just
 * light vs dark of the same hue — otherwise pieces camouflage against the board.
 *
 * Adding a new theme = add an entry to THEMES with 8 hex colors.
 */

export type ThemeId = "clasico" | "ninos" | "ninas";

export type PlayerPalette = {
  /** Main body fill of the piece silhouette */
  fill: string;
  /** Outline / stroke around the silhouette */
  stroke: string;
  /** Secondary accents: crowns, ornaments, jewels */
  accent: string;
};

export type BoardPalette = {
  /** Light squares */
  light: string;
  /** Dark squares */
  dark: string;
  /** Frame around the board */
  frame: string;
};

/** How the piece is rendered for this theme. */
export type PieceStyle = "svg" | "cartoon";

export type Theme = {
  id: ThemeId;
  name: string;
  short: string;
  description: string;
  emoji: string;
  board: BoardPalette;
  player1: PlayerPalette;
  player2: PlayerPalette;
  /** "svg" uses Wood-style SVG geometry coloured via CSS vars from `player1/2`.
   *  "cartoon" loads pre-coloured PNGs from `/pieces/{id}/{w|b}/{type}.png`. */
  pieceStyle: PieceStyle;
  /** Highlight colors derived for this theme */
  highlights: {
    lastMove: string;
    selected: string;
    hint: string;
    capture: string;
    threat: string;
    innerBorder: string;
    /** Frame inner gold-ish accent strip */
    border: string;
  };
};

export const THEMES: Record<ThemeId, Theme> = {
  clasico: {
    id: "clasico",
    name: "Clásico",
    short: "Madera fina",
    description: "Madera elegante, alto contraste",
    emoji: "🏛",
    pieceStyle: "svg",
    board: { light: "#F0D9B5", dark: "#B58863", frame: "#5D4A2C" },
    player1: { fill: "#FFFFFF", stroke: "#1A1A1A", accent: "#C8CDD3" },
    player2: { fill: "#1A1A1A", stroke: "#F5C518", accent: "#F5C518" },
    highlights: {
      lastMove: "#facc15",
      selected: "#facc15",
      hint: "#42a5f5",
      capture: "#e53935",
      threat: "#f59e0b",
      innerBorder: "#3a2417",
      border: "#d4a04a",
    },
  },
  ninos: {
    id: "ninos",
    name: "Niños",
    short: "Bronce vs Acero",
    description: "Caballeros kawaii bronce contra acero",
    emoji: "⚔️",
    pieceStyle: "cartoon",
    board: { light: "#DCE4F0", dark: "#4A6FA5", frame: "#1B3A6F" },
    player1: { fill: "#B8702E", stroke: "#5C320B", accent: "#FFCC80" },
    player2: { fill: "#37474F", stroke: "#0E1B22", accent: "#B0BEC5" },
    highlights: {
      lastMove: "#FFD54F",
      selected: "#FFD54F",
      hint: "#22d3ee",
      capture: "#ef4444",
      threat: "#f59e0b",
      innerBorder: "#1B3A6F",
      border: "#fbbf24",
    },
  },
  ninas: {
    id: "ninas",
    name: "Niñas",
    short: "Lavanda vs Fucsia",
    description: "Princesas kawaii lavanda vs fucsia",
    emoji: "💜",
    pieceStyle: "cartoon",
    board: { light: "#FCE4F0", dark: "#E591BF", frame: "#6B2D8F" },
    player1: { fill: "#EFE4F7", stroke: "#5C2480", accent: "#FFFFFF" },
    player2: { fill: "#D81B60", stroke: "#5C0A28", accent: "#FFD4E5" },
    highlights: {
      lastMove: "#fde68a",
      selected: "#fde68a",
      hint: "#60a5fa",
      capture: "#ef4444",
      threat: "#fb923c",
      innerBorder: "#6B2D8F",
      border: "#fbbf24",
    },
  },
};

export const THEMES_LIST: Theme[] = Object.values(THEMES);

export function getTheme(id: ThemeId | undefined): Theme {
  if (id && THEMES[id]) return THEMES[id];
  return THEMES.clasico;
}

/**
 * Alternative palettes (kept ready, not active in the picker).
 * To enable: copy any of these into THEMES above with a unique id.
 *
 * ninos_joya = Esmeralda vs Carmesí (joyas mágicas)
 *   board:   { light: "#DCE4F0", dark: "#4A6FA5", frame: "#1B3A6F" }
 *   player1: { fill: "#1B8B4F", stroke: "#0A3D24", accent: "#95E5B5" }
 *   player2: { fill: "#B71C50", stroke: "#4A0F22", accent: "#FFB3D9" }
 *
 * ninos_hielo = Hielo vs Fuego
 *   board:   { light: "#DCE4F0", dark: "#4A6FA5", frame: "#1B3A6F" }
 *   player1: { fill: "#FFFFFF", stroke: "#1B3A6F", accent: "#C8DAEF" }
 *   player2: { fill: "#C9302C", stroke: "#6B0F0E", accent: "#FFB3B0" }
 *
 * ninas_menta = Crema vs Turquesa
 *   board:   { light: "#FCE4F0", dark: "#E591BF", frame: "#6B2D8F" }
 *   player1: { fill: "#FFF4DC", stroke: "#8B5A2B", accent: "#FFFFFF" }
 *   player2: { fill: "#22B8A8", stroke: "#0A4A42", accent: "#A8E8E0" }
 */
