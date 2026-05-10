"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Lock, Unlock, RotateCcw } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { useSettingsStore } from "@/store/settingsStore";
import { useProgressStore } from "@/store/progressStore";
import { useCoach } from "@/components/coach/CoachContext";
import { speechCoach } from "@/lib/audio/speech";
import { sfx } from "@/lib/audio/sfx";
import { PieceSetPicker } from "@/components/board/PieceSetPicker";
import { cn } from "@/lib/utils";

function generateChallenge() {
  const a = 5 + Math.floor(Math.random() * 8); // 5..12
  const b = 5 + Math.floor(Math.random() * 8); // 5..12
  return { a, b, answer: a + b };
}

export default function ConfigPage() {
  const coach = useCoach();
  const greeted = useRef(false);
  const settings = useSettingsStore();
  const progress = useProgressStore();
  const [unlocked, setUnlocked] = useState(false);
  const [challenge, setChallenge] = useState(() => generateChallenge());
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    if (greeted.current) return;
    greeted.current = true;
    coach.say({
      text: "Modo papás. Resuelve la operación para entrar.",
      durationMs: 4000,
      state: "thinking",
    });
  }, [coach]);

  const tryUnlock = () => {
    const n = parseInt(input, 10);
    if (n === challenge.answer) {
      setUnlocked(true);
      sfx.play("star");
      coach.say({ text: "Acceso de papás concedido.", durationMs: 2500 });
    } else {
      setError(true);
      sfx.play("error");
      setTimeout(() => setError(false), 600);
      setInput("");
      setChallenge(generateChallenge());
    }
  };

  if (!unlocked) {
    return (
      <AppShell title="Modo Papás" emoji="🔒">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md mx-auto rounded-3xl bg-white/90 p-6 sm:p-8 shadow-[0_8px_0_0_rgba(58,36,23,0.3)] flex flex-col items-center gap-4"
        >
          <span aria-hidden className="text-7xl">🔒</span>
          <h2 className="text-xl sm:text-2xl font-bold text-[var(--color-wood-dark)] text-center">
            Solo para papás
          </h2>
          <p className="text-sm text-[var(--color-wood-dark)]/75 text-center">
            Resuelve esta operación para entrar a la configuración.
          </p>
          <div className="flex items-center gap-3 text-3xl sm:text-4xl font-bold text-[var(--color-wood-dark)]">
            <span>{challenge.a}</span>
            <span>+</span>
            <span>{challenge.b}</span>
            <span>=</span>
            <input
              type="number"
              inputMode="numeric"
              autoFocus
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") tryUnlock();
              }}
              className={cn(
                "w-20 rounded-xl px-3 py-2 text-3xl font-bold text-center bg-white outline-none ring-2",
                error ? "ring-[var(--color-danger)] animate-pulse" : "ring-[var(--color-gold)]",
              )}
            />
          </div>
          <button
            type="button"
            onClick={tryUnlock}
            className="rounded-2xl bg-[var(--color-success)] text-white px-6 py-3 text-base font-bold shadow-[0_5px_0_0_rgba(58,36,23,0.4)] active:translate-y-[3px] active:shadow-[0_2px_0_0_rgba(58,36,23,0.4)] flex items-center gap-2"
          >
            <Unlock size={18} />
            Entrar
          </button>
          {error && (
            <p className="text-sm font-bold text-[var(--color-danger)]">
              Esa no es. ¡Intenta otra vez!
            </p>
          )}
        </motion.div>
      </AppShell>
    );
  }

  return (
    <AppShell title="Modo Papás" emoji="⚙️">
      <div className="w-full max-w-[720px] flex flex-col gap-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-2xl bg-[var(--color-success)]/15 text-[var(--color-success)] px-4 py-2 text-sm font-bold flex items-center gap-2"
        >
          <Unlock size={16} />
          Modo papás activo
        </motion.div>

        {/* Audio settings */}
        <SettingsCard title="Sonido" emoji="🔊">
          <ToggleRow
            label="Voz de Drako"
            description="El dragón habla y narra."
            value={settings.voiceOn}
            onChange={(v) => {
              settings.setVoiceOn(v);
              if (!v) speechCoach.cancel();
            }}
          />
          <ToggleRow
            label="Efectos"
            description="Sonidos de mover, capturar, jaque."
            value={settings.sfxOn}
            onChange={settings.setSfxOn}
          />
          <ToggleRow
            label="Música de fondo"
            description="Próximamente — añadiremos música del reino."
            value={settings.musicOn}
            onChange={settings.setMusicOn}
            disabled
          />
        </SettingsCard>

        {/* Piece set picker */}
        <SettingsCard title="Estilo de piezas" emoji="🎨">
          <p className="text-sm text-[var(--color-wood-dark)]/75 mb-3">
            Cambia cómo se ven las piezas y los colores del tablero.
          </p>
          <PieceSetPicker
            current={settings.pieceSet}
            onChange={settings.setPieceSet}
          />
        </SettingsCard>

        {/* Visual aids */}
        <SettingsCard title="Ayudas visuales" emoji="👁️">
          <ToggleRow
            label="Pistas siempre"
            description="Muestra movimientos legales al tocar pieza."
            value={settings.showHintsAlways}
            onChange={settings.setShowHintsAlways}
          />
          <ToggleRow
            label="Coordenadas siempre"
            description="Muestra a-h y 1-8 en el tablero."
            value={settings.showCoordsAlways}
            onChange={settings.setShowCoordsAlways}
          />
        </SettingsCard>

        {/* Stats */}
        <SettingsCard title="Estadísticas" emoji="📊">
          <StatRow label="Estrellas totales" value={`${progress.totalStars} ⭐`} />
          <StatRow label="Lecciones completadas" value={`${progress.lessonsCompleted.length} / 7`} />
          <StatRow
            label="Puzzles resueltos"
            value={`${Object.keys(progress.puzzlesSolved).length} / 30`}
          />
          <StatRow
            label="Niveles de mini-juegos"
            value={`${Object.values(progress.minigameStars).reduce(
              (s, m) => s + Object.values(m).filter((x) => x > 0).length,
              0,
            )} / 30`}
          />
          <StatRow label="Medallas" value={`${progress.badges.length}`} />
        </SettingsCard>

        {/* Danger zone */}
        <SettingsCard title="Zona delicada" emoji="⚠️" danger>
          <p className="text-sm text-[var(--color-wood-dark)]/75 mb-3">
            Borra todo el progreso de la peque (estrellas, medallas, lecciones,
            puzzles). Esta acción no se puede deshacer.
          </p>
          <DangerResetButton onReset={progress.resetAll} coachSay={coach.say} />
        </SettingsCard>
      </div>
    </AppShell>
  );
}

