"use client";

import { motion } from "framer-motion";
import { useCallback, useMemo, useRef, useState } from "react";
import {
  STARTING_FEN,
  coordsToSquare,
  fenToBoard,
  findKingSquare,
  getCaptureMoves,
  getLegalMoves,
  getThreatenedSquares,
  isCheck,
  isPromotionMove,
  makeMove,
  squareToCoords,
  type Color,
  type MoveResult,
  type Piece,
  type Square,
} from "@/lib/chessEngine";
import { PieceSvg } from "./Pieces";
import { HintArrow } from "./HintArrow";
import { cn } from "@/lib/utils";
import { useSettingsStore } from "@/store/settingsStore";
import { getPieceSet } from "@/lib/pieceSets";

type ChessBoardProps = {
  fen?: string;
  orientation?: Color;
  showCoordinates?: boolean;
  showHints?: boolean;
  showThreats?: boolean;
  interactive?: boolean;
  /** When set, only this color may select pieces (the other side is locked). */
  playableColor?: Color;
  hintMove?: { from: Square; to: Square } | null;
  /** Externally provided last-move highlight (use when board is controlled). */
  lastMove?: { from: Square; to: Square } | null;
  onMove?: (result: MoveResult) => void;
  className?: string;
};

const FILES = ["a", "b", "c", "d", "e", "f", "g", "h"] as const;

/** Build the initial pieceId map for a board position. */
function initialPieceMap(board: (Piece | null)[][], startCounter: number) {
  const map = new Map<Square, string>();
  let counter = startCounter;
  for (let r = 0; r < 8; r++) {
    for (let f = 0; f < 8; f++) {
      const piece = board[r][f];
      if (!piece) continue;
      const sq = coordsToSquare(f, r);
      counter += 1;
      map.set(sq, `pc${counter}`);
    }
  }
  return { map, counter };
}

/**
 * Roll the previous square→pieceId map forward to the new board.
 * Uses lastMove to preserve the moving piece's id (smooth slide).
 * For unknown changes (e.g., external FEN swap with no lastMove),
 * each occupied square just keeps whatever id it had — and assigns
 * a fresh id if there was none.
 */
function rollPieceMap(
  prev: Map<Square, string>,
  board: (Piece | null)[][],
  lastMove: { from: Square; to: Square } | null,
  startCounter: number,
) {
  let counter = startCounter;
  // Step 1: apply lastMove to previous map (transfer id, drop any captured one).
  const after = new Map(prev);
  if (lastMove) {
    const movedId = after.get(lastMove.from);
    if (movedId) {
      after.delete(lastMove.from);
      after.set(lastMove.to, movedId);
    }
  }
  // Step 2: walk new board; for each occupied cell, keep id if exists, else assign.
  const next = new Map<Square, string>();
  for (let r = 0; r < 8; r++) {
    for (let f = 0; f < 8; f++) {
      const piece = board[r][f];
      if (!piece) continue;
      const sq = coordsToSquare(f, r);
      let id = after.get(sq);
      if (!id) {
        counter += 1;
        id = `pc${counter}`;
      }
      next.set(sq, id);
    }
  }
  return { map: next, counter };
}

