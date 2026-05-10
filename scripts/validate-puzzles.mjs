#!/usr/bin/env node
import { Chess } from "chess.js";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const path = join(__dirname, "..", "lib", "puzzles", "catalog.json");
const puzzles = JSON.parse(readFileSync(path, "utf8"));

let pass = 0;
let fail = 0;
const failures = [];

for (const p of puzzles) {
  const issues = [];
  let game;
  try {
    game = new Chess(p.fen);
  } catch (e) {
    issues.push(`Invalid FEN: ${e.message}`);
    failures.push({ id: p.id, issues });
    fail++;
    continue;
  }

  // Verify side to move matches "lado"
  const expectedSide = p.lado === "blancas" ? "w" : "b";
  if (game.turn() !== expectedSide) {
    issues.push(
      `Lado mismatch: FEN says ${game.turn()} but puzzle says ${p.lado}`,
    );
  }

  // Apply solution moves
  for (let i = 0; i < p.solucion.length; i++) {
    const san = p.solucion[i];
    let move;
    try {
      move = game.move(san);
    } catch (e) {
      issues.push(`Move ${i + 1} "${san}" illegal: ${e.message}`);
      break;
    }
    if (!move) {
      issues.push(`Move ${i + 1} "${san}" rejected by chess.js`);
      break;
    }
  }

  // For mate-en-1 puzzles, verify final state is checkmate
  if (issues.length === 0 && p.tema === "mate-en-1") {
    if (!game.isCheckmate()) {
      issues.push(
        `Tema mate-en-1 but final state is not checkmate (in_check=${game.inCheck()})`,
      );
    }
  }

  if (issues.length === 0) {
    pass++;
  } else {
    fail++;
    failures.push({ id: p.id, titulo: p.titulo, fen: p.fen, issues });
  }
}

console.log(`\n${pass}/${puzzles.length} puzzles OK`);
if (fail > 0) {
  console.log(`\n❌ ${fail} failed:`);
  for (const f of failures) {
    console.log(`\n  ${f.id} — ${f.titulo}`);
    console.log(`    FEN: ${f.fen}`);
    for (const issue of f.issues) console.log(`    • ${issue}`);
  }
  process.exit(1);
}
console.log("✅ All puzzles valid");
