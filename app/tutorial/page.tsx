"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Lock } from "lucide-react";
import { motion } from "framer-motion";
import { AppShell } from "@/components/layout/AppShell";
import { LESSONS, isLessonUnlocked } from "@/lib/tutorial/lessons";
import { useProgressStore } from "@/store/progressStore";
import { useCoach } from "@/components/coach/CoachContext";
import { StarBurst } from "@/components/feedback/StarBurst";
import { cn } from "@/lib/utils";

export default function TutorialIndexPage() {
  const lessonsCompleted = useProgressStore((s) => s.lessonsCompleted);
  const coach = useCoach();
  const greeted = useRef(false);

  useEffect(() => {
    if (greeted.current) return;
    greeted.current = true;
    coach.say({
      text: "¡Va! Aquí están tus lecciones. Empieza por la primera y vamos paso a pasito.",
      durationMs: 5000,
    });
  }, [coach]);

  return (
    <AppShell title="Aprender" emoji="🎓">
      <div className="w-full max-w-[860px] flex flex-col gap-3 sm:gap-4">
        <header className="text-center px-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-[var(--color-wood-dark)]">
            Lecciones del reino
          </h2>
          <p className="text-sm sm:text-base text-[var(--color-wood-dark)]/70">
            Completa una lección para abrir la siguiente
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {LESSONS.map((lesson, idx) => {
            const unlocked = isLessonUnlocked(lesson, lessonsCompleted);
            const done = lessonsCompleted.includes(lesson.id);
            return (
              <motion.div
                key={lesson.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Link
                  href={unlocked ? `/tutorial/${lesson.id}` : "#"}
                  aria-disabled={!unlocked}
                  onClick={(e) => {
                    if (!unlocked) {
                      e.preventDefault();
                      coach.say({
                        text: `Primero completa la lección anterior, ¿va?`,
                        durationMs: 3500,
                        state: "thinking",
                      });
                    }
                  }}
                  className={cn(
                    "relative block rounded-3xl p-4 sm:p-5 border-2 shadow-[0_8px_0_0_rgba(58,36,23,0.3)]",
                    "active:translate-y-[3px] active:shadow-[0_5px_0_0_rgba(58,36,23,0.3)]",
                    unlocked
                      ? "bg-white/90 text-[var(--color-wood-dark)] border-[var(--color-wood-dark)]/20"
                      : "bg-white/55 text-[var(--color-wood-dark)]/50 border-[var(--color-wood-dark)]/10 cursor-not-allowed",
                    done && "ring-4 ring-[var(--color-success)]/60",
                  )}
                >
                  <div className="flex items-start gap-3">
                    <span aria-hidden className="text-5xl drop-shadow-[0_2px_0_rgba(58,36,23,0.3)]">
                      {lesson.emoji}
                    </span>
                    <div className="flex-1">
                      <p className="text-xs font-bold uppercase tracking-wide text-[var(--color-wood-dark)]/60">
                        Lección {idx + 1}
                      </p>
                      <p className="text-lg sm:text-xl font-bold leading-tight">
                        {lesson.title}
                      </p>
                      <p className="text-sm opacity-80">{lesson.subtitle}</p>
                    </div>
                    {!unlocked && (
                      <span className="rounded-full bg-white/80 p-2 text-[var(--color-wood-dark)]/70">
                        <Lock size={16} />
                      </span>
                    )}
                  </div>
                  {done && (
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wide text-[var(--color-success)]">
                        ✅ Completada
                      </span>
                      <StarBurst stars={3} size="sm" />
                    </div>
                  )}
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
