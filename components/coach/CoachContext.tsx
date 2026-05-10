"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { speechCoach } from "@/lib/audio/speech";
import { useSettingsStore } from "@/store/settingsStore";
import type { DrakoState } from "./DrakoAvatar";

type SaySpec = {
  text: string;
  state?: DrakoState;
  durationMs?: number;
  interrupt?: boolean;
  silent?: boolean;
};

type CoachContextValue = {
  bubble: string | null;
  state: DrakoState;
  say: (spec: SaySpec | string) => void;
  celebrate: (text: string) => void;
  think: (text?: string) => void;
  hush: () => void;
};

const Ctx = createContext<CoachContextValue | null>(null);

export function CoachProvider({ children }: { children: React.ReactNode }) {
  const [bubble, setBubble] = useState<string | null>(null);
  const [state, setState] = useState<DrakoState>("idle");
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const voiceOn = useSettingsStore((s) => s.voiceOn);

  useEffect(() => {
    speechCoach.setMuted(!voiceOn);
  }, [voiceOn]);

  const clearTimer = () => {
    if (hideTimer.current) {
      clearTimeout(hideTimer.current);
      hideTimer.current = null;
    }
  };

  const say = useCallback(
    (spec: SaySpec | string) => {
      const s: SaySpec = typeof spec === "string" ? { text: spec } : spec;
      clearTimer();
      setBubble(s.text);
      setState(s.state ?? "talking");
      const fallbackMs = Math.max(2000, Math.min(8000, s.text.length * 70));
      const total = s.durationMs ?? fallbackMs;
      if (!s.silent) {
        speechCoach.speak(s.text, {
          interrupt: s.interrupt ?? true,
          onEnd: () => {
            setState((prev) => (prev === "talking" ? "idle" : prev));
          },
        });
      } else {
        hideTimer.current = setTimeout(() => {
          setBubble(null);
          setState("idle");
        }, total);
        return;
      }
      hideTimer.current = setTimeout(() => {
        setBubble(null);
      }, total);
    },
    [],
  );

  const celebrate = useCallback(
    (text: string) => {
      clearTimer();
      setBubble(text);
      setState("celebrating");
      speechCoach.speak(text, {
        interrupt: true,
        rate: 1.05,
        pitch: 1.3,
        onEnd: () => {
          setState((prev) => (prev === "celebrating" ? "idle" : prev));
        },
      });
      hideTimer.current = setTimeout(() => setBubble(null), 4500);
    },
    [],
  );

  const think = useCallback((text?: string) => {
    clearTimer();
    setState("thinking");
    setBubble(text ?? null);
    if (text) {
      hideTimer.current = setTimeout(() => setBubble(null), 4000);
    }
  }, []);

  const hush = useCallback(() => {
    clearTimer();
    speechCoach.cancel();
    setBubble(null);
    setState("idle");
  }, []);

  const value = useMemo<CoachContextValue>(
    () => ({ bubble, state, say, celebrate, think, hush }),
    [bubble, state, say, celebrate, think, hush],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCoach(): CoachContextValue {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCoach debe usarse dentro de <CoachProvider>");
  return ctx;
}
