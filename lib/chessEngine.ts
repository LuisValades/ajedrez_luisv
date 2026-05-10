import { Chess, type Square as ChessJsSquare, type Color as ChessJsColor, type PieceSymbol } from "chess.js";

export type Square = ChessJsSquare;
export type Color = ChessJsColor;
export type Piece = { type: PieceSymbol; color: Color };

export type MoveResult = {
  ok: boolean;
  newFen: string;
  san?: string;
  from?: Square;
  to?: Square;
  captured?: PieceSymbol;
  isCheck: boolean;
  isCheckmate: boolean;
  isStalemate: boolean;
  isDraw: boolean;
  turn: Color;
};

export const STARTING_FEN =
  "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

const FILES = ["a", "b", "c", "d", "e", "f", "g", "h"] as const;

export function squareToCoords(square: Square): { file: number; rank: number } {
  const file = FILES.indexOf(square[0] as (typeof FILES)[number]);
  const rank = 8 - parseInt(square[1], 10);
  return { file, rank };
}

export function coordsToSquare(file: number, rank: number): Square {
  return `${FILES[file]}${8 - rank}` as Square;
}

export function buildEmptyBoard(): (Piece | null)[][] {
  return Array.from({ length: 8 }, () => Array<Piece | null>(8).fill(null));
}

export function fenToBoard(fen: string): (Piece | null)[][] {
  const game = new Chess(fen);
  const board = game.board();
  const out = buildEmptyBoard();
  for (let r = 0; r < 8; r++) {
    for (let f = 0; f < 8; f++) {
      const sq = board[r][f];
      out[r][f] = sq ? { type: sq.type, color: sq.color } : null;
    }
  }
  return out;
}

export function getLegalMoves(fen: string, square: Square): Square[] {
  const game = new Chess(fen);
  const moves = game.moves({ square, verbose: true });
  return moves.map((m) => m.to as Square);
}

export function getCaptureMoves(fen: string, square: Square): Square[] {
  const game = new Chess(fen);
  return game
    .moves({ square, verbose: true })
    .filter((m) => m.flags.includes("c") || m.flags.includes("e"))
    .map((m) => m.to as Square);
}

export function isPromotionMove(fen: string, from: Square, to: Square): boolean {
  const game = new Chess(fen);
  const piece = game.get(from);
  if (!piece || piece.type !== "p") return false;
  const targetRank = to[1];
  return (
    (piece.color === "w" && targetRank === "8") ||
    (piece.color === "b" && targetRank === "1")
  );
}

export function makeMove(
  fen: string,
  from: Square,
  to: Square,
  promotion: PieceSymbol = "q"
): MoveResult {
  const game = new Chess(fen);
  try {
    const move = game.move({ from, to, promotion });
    if (!move) {
      return failedMove(game);
    }
    return {
      ok: true,
      newFen: game.fen(),
      san: move.san,
      from: move.from as Square,
      to: move.to as Square,
      captured: move.captured ?? undefined,
      isCheck: game.inCheck(),
      isCheckmate: game.isCheckmate(),
      isStalemate: game.isStalemate(),
      isDraw: game.isDraw(),
      turn: game.turn(),
    };
  } catch {
    return failedMove(game);
  }
}

function failedMove(game: Chess): MoveResult {
  return {
    ok: false,
    newFen: game.fen(),
    isCheck: game.inCheck(),
    isCheckmate: game.isCheckmate(),
    isStalemate: game.isStalemate(),
    isDraw: game.isDraw(),
    turn: game.turn(),
  };
}

export function getThreatenedSquares(fen: string, color: Color): Square[] {
  const game = new Chess(fen);
  const enemyColor: Color = color === "w" ? "b" : "w";
  const threatened = new Set<Square>();
  const board = game.board();
  const myPieces: Square[] = [];
  for (let r = 0; r < 8; r++) {
    for (let f = 0; f < 8; f++) {
      const piece = board[r][f];
      if (piece && piece.color === color) {
        myPieces.push(coordsToSquare(f, r));
      }
    }
  }
  for (const sq of myPieces) {
    if (game.isAttacked(sq, enemyColor)) {
      threatened.add(sq);
    }
  }
  return Array.from(threatened);
}

export function findKingSquare(fen: string, color: Color): Square | null {
  const game = new Chess(fen);
  const board = game.board();
  for (let r = 0; r < 8; r++) {
    for (let f = 0; f < 8; f++) {
      const piece = board[r][f];
      if (piece && piece.type === "k" && piece.color === color) {
        return coordsToSquare(f, r);
      }
    }
  }
  return null;
}

export function getTurn(fen: string): Color {
  return new Chess(fen).turn();
}

export function isCheck(fen: string): boolean {
  return new Chess(fen).inCheck();
}

export function isGameOver(fen: string): boolean {
  return new Chess(fen).isGameOver();
}
