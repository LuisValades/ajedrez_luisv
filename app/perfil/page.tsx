"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { AppShell } from "@/components/layout/AppShell";
import { useProgressStore } from "@/store/progressStore";
import { useSettingsStore } from "@/store/settingsStore";
import { useCoach } from "@/components/coach/CoachContext";
import { AVATARS, getAvatar } from "@/lib/avatars";
import { LESSONS } from "@/lib/tutorial/lessons";
import { PUZZLES, THEME_META } from "@/lib/puzzles/loader";
import { GAMES } from "@/lib/minigames/games";
import { StarBurst } from "@/components/feedback/StarBurst";
import { cn } from "@/lib/utils";

export default function PerfilPage() {
  const coach = useCoach();
  const greeted = useRef(false);
  const [editingName, setEditingName] = useState(false);
  const { childName, avatarId, setChildName, setAvatarId } = useSettingsStore();
  const {
    lessonsCompleted,
    puzzlesSolved,
    minigameStars,
    totalStars,
    badges,
  } = useProgressStore();

  useEffect(() => {
    if (greeted.current) return;
    greeted.current = true;
    const name = childName || "campeona";
    coach.say({
      text: `¡Hola ${name}! Aquí están tus medallas y estrellas.`,
      durationMs: 4500,
    });
  }, [coach, childName]);

  const avatar = getAvatar(avatarId);
  const lessonsTotal = LESSONS.length;
  const puzzlesCount = Object.keys(puzzlesSolved).length;
  const puzzlesTotal = PUZZLES.length;
  const minigameLevels = GAMES.reduce((s, g) => s + g.levels.length, 0);
  const minigamesCount = Object.values(minigameStars).reduce(
    (s, m) => s + Object.values(m).filter((x) => x > 0).length,
    0,
  );

  return (
    <AppShell title="Mi Perfil" emoji={avatar.emoji}>
      <div className="w-full max-w-[860px] flex flex-col gap-4 sm:gap-5">
        {/* Header card */}
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "rounded-3xl p-4 sm:p-6 bg-gradient-to-br shadow-[0_8px_0_0_rgba(58,36,23,0.3)]",
            avatar.bg,
            "text-[var(--color-wood-dark)]",
          )}
        >
          <div className="flex items-center gap-4 sm:gap-5">
            <span aria-hidden className="text-6xl sm:text-7xl drop-shadow-[0_3px_0_rgba(58,36,23,0.4)]">
              {avatar.emoji}
            </span>
            <div className="flex-1 min-w-0">
              {!editingName ? (
                <button
                  type="button"
                  onClick={() => setEditingName(true)}
                  className="text-left w-full"
                >
                  <p className="text-2xl sm:text-3xl font-bold leading-tight truncate drop-shadow-[0_1px_0_rgba(255,255,255,0.4)]">
                    {childName || "Toca para escribir tu nombre"}
                  </p>
                  <p className="text-sm opacity-80 mt-1">
                    {avatar.name} · ⭐ {totalStars}
                  </p>
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <input
                    autoFocus
                    type="text"
                    value={childName}
                    onChange={(e) => setChildName(e.target.value.slice(0, 18))}
                    placeholder="Tu nombre"
                    className="flex-1 rounded-xl bg-white/95 px-3 py-2 text-lg font-bold text-[var(--color-wood-dark)] outline-none ring-2 ring-[var(--color-gold)]"
                  />
                  <button
                    type="button"
                    onClick={() => setEditingName(false)}
                    className="rounded-xl bg-[var(--color-success)] text-white px-3 py-2 text-sm font-bold shadow"
                  >
                    OK
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-3">
            <Stat label="Lecciones" value={`${lessonsCompleted.length}/${lessonsTotal}`} emoji="🎓" />
            <Stat label="Puzzles" value={`${puzzlesCount}/${puzzlesTotal}`} emoji="🧩" />
            <Stat label="Niveles" value={`${minigamesCount}/${minigameLevels}`} emoji="🎮" />
          </div>
        </motion.section>

        {/* Avatar selector */}
        <section className="rounded-3xl bg-white/85 p-4 sm:p-5 shadow-[0_6px_0_0_rgba(58,36,23,0.25)]">
          <h3 className="text-lg sm:text-xl font-bold text-[var(--color-wood-dark)] mb-2">
            Elige tu avatar
          </h3>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 sm:gap-3">
            {AVATARS.map((a) => (
              <button
                key={a.id}
                type="button"
                onClick={() => setAvatarId(a.id)}
                aria-label={a.name}
                aria-pressed={avatar.id === a.id}
                className={cn(
                  "aspect-square rounded-2xl bg-gradient-to-br p-2 flex items-center justify-center text-3xl sm:text-4xl shadow-[0_4px_0_0_rgba(58,36,23,0.25)] active:translate-y-[2px]",
                  a.bg,
                  avatar.id === a.id && "ring-4 ring-[var(--color-gold)]",
                )}
              >
                {a.emoji}
              </button>
            ))}
          </div>
        </section>

        {/* Badges */}
        <section className="rounded-3xl bg-white/85 p-4 sm:p-5 shadow-[0_6px_0_0_rgba(58,36,23,0.25)]">
          <h3 className="text-lg sm:text-xl font-bold text-[var(--color-wood-dark)] mb-2">
            Medallas obtenidas ({badges.length})
          </h3>
          {badges.length === 0 ? (
            <p className="text-sm text-[var(--color-wood-dark)]/60 italic">
              Completa lecciones para ganar tus primeras medallas.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {badges.map((b) => {
                const lessonId = b.replace("lesson-", "");
                const lesson = LESSONS.find((l) => l.id === lessonId);
                return (
                  <span
                    key={b}
                    className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-gold)] text-[var(--color-wood-dark)] px-3 py-1 text-xs font-bold shadow"
                  >
                    <span aria-hidden>{lesson?.emoji ?? "🏅"}</span>
                    {lesson?.badge ?? b}
                  </span>
                );
              })}
            </div>
          )}
        </section>

        {/* Lessons progress */}
        <section className="rounded-3xl bg-white/85 p-4 sm:p-5 shadow-[0_6px_0_0_rgba(58,36,23,0.25)]">
          <h3 className="text-lg sm:text-xl font-bold text-[var(--color-wood-dark)] mb-2">
            Tutorial
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {LESSONS.map((l) => {
              const done = lessonsCompleted.includes(l.id);
              return (
                <Link
                  key={l.id}
                  href={`/tutorial/${l.id}`}
                  className={cn(
                    "rounded-2xl px-3 py-2 flex items-center gap-2 text-sm font-semibold",
                    done
                      ? "bg-[var(--color-success)]/15 text-[var(--color-success)]"
                      : "bg-white text-[var(--color-wood-dark)]/70",
                  )}
                >
                  <span aria-hidden className="text-2xl">{l.emoji}</span>
                  <span className="flex-1">{l.title}</span>
                  <span>{done ? "✅" : "—"}</span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Mini-games progress */}
        <section className="rounded-3xl bg-white/85 p-4 sm:p-5 shadow-[0_6px_0_0_rgba(58,36,23,0.25)]">
          <h3 className="text-lg sm:text-xl font-bold text-[var(--color-wood-dark)] mb-2">
            Mini-Juegos
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {GAMES.map((g) => {
              const stars = g.levels.reduce(
                (s, l) => s + (minigameStars[g.id]?.[l.index] ?? 0),
                0,
              );
              const max = g.levels.length * 3;
              return (
                <Link
                  key={g.id}
                  href={`/minijuegos/${g.id}`}
                  className="rounded-2xl bg-white px-3 py-2 flex items-center gap-2 text-sm font-semibold text-[var(--color-wood-dark)]"
                >
                  <span aria-hidden className="text-2xl">{g.emoji}</span>
                  <span className="flex-1">{g.title}</span>
                  <span className="text-[var(--color-gold)] font-bold">
                    {stars}/{max} ⭐
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Puzzles by theme */}
        <section className="rounded-3xl bg-white/85 p-4 sm:p-5 shadow-[0_6px_0_0_rgba(58,36,23,0.25)]">
          <h3 className="text-lg sm:text-xl font-bold text-[var(--color-wood-dark)] mb-2">
            Puzzles
          </h3>
          {(["mate-en-1", "captura", "defiende-rey", "promociona-peon"] as const).map(
            (theme) => {
              const themeMeta = THEME_META[theme];
              const themePuzzles = PUZZLES.filter((p) => p.tema === theme);
              const themeSolved = themePuzzles.filter(
                (p) => puzzlesSolved[p.id]?.stars,
              ).length;
              return (
                <div
                  key={theme}
                  className="flex items-center gap-2 py-1.5 text-sm font-semibold text-[var(--color-wood-dark)]"
                >
                  <span aria-hidden className="text-xl">{themeMeta.emoji}</span>
                  <span className="flex-1">{themeMeta.label}</span>
                  <span className="text-[var(--color-wood-dark)]/70">
                    {themeSolved}/{themePuzzles.length}
                  </span>
                </div>
              );
            },
          )}
          {Object.values(puzzlesSolved).length > 0 && (
            <div className="mt-3 pt-3 border-t border-[var(--color-wood-dark)]/15 flex items-center justify-between">
              <span className="text-sm font-bold text-[var(--color-wood-dark)]">
                Estrellas totales en puzzles:
              </span>
              <StarBurst
                stars={Math.min(
                  3,
                  Math.round(
                    Object.values(puzzlesSolved).reduce(
                      (s, p) => s + p.stars,
                      0,
                    ) / Object.values(puzzlesSolved).length,
                  ),
                )}
                size="md"
              />
            </div>
          )}
        </section>
      </div>
    </AppShell>
  );
}

function Stat({ label, value, emoji }: { label: string; value: string; emoji: string }) {
  return (
    <div className="rounded-xl bg-white/70 px-3 py-2 text-center">
      <div className="text-xl sm:text-2xl">{emoji}</div>
      <div className="text-base sm:text-lg font-extrabold text-[var(--color-wood-dark)]">
        {value}
      </div>
      <div className="text-[10px] sm:text-xs uppercase tracking-wide text-[var(--color-wood-dark)]/70 font-bold">
        {label}
      </div>
    </div>
  );
}
