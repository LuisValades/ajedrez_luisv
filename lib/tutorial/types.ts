import type { LessonId } from "@/store/progressStore";
import type { Square } from "@/lib/chessEngine";

export type LessonStep =
  | {
      kind: "narrate";
      text: string;
      durationMs?: number;
      highlight?: Square[];
    }
  | {
      kind: "tap-piece";
      text: string;
      fen: string;
      target: Square;
      hintAfterMs?: number;
    }
  | {
      kind: "make-move";
      text: string;
      fen: string;
      from: Square;
      /** Allowed destination squares (any of). */
      to: Square[];
      /** Friendly hint after 2 wrong attempts. */
      pista?: string;
    }
  | {
      kind: "freeplay";
      text: string;
      fen: string;
      goalText?: string;
    };

export type Lesson = {
  id: LessonId;
  title: string;
  emoji: string;
  subtitle: string;
  /** Required to be completed before this one. */
  requires?: LessonId[];
  steps: LessonStep[];
  closingText: string;
  badge: string;
};
