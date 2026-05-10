export type LevelId = "pollito" | "cachorro" | "lobo" | "leon" | "dragon";

export type LevelConfig = {
  id: LevelId;
  index: number;
  name: string;
  emoji: string;
  short: string;
  blurb: string;
  /** UCI Skill Level 0..20 */
  skill: number;
  /** Search depth */
  depth: number;
  /** Movetime in milliseconds */
  movetime: number;
  /** If true, IA picks a random legal move (no engine call) */
  random?: boolean;
  /** Number of stars required to unlock */
  unlockStars: number;
  /** Tailwind gradient class */
  gradient: string;
  /** Voice line when chosen */
  voiceChosen: string;
  /** Voice line when wins */
  voiceWin: string;
  /** Voice line when loses */
  voiceLose: string;
};

export const LEVELS: LevelConfig[] = [
  {
    id: "pollito",
    index: 0,
    name: "Pollito",
    emoji: "🐤",
    short: "Muy fácil",
    blurb: "Apenas pía, juega con suerte.",
    skill: 0,
    depth: 1,
    movetime: 200,
    random: true,
    unlockStars: 0,
    gradient: "from-[#fef3c7] via-[#fde68a] to-[#f59e0b]",
    voiceChosen: "¡Va! Pollito es facilito, perfecto para empezar.",
    voiceWin: "¡Le ganaste a Pollito! ¡Súper!",
    voiceLose: "¡Casi! La próxima ganarás, ¿quieres revancha?",
  },
  {
    id: "cachorro",
    index: 1,
    name: "Cachorro",
    emoji: "🐶",
    short: "Fácil",
    blurb: "Mueve con cariño, no muerde fuerte.",
    skill: 3,
    depth: 2,
    movetime: 300,
    unlockStars: 0,
    gradient: "from-[#fed7aa] via-[#fb923c] to-[#c2410c]",
    voiceChosen: "Cachorro es bueno onda, pero pelea más que Pollito.",
    voiceWin: "¡Bravo! Le ganaste al Cachorro.",
    voiceLose: "Casi casi. ¡Otra vez tú puedes!",
  },
  {
    id: "lobo",
    index: 2,
    name: "Lobo",
    emoji: "🐺",
    short: "Medio",
    blurb: "Aulla y caza piezas con maña.",
    skill: 8,
    depth: 4,
    movetime: 600,
    unlockStars: 0,
    gradient: "from-[#cbd5e1] via-[#64748b] to-[#1e293b]",
    voiceChosen: "Lobo es astuto. ¡Saca tus mejores movidas!",
    voiceWin: "¡Le ganaste al Lobo, eres una fiera!",
    voiceLose: "Lobo aulló más fuerte hoy. ¡Otra ronda y a ganarle!",
  },
  {
    id: "leon",
    index: 3,
    name: "León",
    emoji: "🦁",
    short: "Difícil",
    blurb: "Rey de la selva del tablero.",
    skill: 14,
    depth: 6,
    movetime: 1000,
    unlockStars: 0,
    gradient: "from-[#fde68a] via-[#d97706] to-[#7c2d12]",
    voiceChosen: "¡León! Pelea bien, vas a tener que pensar.",
    voiceWin: "¡Le ganaste al León! ¡Eres campeona del reino!",
    voiceLose: "El León rugió fuerte. ¡A entrenar y volvemos!",
  },
  {
    id: "dragon",
    index: 4,
    name: "Dragón",
    emoji: "🐲",
    short: "Maestro",
    blurb: "Solo el más valiente lo enfrenta.",
    skill: 20,
    depth: 10,
    movetime: 1800,
    unlockStars: 50,
    gradient: "from-[#fca5a5] via-[#dc2626] to-[#7f1d1d]",
    voiceChosen: "¡Eres muy valiente! El Dragón pelea con todo.",
    voiceWin: "¡Le ganaste al Dragón! ¡Eres leyenda del reino!",
    voiceLose: "El Dragón es duro. Pero tú puedes con todo, ¡otra vez!",
  },
];

export function getLevel(id: LevelId): LevelConfig {
  return LEVELS.find((l) => l.id === id) ?? LEVELS[0];
}
