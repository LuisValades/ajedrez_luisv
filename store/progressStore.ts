"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type LessonId =
  | "intro"
  | "peon"
  | "torre"
  | "alfil"
  | "reina"
  | "rey"
  | "caballo";

export type MinigameId =
  | "peon-aventurero"
  | "torre-constructora"
  | "alfil-mago"
  | "caballo-saltarin"
  | "reina-del-reino"
  | "rey-valiente";

type ProgressState = {
  lessonsCompleted: LessonId[];
  puzzlesSolved: Record<string, { stars: number; tries: number }>;
  minigameStars: Record<MinigameId, Record<number, number>>;
  totalStars: number;
  badges: string[];
  lastSeenAt?: number;
  completeLesson: (id: LessonId) => void;
  recordPuzzle: (id: string, stars: number, tries: number) => void;
  recordMinigame: (id: MinigameId, level: number, stars: number) => void;
  awardBadge: (badge: string) => void;
  resetAll: () => void;
};

const computeTotalStars = (state: Omit<ProgressState, "totalStars">): number => {
  let total = 0;
  for (const v of Object.values(state.puzzlesSolved)) total += v.stars;
  for (const map of Object.values(state.minigameStars)) {
    for (const s of Object.values(map)) total += s;
  }
  total += state.lessonsCompleted.length * 3;
  return total;
};

export const useProgressStore = create<ProgressState>()(
  persist(
    (set) => ({
      lessonsCompleted: [],
      puzzlesSolved: {},
      minigameStars: {
        "peon-aventurero": {},
        "torre-constructora": {},
        "alfil-mago": {},
        "caballo-saltarin": {},
        "reina-del-reino": {},
        "rey-valiente": {},
      },
      totalStars: 0,
      badges: [],
      completeLesson: (id) =>
        set((s) => {
          if (s.lessonsCompleted.includes(id)) return s;
          const next = {
            ...s,
            lessonsCompleted: [...s.lessonsCompleted, id],
            badges: s.badges.includes(`lesson-${id}`)
              ? s.badges
              : [...s.badges, `lesson-${id}`],
          };
          return { ...next, totalStars: computeTotalStars(next) };
        }),
      recordPuzzle: (id, stars, tries) =>
        set((s) => {
          const prev = s.puzzlesSolved[id];
          const bestStars = Math.max(prev?.stars ?? 0, stars);
          const bestTries = prev ? Math.min(prev.tries, tries) : tries;
          const next = {
            ...s,
            puzzlesSolved: {
              ...s.puzzlesSolved,
              [id]: { stars: bestStars, tries: bestTries },
            },
          };
          return { ...next, totalStars: computeTotalStars(next) };
        }),
      recordMinigame: (id, level, stars) =>
        set((s) => {
          const prev = s.minigameStars[id]?.[level] ?? 0;
          const best = Math.max(prev, stars);
          const next = {
            ...s,
            minigameStars: {
              ...s.minigameStars,
              [id]: { ...(s.minigameStars[id] ?? {}), [level]: best },
            },
          };
          return { ...next, totalStars: computeTotalStars(next) };
        }),
      awardBadge: (badge) =>
        set((s) =>
          s.badges.includes(badge)
            ? s
            : { ...s, badges: [...s.badges, badge] },
        ),
      resetAll: () =>
        set({
          lessonsCompleted: [],
          puzzlesSolved: {},
          minigameStars: {
            "peon-aventurero": {},
            "torre-constructora": {},
            "alfil-mago": {},
            "caballo-saltarin": {},
            "reina-del-reino": {},
            "rey-valiente": {},
          },
          totalStars: 0,
          badges: [],
        }),
      lastSeenAt: undefined,
    }),
    {
      name: "reino-progress",
      storage: createJSONStorage(() => localStorage),
      version: 1,
    },
  ),
);

// Trigger initial total computation on first load (after rehydrate).
if (typeof window !== "undefined") {
  setTimeout(() => {
    const s = useProgressStore.getState();
    const total = computeTotalStars(s);
    if (total !== s.totalStars) {
      useProgressStore.setState({ totalStars: total });
    }
  }, 100);
}