export function ChessBoard({
  fen: controlledFen,
  orientation = "w",
  showCoordinates = false,
  showHints = true,
  showThreats = true,
  interactive = true,
  playableColor,
  hintMove,
  lastMove: externalLastMove,
  onMove,
  className,
}: ChessBoardProps) {
  const activeSkin = useSettingsStore((s) => s.pieceSet);
  const palette = getPieceSet(activeSkin).palette;
  const [internalFen, setInternalFen] = useState(controlledFen ?? STARTING_FEN);
  const fen = controlledFen ?? internalFen;
  const [rawSelected, setRawSelected] = useState<Square | null>(null);
  const [internalLastMove, setInternalLastMove] = useState<{ from: Square; to: Square } | null>(null);
  const lastMove = externalLastMove ?? internalLastMove;
  const boardRef = useRef<HTMLDivElement>(null);

  const board = useMemo(() => fenToBoard(fen), [fen]);
  const turn: Color = fen.split(" ")[1] === "b" ? "b" : "w";

  // Stable piece IDs for smooth animation. Updated via set-state-during-render
  // pattern when fen changes.
  const initial = useMemo(() => initialPieceMap(board, 0), []); // eslint-disable-line react-hooks/exhaustive-deps
  const [pieceMap, setPieceMap] = useState<Map<Square, string>>(initial.map);
  const [counter, setCounter] = useState<number>(initial.counter);
  const [trackedFen, setTrackedFen] = useState(fen);

  if (trackedFen !== fen) {
    const rolled = rollPieceMap(pieceMap, board, lastMove, counter);
    setTrackedFen(fen);
    setPieceMap(rolled.map);
    setCounter(rolled.counter);
  }

  const piecesWithIds = useMemo(() => {
    type Entry = { id: string; square: Square; piece: Piece };
    const out: Entry[] = [];
    for (let r = 0; r < 8; r++) {
      for (let f = 0; f < 8; f++) {
        const piece = board[r][f];
        if (!piece) continue;
        const sq = coordsToSquare(f, r);
        const id = pieceMap.get(sq);
        if (id) out.push({ id, square: sq, piece });
      }
    }
    return out;
  }, [board, pieceMap]);

  // Derive selection so a controlled FEN change auto-clears the highlight.
  const selected = useMemo<Square | null>(() => {
    if (!rawSelected) return null;
    const { file, rank } = squareToCoords(rawSelected);
    const piece = board[rank][file];
    if (!piece || piece.color !== turn) return null;
    if (playableColor && piece.color !== playableColor) return null;
    return rawSelected;
  }, [rawSelected, board, turn, playableColor]);
  const inCheck = isCheck(fen);
  const checkedKingSquare = inCheck ? findKingSquare(fen, turn) : null;

  const legalMoves = useMemo(
    () => (selected ? getLegalMoves(fen, selected) : []),
    [fen, selected]
  );
  const captureMoves = useMemo(
    () => (selected ? getCaptureMoves(fen, selected) : []),
    [fen, selected]
  );

  const threatened = useMemo(
    () => (showThreats && interactive ? getThreatenedSquares(fen, turn) : []),
    [fen, turn, showThreats, interactive]
  );

  const handleSquareClick = useCallback(
    (square: Square, piece: Piece | null) => {
      if (!interactive) return;
      if (selected && legalMoves.includes(square)) {
        const promotion = isPromotionMove(fen, selected, square) ? "q" : "q";
        const result = makeMove(fen, selected, square, promotion);
        if (result.ok) {
          setInternalLastMove({ from: result.from!, to: result.to! });
          if (controlledFen === undefined) setInternalFen(result.newFen);
          setRawSelected(null);
          onMove?.(result);
        }
        return;
      }
      const allowedColor = playableColor ?? turn;
      if (piece && piece.color === turn && piece.color === allowedColor) {
        setRawSelected(square);
        return;
      }
      setRawSelected(null);
    },
    [interactive, selected, legalMoves, fen, controlledFen, onMove, turn, playableColor]
  );

  const visualPos = (square: Square) => {
    const { file, rank } = squareToCoords(square);
    const visualFile = orientation === "w" ? file : 7 - file;
    const visualRank = orientation === "w" ? rank : 7 - rank;
    return { visualFile, visualRank };
  };

  const renderSquare = (file: number, rank: number) => {
    const visualFile = orientation === "w" ? file : 7 - file;
    const visualRank = orientation === "w" ? rank : 7 - rank;
    const square = coordsToSquare(visualFile, visualRank);
    const piece = board[visualRank][visualFile];
    const isDark = (visualFile + visualRank) % 2 === 1;
    const isSelected = selected === square;
    const isLastMoveFrom = lastMove?.from === square;
    const isLastMoveTo = lastMove?.to === square;
    const isLegal = showHints && legalMoves.includes(square);
    const isCapture = showHints && captureMoves.includes(square);
    const isCheckedKing = checkedKingSquare === square;

    return (
      <button
        key={square}
        type="button"
        aria-label={`Casilla ${square}${piece ? `, ${piece.color === "w" ? "blanca" : "negra"}` : ""}`}
        onClick={() => handleSquareClick(square, piece)}
        style={{ background: isDark ? palette.dark : palette.light }}
        className={cn(
          "relative aspect-square w-full flex items-center justify-center transition-colors",
          (isLastMoveFrom || isLastMoveTo) && "outline outline-4 outline-offset-[-4px]",
          isSelected && "ring-4 ring-inset",
          isCheckedKing && "glow-check"
        )}
      >
        {(isLastMoveFrom || isLastMoveTo) && (
          <span
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{ boxShadow: `inset 0 0 0 4px ${palette.lastMove}` }}
          />
        )}
        {isSelected && (
          <span
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{ boxShadow: `inset 0 0 0 4px ${palette.selected}` }}
          />
        )}
        {showCoordinates && file === 0 && (
          <span
            className="absolute top-0.5 left-1 text-[10px] font-bold pointer-events-none"
            style={{ color: isDark ? palette.light : palette.innerBorder }}
          >
            {8 - visualRank}
          </span>
        )}
        {showCoordinates && rank === 7 && (
          <span
            className="absolute bottom-0.5 right-1 text-[10px] font-bold pointer-events-none"
            style={{ color: isDark ? palette.light : palette.innerBorder }}
          >
            {FILES[visualFile]}
          </span>
        )}
        {isLegal && !isCapture && !piece && (
          <span
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            aria-hidden
          >
            <span
              className="block rounded-full dot-hint"
              style={{
                width: "30%",
                height: "30%",
                background: palette.hint,
                opacity: 0.78,
                boxShadow: `0 0 10px ${palette.hint}88`,
              }}
            />
          </span>
        )}
        {isCapture && (
          <span
            className="absolute inset-1 rounded-full pointer-events-none dot-hint"
            style={{
              border: `5px solid ${palette.capture}`,
              opacity: 0.9,
              boxShadow: `0 0 12px ${palette.capture}99`,
            }}
            aria-hidden
          />
        )}
      </button>
    );
  };

  return (
    <div
      ref={boardRef}
      className={cn(
        "relative mx-auto w-full max-w-[min(92vmin,640px)]",
        className
      )}
    >
      <div className="rounded-[20px] p-2 sm:p-3 shadow-[0_18px_40px_-12px_rgba(58,36,23,0.55)]"
        style={{
          background: `linear-gradient(145deg, ${palette.frameStart} 0%, ${palette.frameMid} 50%, ${palette.frameEnd} 100%)`,
        }}
      >
        <div className="rounded-[14px] p-1.5 sm:p-2"
          style={{ background: `linear-gradient(145deg, ${palette.borderStart}, ${palette.borderEnd})` }}
        >
          <div className="relative">
            <div
              role="grid"
              aria-label="Tablero de ajedrez"
              className="grid grid-cols-8 grid-rows-8 overflow-hidden rounded-[8px] border-2"
              style={{ borderColor: palette.innerBorder }}
            >
              {Array.from({ length: 8 }).map((_, rank) =>
                Array.from({ length: 8 }).map((_, file) => renderSquare(file, rank))
              )}
            </div>

            {/* Sprite layer — pieces are absolutely positioned and animate between cells */}
            <div className="absolute inset-0 pointer-events-none">
              {piecesWithIds.map(({ id, square, piece }) => {
                const { visualFile, visualRank } = visualPos(square);
                const isThreatenedSq = threatened.includes(square);
                return (
                  <motion.div
                    key={id}
                    layout
                    initial={false}
                    animate={{
                      left: `${visualFile * 12.5}%`,
                      top: `${visualRank * 12.5}%`,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 180,
                      damping: 24,
                      mass: 0.9,
                    }}
                    style={{
                      position: "absolute",
                      width: "12.5%",
                      height: "12.5%",
                    }}
                  >
                    <div
                      className={cn(
                        "w-full h-full flex items-center justify-center",
                        isThreatenedSq && "glow-threat rounded-full",
                      )}
                    >
                      <motion.div
                        initial={{ scale: 0.6, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 320,
                          damping: 22,
                        }}
                        className="w-[88%] h-[88%] flex items-center justify-center"
                      >
                        <PieceSvg piece={piece} size={64} />
                      </motion.div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {hintMove && (
              <HintArrow
                from={hintMove.from}
                to={hintMove.to}
                orientation={orientation}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
