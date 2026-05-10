"use client";

import { useEffect, useRef } from "react";
import { AppShell } from "./AppShell";
import { useCoach } from "@/components/coach/CoachContext";

type ComingSoonProps = {
  title: string;
  emoji: string;
  message: string;
  voice?: string;
};

export function ComingSoon({ title, emoji, message, voice }: ComingSoonProps) {
  const coach = useCoach();
  const greeted = useRef(false);

  useEffect(() => {
    if (greeted.current) return;
    greeted.current = true;
    coach.say({ text: voice ?? message, state: "thinking", durationMs: 5500 });
  }, [coach, voice, message]);

  return (
    <AppShell title={title} emoji={emoji}>
      <div className="flex-1 flex flex-col items-center justify-center text-center gap-5 px-4 max-w-[520px]">
        <span aria-hidden className="text-7xl sm:text-8xl">
          {emoji}
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold text-[var(--color-wood-dark)]">
          {title} viene pronto
        </h2>
        <p className="text-base sm:text-lg text-[var(--color-wood-dark)]/80 leading-relaxed">
          {message}
        </p>
        <span className="rounded-full bg-[var(--color-gold)] text-[var(--color-wood-dark)] px-4 py-2 text-sm font-bold shadow-[0_3px_0_0_rgba(58,36,23,0.35)]">
          ✨ Próxima fase ✨
        </span>
      </div>
    </AppShell>
  );
}
