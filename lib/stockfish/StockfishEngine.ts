"use client";

import { Chess } from "chess.js";
import type { Square } from "@/lib/chessEngine";
import type { LevelConfig } from "./levels";

export type BestMoveResult = {
  from: Square;
  to: Square;
  promotion?: "q" | "r" | "b" | "n";
  uci: string;
  scoreCp?: number;
  mateIn?: number;
};

type PendingSearch = {
  resolve: (move: BestMoveResult) => void;
  reject: (err: Error) => void;
  lastInfo?: { scoreCp?: number; mateIn?: number };
};

const WORKER_PATH = "/stockfish/stockfish.js";

class StockfishEngine {
  private worker: Worker | null = null;
  private ready = false;
  private readyPromise: Promise<void> | null = null;
  private pending: PendingSearch | null = null;

  init(): Promise<void> {
    if (this.ready) return Promise.resolve();
    if (this.readyPromise) return this.readyPromise;
    if (typeof window === "undefined") return Promise.resolve();

    this.readyPromise = new Promise((resolve, reject) => {
      try {
        this.worker = new Worker(WORKER_PATH);
      } catch (err) {
        reject(err as Error);
        return;
      }

      let gotUci = false;
      const onMessage = (ev: MessageEvent<string>) => {
        const line = typeof ev.data === "string" ? ev.data : "";
        if (!line) return;
        this.handleLine(line);
        if (!gotUci && line.startsWith("uciok")) {
          gotUci = true;
          this.send("setoption name UCI_AnalyseMode value false");
          this.send("isready");
        }
        if (gotUci && line.startsWith("readyok")) {
          this.ready = true;
          resolve();
        }
      };

      const onError = (err: ErrorEvent) => {
        reject(new Error(err.message || "Stockfish worker error"));
      };

      this.worker.addEventListener("message", onMessage);
      this.worker.addEventListener("error", onError);
      this.send("uci");
    });

    return this.readyPromise;
  }

  private send(cmd: string) {
    if (!this.worker) return;
    this.worker.postMessage(cmd);
  }

  private handleLine(line: string) {
    if (!this.pending) return;
    if (line.startsWith("info ")) {
      this.parseInfo(line);
      return;
    }
    if (line.startsWith("bestmove")) {
      this.resolveBestMove(line);
    }
  }

  private parseInfo(line: string) {
    if (!this.pending) return;
    const cpMatch = /score cp (-?\d+)/.exec(line);
    const mateMatch = /score mate (-?\d+)/.exec(line);
    if (cpMatch) {
      this.pending.lastInfo = { scoreCp: parseInt(cpMatch[1], 10) };
    } else if (mateMatch) {
      this.pending.lastInfo = { mateIn: parseInt(mateMatch[1], 10) };
    }
  }

  private resolveBestMove(line: string) {
    if (!this.pending) return;
    const parts = line.split(/\s+/);
    const uci = parts[1] ?? "";
    const pending = this.pending;
    this.pending = null;
    if (!uci || uci === "(none)" || uci === "0000") {
      pending.reject(new Error("No legal move"));
      return;
    }
    const from = uci.slice(0, 2) as Square;
    const to = uci.slice(2, 4) as Square;
    const promo = uci.length >= 5 ? (uci[4] as "q" | "r" | "b" | "n") : undefined;
    pending.resolve({
      from,
      to,
      promotion: promo,
      uci,
      scoreCp: pending.lastInfo?.scoreCp,
      mateIn: pending.lastInfo?.mateIn,
    });
  }

  async newGame(): Promise<void> {
    await this.init();
    this.send("ucinewgame");
    return new Promise((resolve) => {
      const handler = (ev: MessageEvent<string>) => {
        if (typeof ev.data === "string" && ev.data.startsWith("readyok")) {
          this.worker?.removeEventListener("message", handler);
          resolve();
        }
      };
      this.worker?.addEventListener("message", handler);
      this.send("isready");
    });
  }

  applyLevel(level: LevelConfig) {
    this.send(`setoption name Skill Level value ${level.skill}`);
  }

  async getBestMove(fen: string, level: LevelConfig): Promise<BestMoveResult> {
    await this.init();
    if (level.random) {
      return pickRandomMove(fen);
    }

    if (this.pending) {
      this.send("stop");
      const stale = this.pending;
      this.pending = null;
      stale.reject(new Error("Cancelled by new search"));
    }

    this.applyLevel(level);
    return new Promise<BestMoveResult>((resolve, reject) => {
      this.pending = { resolve, reject };
      this.send(`position fen ${fen}`);
      this.send(`go depth ${level.depth} movetime ${level.movetime}`);
    });
  }

  /** Get a strong best move (used for hints), independent of difficulty. */
  async getHint(fen: string): Promise<BestMoveResult> {
    await this.init();
    if (this.pending) {
      this.send("stop");
      const stale = this.pending;
      this.pending = null;
      stale.reject(new Error("Cancelled by hint search"));
    }
    this.send("setoption name Skill Level value 20");
    return new Promise<BestMoveResult>((resolve, reject) => {
      this.pending = { resolve, reject };
      this.send(`position fen ${fen}`);
      this.send(`go depth 12 movetime 800`);
    });
  }

  stop() {
    if (this.worker && this.pending) {
      this.send("stop");
    }
  }

  destroy() {
    if (this.pending) {
      this.pending.reject(new Error("Engine destroyed"));
      this.pending = null;
    }
    this.worker?.terminate();
    this.worker = null;
    this.ready = false;
    this.readyPromise = null;
  }
}

function pickRandomMove(fen: string): BestMoveResult {
  const game = new Chess(fen);
  const moves = game.moves({ verbose: true });
  if (!moves.length) throw new Error("No legal move");
  const m = moves[Math.floor(Math.random() * moves.length)];
  return {
    from: m.from as Square,
    to: m.to as Square,
    promotion: (m.promotion as "q" | "r" | "b" | "n" | undefined) ?? undefined,
    uci: `${m.from}${m.to}${m.promotion ?? ""}`,
  };
}

export function getStockfish(): StockfishEngine {
  if (typeof window === "undefined") {
    return new StockfishEngine();
  }
  const w = window as unknown as { __reino_stockfish?: StockfishEngine };
  if (!w.__reino_stockfish) {
    w.__reino_stockfish = new StockfishEngine();
  }
  return w.__reino_stockfish;
}
