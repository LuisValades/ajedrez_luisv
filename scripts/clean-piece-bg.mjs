#!/usr/bin/env node
/**
 * Reads each PNG in public/pieces/, detects the background color from the
 * corners (which we assume to be background, not piece), and writes a new
 * version with that color replaced by transparency.
 *
 * Tolerance is generous so anti-aliased edges fade smoothly.
 */
import sharp from "sharp";
import { readdir, rename, unlink } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PIECES_DIR = join(__dirname, "..", "public", "pieces");

// Generous euclidean distance threshold in RGB (0..441). A bit looser than
// strict equal because edges have anti-alias halo.
const HARD_THRESHOLD = 18;
const SOFT_THRESHOLD = 60;

async function processFile(file) {
  const path = join(PIECES_DIR, file);
  const img = sharp(path).ensureAlpha();
  const meta = await img.metadata();
  const { width, height } = meta;
  if (!width || !height) {
    console.warn(`  ! ${file} has no dimensions, skipping`);
    return;
  }

  const raw = await img.raw().toBuffer();
  // RGBA, 4 bytes per pixel.

  // Sample background from 4 corners (5x5 patch each, average).
  const sampleCorner = (sx, sy) => {
    let r = 0, g = 0, b = 0, n = 0;
    for (let dy = 0; dy < 5; dy++) {
      for (let dx = 0; dx < 5; dx++) {
        const x = sx + dx;
        const y = sy + dy;
        const i = (y * width + x) * 4;
        r += raw[i];
        g += raw[i + 1];
        b += raw[i + 2];
        n += 1;
      }
    }
    return [r / n, g / n, b / n];
  };

  const corners = [
    sampleCorner(0, 0),
    sampleCorner(width - 5, 0),
    sampleCorner(0, height - 5),
    sampleCorner(width - 5, height - 5),
  ];
  // Average all 4 corners.
  const bgR = corners.reduce((s, c) => s + c[0], 0) / 4;
  const bgG = corners.reduce((s, c) => s + c[1], 0) / 4;
  const bgB = corners.reduce((s, c) => s + c[2], 0) / 4;

  console.log(
    `  ${file}: ${width}x${height}, bg ≈ rgb(${bgR.toFixed(0)}, ${bgG.toFixed(0)}, ${bgB.toFixed(0)})`,
  );

  // Build new buffer with alpha replaced where pixel is close to bg.
  const out = Buffer.alloc(raw.length);
  let removed = 0;
  for (let i = 0; i < raw.length; i += 4) {
    const r = raw[i];
    const g = raw[i + 1];
    const b = raw[i + 2];
    const a = raw[i + 3];
    const dist = Math.sqrt(
      (r - bgR) * (r - bgR) +
        (g - bgG) * (g - bgG) +
        (b - bgB) * (b - bgB),
    );
    let alpha = a;
    if (dist <= HARD_THRESHOLD) {
      alpha = 0;
      removed += 1;
    } else if (dist <= SOFT_THRESHOLD) {
      // Soft fade for edges
      const t = (dist - HARD_THRESHOLD) / (SOFT_THRESHOLD - HARD_THRESHOLD);
      alpha = Math.round(a * t);
    }
    out[i] = r;
    out[i + 1] = g;
    out[i + 2] = b;
    out[i + 3] = alpha;
  }

  // Write to temp first, then rename — avoids file-handle conflicts.
  const tmpPath = `${path}.tmp`;
  await sharp(out, { raw: { width, height, channels: 4 } })
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toFile(tmpPath);
  try {
    await unlink(path);
  } catch {
    /* file may not exist */
  }
  await rename(tmpPath, path);

  const pct = ((removed / (raw.length / 4)) * 100).toFixed(1);
  console.log(`    → ${removed} pixels removed (${pct}%)`);
}

async function main() {
  const files = (await readdir(PIECES_DIR)).filter((f) => f.endsWith(".png"));
  console.log(`Cleaning ${files.length} PNG files in ${PIECES_DIR}\n`);
  for (const f of files) {
    try {
      await processFile(f);
    } catch (err) {
      console.error(`  ✗ ${f} failed:`, err.message);
    }
  }
  console.log("\n✓ Done");
}

main();
