/** Inline SVG avatars for the kid profile. Each is a simple stylized character. */

export type AvatarId =
  | "princesa"
  | "caballero"
  | "maga"
  | "dragon"
  | "unicornio"
  | "leona"
  | "buho"
  | "estrella";

export type AvatarDef = {
  id: AvatarId;
  name: string;
  emoji: string;
  bg: string;
};

export const AVATARS: AvatarDef[] = [
  { id: "princesa", name: "Princesa", emoji: "👸", bg: "from-[#fbcfe8] to-[#f472b6]" },
  { id: "caballero", name: "Caballero", emoji: "🤴", bg: "from-[#bae6fd] to-[#0ea5e9]" },
  { id: "maga", name: "Maga", emoji: "🧙‍♀️", bg: "from-[#ddd6fe] to-[#8b5cf6]" },
  { id: "dragon", name: "Dragón", emoji: "🐲", bg: "from-[#a7f3d0] to-[#10b981]" },
  { id: "unicornio", name: "Unicornio", emoji: "🦄", bg: "from-[#fde68a] to-[#f59e0b]" },
  { id: "leona", name: "Leona", emoji: "🦁", bg: "from-[#fed7aa] to-[#ea580c]" },
  { id: "buho", name: "Búho", emoji: "🦉", bg: "from-[#e7e5e4] to-[#78716c]" },
  { id: "estrella", name: "Estrella", emoji: "⭐", bg: "from-[#fef3c7] to-[#f59e0b]" },
];

export function getAvatar(id: AvatarId | undefined): AvatarDef {
  return AVATARS.find((a) => a.id === id) ?? AVATARS[0];
}
