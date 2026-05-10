"use client";

import { create } from "zustand";
import {
  STARTING_FEN,
  type Color,
  type MoveResult,
  type Square,
} from "@/lib/chessEngine";
import type { LevelId } from "@/lib/stockfish/levels";

export type PartidaStage = "level" | "color" | "coinflip" | "playing" | "ended";

export type EndReason =
  | "checkmate-player"
  | "checkmate-ia"
  | "stalemate"
  | "draw"
  | "resign";

type HistoryEntry = {
  fen: string;
  san?: string;
  from?: Square;
  to?: Square;
  captured?: string;
  byIa?: boolean;
};

type PartidaState = {
  stage: PartidaStage;
  level: LevelId;
  playerColor: Color;
  fen: string;
  history: HistoryEntry[];
  iaThinking: boolean;
  hint: { from: Square; to: Square } | null;
  endReason: EndReason | null;
  setStage: (s: PartidaStage) => void;
  setLevel: (id: LevelId) => void;
  setPlayerColor: (c: Color) => void;
  startPartida: () => void;
  pushPlayerMove: (r: MoveResult) => void;
  pushIaMove: (r: MoveResult) => void;
  setIaThinking: (v: boolean) => void;
  setHint: (h: { from: Square; to: Square } | null) => void;
  finish: (reason: EndReason) => void;
  undoLastPair: () => void;
  resetToSelector: () => void;
  rematch: () => void;
};

const initialEntry: HistoryEntry = { fen: STARTING_FEN };

export const usePartidaStore = create<PartidaState>((set) => ({
  stage: "level",
  level: "cachorro",
  playerColor: "w",
  fen: STARTING_FEN,
  history: [initialEntry],
  iaThinking: false,
  hint: null,
  endReason: null,
  setStage: (s) => set({ stage: s }),
  setLevel: (id) => set({ level: id }),
  setPlayerColor: (c) => set({ playerColor: c }),
  startPartida: () =>
    set({
      stage: "playing",
      fen: STARTING_FEN,
      history: [initialEntry],
      iaThinking: false,
      hint: null,
      endReason: null,
    }),
  pushPlayerMove: (r) =>
    set((state) => ({
      fen: r.newFen,
      hint: null,
      history: [
        ...state.history,
        {
          fen: r.newFen,
          san: r.san,
          from: r.from,
          to: r.to,
          captured: r.captured,
        },
      ],
    })),
  pushIaMove: (r) =>
    set((state) => ({
      fen: r.newFen,
      iaThinking: false,
      history: [
        ...state.history,
        {
          fen: r.newFen,
          san: r.san,
          from: r.from,
          to: r.to,
          captured: r.captured,
          byIa: true,
        },
      ],
    })),
  setIaThinking: (v) => set({ iaThinking: v }),
  setHint: (h) => set({ hint: h }),
  finish: (reason) => set({ stage: "ended", endReason: reason, iaThinking: false }),
  undoLastPair: () =>
    set((state) => {
      if (state.history.length <= 1) return state;
      let next = state.history;
      // Pop IA move if present at top
      if (next[next.length - 1].byIa && next.length > 1) {
        next = next.slice(0, -1);
      }
      // Pop player move
      if (next.length > 1) {
        next = next.slice(0, -1);
      }
      return {
        history: next,
        fen: next[next.length - 1].fen,
        hint: null,
        endReason: null,
        stage: "playing",
      };
    }),
  resetToSelector: () =>
    set({
      stage: "level",
      fen: STARTING_FEN,
      history: [initialEntry],
      iaThinking: false,
      hint: null,
      endReason: null,
    }),
  rematch: () =>
    set({
      stage: "playing",
      fen: STARTING_FEN,
      history: [initialEntry],
      iaThinking: false,
      hint: null,
      endReason: null,
    }),
}));
