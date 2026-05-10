"use client";

export type SpeakOptions = {
  rate?: number;
  pitch?: number;
  volume?: number;
  interrupt?: boolean;
  onEnd?: () => void;
  onStart?: () => void;
};

type QueueItem = {
  text: string;
  options: SpeakOptions;
};

class SpeechCoach {
  private queue: QueueItem[] = [];
  private speaking = false;
  private unlocked = false;
  private cachedVoice: SpeechSynthesisVoice | null = null;
  private listeners = new Set<(state: { speaking: boolean }) => void>();
  private mutedRef = false;

  get supported(): boolean {
    if (typeof window === "undefined") return false;
    return "speechSynthesis" in window;
  }

  get isSpeaking(): boolean {
    return this.speaking;
  }

  setMuted(muted: boolean) {
    this.mutedRef = muted;
    if (muted) this.cancel();
  }

  subscribe(listener: (state: { speaking: boolean }) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((l) => l({ speaking: this.speaking }));
  }

  /**
   * Must be called inside a user gesture (touchstart/click) to satisfy
   * iOS / Safari autoplay policy. Speaks an empty utterance to "unlock".
   */
  unlock() {
    if (!this.supported || this.unlocked) return;
    try {
      const u = new SpeechSynthesisUtterance(" ");
      u.volume = 0;
      u.lang = "es-MX";
      window.speechSynthesis.speak(u);
      this.unlocked = true;
    } catch {
      /* ignore */
    }
  }

  private pickVoice(): SpeechSynthesisVoice | null {
    if (this.cachedVoice) return this.cachedVoice;
    if (!this.supported) return null;
    const voices = window.speechSynthesis.getVoices();
    if (!voices.length) return null;
    const score = (v: SpeechSynthesisVoice) => {
      let s = 0;
      const name = v.name.toLowerCase();
      const lang = v.lang.toLowerCase();
      if (lang === "es-mx") s += 100;
      else if (lang.startsWith("es-")) s += 40;
      else if (lang.startsWith("es")) s += 20;
      if (name.includes("paulina") || name.includes("juan") || name.includes("mexico"))
        s += 50;
      if (name.includes("google")) s += 8;
      if (name.includes("microsoft")) s += 5;
      if (name.includes("female") || name.includes("femen")) s += 6;
      return s;
    };
    const best = [...voices].sort((a, b) => score(b) - score(a))[0];
    this.cachedVoice = best ?? null;
    return this.cachedVoice;
  }

  speak(text: string, options: SpeakOptions = {}) {
    if (!this.supported || this.mutedRef) {
      options.onStart?.();
      options.onEnd?.();
      return;
    }
    if (options.interrupt) this.cancel();
    this.queue.push({ text, options });
    this.flush();
  }

  cancel() {
    if (!this.supported) return;
    this.queue = [];
    try {
      window.speechSynthesis.cancel();
    } catch {
      /* ignore */
    }
    this.speaking = false;
    this.notify();
  }

  private flush() {
    if (!this.supported) return;
    if (this.speaking) return;
    const next = this.queue.shift();
    if (!next) return;
    const utter = new SpeechSynthesisUtterance(next.text);
    const voice = this.pickVoice();
    if (voice) utter.voice = voice;
    utter.lang = voice?.lang ?? "es-MX";
    utter.rate = next.options.rate ?? 1.0;
    utter.pitch = next.options.pitch ?? 1.15;
    utter.volume = next.options.volume ?? 1.0;
    utter.onstart = () => {
      this.speaking = true;
      this.notify();
      next.options.onStart?.();
    };
    utter.onend = () => {
      this.speaking = false;
      next.options.onEnd?.();
      this.notify();
      this.flush();
    };
    utter.onerror = () => {
      this.speaking = false;
      next.options.onEnd?.();
      this.notify();
      this.flush();
    };
    try {
      window.speechSynthesis.speak(utter);
    } catch {
      this.speaking = false;
      next.options.onEnd?.();
      this.notify();
      this.flush();
    }
  }
}

export const speechCoach: SpeechCoach =
  typeof window !== "undefined"
    ? ((window as unknown as { __reino_speech?: SpeechCoach }).__reino_speech ??=
        new SpeechCoach())
    : (new SpeechCoach() as SpeechCoach);

if (typeof window !== "undefined" && "speechSynthesis" in window) {
  // Voices may load async on Chrome / Edge.
  window.speechSynthesis.onvoiceschanged = () => {
    (speechCoach as unknown as { cachedVoice: SpeechSynthesisVoice | null }).cachedVoice = null;
  };
}
