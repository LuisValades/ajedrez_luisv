"use client";

import { useEffect, useRef } from "react";
import { Lock, Volume2, VolumeX } from "lucide-react";
import Link from "next/link";
import { CoachOverlay } from "@/components/coach/CoachOverlay";
import { useCoach } from "@/components/coach/CoachContext";
import { StylePicker } from "@/components/ui/StylePicker";
import { PieceLegendButton } from "@/components/board/PieceLegend";
import { HomeMenuCard } from "@/components/layout/HomeMenuCard";
import { useSettingsStore } from "@/store/settingsStore";
import { useProgressStore } from "@/store/progressStore";
import { getAvatar } from "@/lib/avatars";
import { cn } from "@/lib/utils";

let stockfishWarmed = false;
function warmStockfish() {
  if (stockfishWarmed) return;
  stockfishWarmed = true;
  // Lazy-import so home bundle stays small; browser fetches the chunk + worker file in idle.
  import("@/lib/stockfish/StockfishEngine")
    .then((mod) => mod.getStockfish().init())
    .catch(() => {
      stockfishWarmed = false;
    });
}

function warmVoices() {
  if (typeof window === "undefined") return;
  if (!("speechSynthesis" in window)) return;
  // Touching getVoices() triggers async voice load on Chrome/Edge.
  try {
    window.speechSynthesis.getVoices();
  } catch {
    /* ignore */
  }
}

const HOVER_LINES: Record<string, string> = {
  aprender:
    "Aprender — aquí Drako te enseña cómo se mueve cada pieza, paso a pasito.",
  minijuegos:
    "Mini-juegos — diviértete con cada pieza en aventuras del reino.",
  puzzles:
    "Puzzles — pequeños retos para tu cerebrito de ajedrecista.",
  partida:
    "Partida — escoge a tu rival del reino y juega de verdad.",
  libre:
    "Modo libre — mueve las piezas como tú quieras y prueba el tablero mágico.",
  duo:
    "Dos jugadoras — túrnense en el mismo dispositivo, con o sin pistas.",
};

