"use client";

import { create } from "zustand";
import { STARTING_FEN, type Color, type MoveResult } from "@/lib/chessEngine";

export type HistoryEntry = {
  fen: string;
  san?: string;
  from?: string;
  to?: string;
  captured?: string;
};

type GameState = {
  fen: string;
  history: HistoryEntry[];
  orientation: Color;
  showHints: boolean;
  showThreats: boolean;
  showCoordinates: boolean;
  pushMove: (result: MoveResult) => void;
  undo: () => void;
  reset: () => void;
  flipBoard: () => void;
  toggleHints: () => void;
  toggleThreats: () => void;
  toggleCoordinates: () => void;
};

const initialEntry: HistoryEntry = { fen: STARTING_FEN };

export const useGameStore = create<GameState>((set) => ({
  fen: STARTING_FEN,
  history: [initialEntry],
  orientation: "w",
  showHints: true,
  showThreats: true,
  showCoordinates: false,
  pushMove: (result) =>
    set((state) => ({
      fen: result.newFen,
      history: [
        ...state.history,
        {
          fen: result.newFen,
          san: result.san,
          from: result.from,
          to: result.to,
          captured: result.captured,
        },
      ],
    })),
  undo: () =>
    set((state) => {
      if (state.history.length <= 1) return state;
      const next = state.history.slice(0, -1);
      return { history: next, fen: next[next.length - 1].fen };
    }),
  reset: () => set({ fen: STARTING_FEN, history: [initialEntry] }),
  flipBoard: () =>
    set((state) => ({ orientation: state.orientation === "w" ? "b" : "w" })),
  toggleHints: () => set((state) => ({ showHints: !state.showHints })),
  toggleThreats: () => set((state) => ({ showThreats: !state.showThreats })),
  toggleCoordinates: () =>
    set((state) => ({ showCoordinates: !state.showCoordinates })),
}));
