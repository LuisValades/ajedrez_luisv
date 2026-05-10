"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { PuzzleRunner } from "@/components/puzzles/PuzzleRunner";
import { THEME_META, getPuzzle } from "@/lib/puzzles/loader";

type Params = { puzzleId: string };

export default function PuzzlePage({ params }: { params: Promise<Params> }) {
  const { puzzleId } = use(params);
  const puzzle = getPuzzle(puzzleId);
  if (!puzzle) notFound();
  const meta = THEME_META[puzzle.tema];
  return (
    <AppShell title={puzzle.titulo} emoji={meta.emoji} backHref="/puzzles">
      <PuzzleRunner puzzle={puzzle} />
    </AppShell>
  );
}