function SettingsCard({
  title,
  emoji,
  danger = false,
  children,
}: {
  title: string;
  emoji: string;
  danger?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section
      className={cn(
        "rounded-3xl p-4 sm:p-5 shadow-[0_6px_0_0_rgba(58,36,23,0.25)]",
        danger ? "bg-[var(--color-danger)]/10 ring-2 ring-[var(--color-danger)]/40" : "bg-white/85",
      )}
    >
      <h3 className="flex items-center gap-2 text-lg font-bold text-[var(--color-wood-dark)] mb-3">
        <span aria-hidden>{emoji}</span>
        {title}
      </h3>
      {children}
    </section>
  );
}

function ToggleRow({
  label,
  description,
  value,
  onChange,
  disabled = false,
}: {
  label: string;
  description: string;
  value: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 py-2 border-b border-[var(--color-wood-dark)]/10 last:border-0">
      <div className="flex-1">
        <p className="font-bold text-sm text-[var(--color-wood-dark)]">{label}</p>
        <p className="text-xs text-[var(--color-wood-dark)]/65">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={value}
        aria-label={label}
        disabled={disabled}
        onClick={() => onChange(!value)}
        className={cn(
          "relative w-14 h-8 rounded-full transition-colors shrink-0",
          value ? "bg-[var(--color-success)]" : "bg-[var(--color-wood-dark)]/30",
          disabled && "opacity-40 cursor-not-allowed",
        )}
      >
        <span
          className={cn(
            "absolute top-1 left-1 h-6 w-6 rounded-full bg-white shadow transition-transform",
            value && "translate-x-6",
          )}
        />
      </button>
    </div>
  );
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-2 py-1.5 text-sm border-b border-[var(--color-wood-dark)]/10 last:border-0">
      <span className="text-[var(--color-wood-dark)]/80">{label}</span>
      <span className="font-bold text-[var(--color-wood-dark)]">{value}</span>
    </div>
  );
}

function DangerResetButton({
  onReset,
  coachSay,
}: {
  onReset: () => void;
  coachSay: (s: { text: string; durationMs?: number; state?: "thinking" }) => void;
}) {
  const [stage, setStage] = useState<0 | 1 | 2>(0);

  if (stage === 0) {
    return (
      <button
        type="button"
        onClick={() => setStage(1)}
        className="w-full rounded-2xl bg-[var(--color-danger)] text-white px-4 py-3 text-sm font-bold shadow-[0_4px_0_0_rgba(58,36,23,0.4)] active:translate-y-[2px] active:shadow-[0_2px_0_0_rgba(58,36,23,0.4)] flex items-center justify-center gap-2"
      >
        <RotateCcw size={16} />
        Reiniciar progreso
      </button>
    );
  }
  if (stage === 1) {
    return (
      <div className="space-y-2">
        <p className="text-sm font-bold text-[var(--color-danger)]">
          ¿Seguro? Esta acción borra todo.
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setStage(2)}
            className="flex-1 rounded-2xl bg-[var(--color-danger)] text-white px-4 py-3 text-sm font-bold shadow"
          >
            Sí, borrar
          </button>
          <button
            type="button"
            onClick={() => setStage(0)}
            className="flex-1 rounded-2xl bg-white text-[var(--color-wood-dark)] px-4 py-3 text-sm font-bold shadow"
          >
            Cancelar
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-2">
      <p className="text-sm font-bold text-[var(--color-danger)]">
        Última confirmación. ¿Borrar TODO el progreso?
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => {
            onReset();
            setStage(0);
            coachSay({
              text: "Progreso reiniciado. Empezamos de nuevo.",
              durationMs: 3500,
              state: "thinking",
            });
          }}
          className="flex-1 rounded-2xl bg-[var(--color-danger)] text-white px-4 py-3 text-sm font-bold shadow flex items-center justify-center gap-2"
        >
          <Lock size={14} />
          Confirmar borrar
        </button>
        <button
          type="button"
          onClick={() => setStage(0)}
          className="flex-1 rounded-2xl bg-white text-[var(--color-wood-dark)] px-4 py-3 text-sm font-bold shadow"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