export default function HomePage() {
  const coach = useCoach();
  const { voiceOn, setVoiceOn, audioUnlocked, unlockAudio, avatarId, childName } = useSettingsStore();
  const totalStars = useProgressStore((s) => s.totalStars);
  const avatar = getAvatar(avatarId);
  const greetedRef = useRef(false);

  useEffect(() => {
    if (greetedRef.current) return;
    greetedRef.current = true;
    warmVoices();
    coach.say({
      text: "¡Hola! Soy Drako, tu dragón amigo. ¿Qué quieres hacer hoy?",
      durationMs: 6000,
      silent: !audioUnlocked,
    });
  }, [coach, audioUnlocked]);

  const onHover = (key: keyof typeof HOVER_LINES) => {
    coach.say({ text: HOVER_LINES[key], durationMs: 4500, silent: !audioUnlocked });
    if (key === "partida") warmStockfish();
  };

  return (
    <main
      className="min-h-dvh flex flex-col items-center px-3 pt-4 pb-6 sm:pt-6 gap-5"
      onPointerDown={() => {
        unlockAudio();
        warmVoices();
        warmStockfish();
      }}
    >
      <header className="w-full max-w-[860px] flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span
            aria-hidden
            className="inline-flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--color-gold-soft)] to-[var(--color-gold)] text-3xl shadow-[0_4px_0_0_rgba(58,36,23,0.4)]"
          >
            🐲
          </span>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold leading-tight tracking-tight text-[var(--color-wood-dark)]">
              ReinoChess
            </h1>
            <p className="text-xs sm:text-sm text-[var(--color-wood-dark)]/70">
              El reino mágico del ajedrez
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <PieceLegendButton />
          <StylePicker />
          <button
            type="button"
            aria-label={voiceOn ? "Apagar voz de Drako" : "Encender voz de Drako"}
            aria-pressed={voiceOn}
            onClick={() => {
              unlockAudio();
              setVoiceOn(!voiceOn);
            }}
            className={cn(
              "inline-flex items-center justify-center h-12 w-12 rounded-2xl shadow-[0_4px_0_0_rgba(58,36,23,0.35)] active:translate-y-[2px] active:shadow-[0_2px_0_0_rgba(58,36,23,0.35)]",
              voiceOn
                ? "bg-[var(--color-gold)] text-[var(--color-wood-dark)]"
                : "bg-white/80 text-[var(--color-wood-dark)]/60",
            )}
          >
            {voiceOn ? <Volume2 size={22} /> : <VolumeX size={22} />}
          </button>
          <Link
            href="/perfil"
            aria-label={`Perfil de ${childName || avatar.name}`}
            className={cn(
              "inline-flex items-center gap-1.5 px-2 sm:px-3 h-12 rounded-2xl bg-gradient-to-br shadow-[0_4px_0_0_rgba(58,36,23,0.35)] active:translate-y-[2px] active:shadow-[0_2px_0_0_rgba(58,36,23,0.35)] text-[var(--color-wood-dark)] font-bold",
              avatar.bg,
            )}
          >
            <span aria-hidden className="text-2xl">{avatar.emoji}</span>
            <span className="text-xs sm:text-sm hidden sm:inline">
              {totalStars} ⭐
            </span>
          </Link>
          <Link
            href="/config"
            aria-label="Modo papás"
            className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-white/80 text-[var(--color-wood-dark)]/70 shadow-[0_4px_0_0_rgba(58,36,23,0.35)] active:translate-y-[2px] active:shadow-[0_2px_0_0_rgba(58,36,23,0.35)]"
          >
            <Lock size={20} />
          </Link>
        </div>
      </header>

      {/* Drako greeting strip — visible on top for instant connection */}
      <section className="w-full max-w-[860px] flex justify-start">
        <CoachOverlay position="inline" size={108} />
      </section>

      {!audioUnlocked && (
        <button
          type="button"
          onClick={() => {
            unlockAudio();
            coach.say({
              text: "¡Va, ya me oyes! Elige una aventura.",
              durationMs: 4000,
            });
          }}
          className="rounded-full bg-[var(--color-success)] text-white px-5 py-2 text-sm font-bold shadow-[0_4px_0_0_rgba(58,36,23,0.35)] active:translate-y-[2px] active:shadow-[0_2px_0_0_rgba(58,36,23,0.35)]"
        >
          🔊 Toca para escucharme
        </button>
      )}

      <section className="w-full max-w-[1100px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        <HomeMenuCard
          href="/jugar"
          emoji="⚔️"
          title="Partida"
          subtitle="Juega contra Pollito, Lobo, León..."
          color="amber"
          onHover={() => onHover("partida")}
          onTap={() => unlockAudio()}
        />
        <HomeMenuCard
          href="/jugar/duo"
          emoji="👫"
          title="Dos Jugadoras"
          subtitle="Misma tablet, túrnense"
          color="emerald"
          onHover={() => onHover("duo")}
          onTap={() => unlockAudio()}
        />
        <HomeMenuCard
          href="/tutorial"
          emoji="🎓"
          title="Aprender"
          subtitle="7 lecciones con Drako"
          color="violet"
          onHover={() => onHover("aprender")}
          onTap={() => unlockAudio()}
        />
        <HomeMenuCard
          href="/minijuegos"
          emoji="🎮"
          title="Mini-Juegos"
          subtitle="6 aventuras con cada pieza"
          color="teal"
          onHover={() => onHover("minijuegos")}
          onTap={() => unlockAudio()}
        />
        <HomeMenuCard
          href="/puzzles"
          emoji="🧩"
          title="Puzzles"
          subtitle="30 retos del reino"
          color="rose"
          onHover={() => onHover("puzzles")}
          onTap={() => unlockAudio()}
        />
        <HomeMenuCard
          href="/jugar/libre"
          emoji="🎲"
          title="Modo Libre"
          subtitle="Mueve sin reglas, explora"
          color="sky"
          onHover={() => onHover("libre")}
          onTap={() => unlockAudio()}
        />
      </section>

      <p className="mt-1 text-center text-xs text-[var(--color-wood-dark)]/60">
        Toca un cofre para entrar al reino · Fase 4 piloto
      </p>
    </main>
  );
}
