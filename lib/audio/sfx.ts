"use client";

/**
 * Synthesized sound effects via Web Audio API. No external assets required.
 * Each sound is a tiny composition of oscillators and envelopes.
 */

export type SfxKind =
  | "move"
  | "capture"
  | "check"
  | "win"
  | "error"
  | "click"
  | "star";

class SfxManager {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private muted = false;
  private unlocked = false;

  get supported(): boolean {
    if (typeof window === "undefined") return false;
    return "AudioContext" in window || "webkitAudioContext" in window;
  }

  setMuted(v: boolean) {
    this.muted = v;
    if (this.masterGain) {
      this.masterGain.gain.value = v ? 0 : 0.55;
    }
  }

  unlock() {
    if (this.unlocked || !this.supported) return;
    this.ensureCtx();
    if (this.ctx?.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
    this.unlocked = true;
  }

  private ensureCtx() {
    if (this.ctx) return this.ctx;
    if (!this.supported) return null;
    const Ctor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    this.ctx = new Ctor();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = this.muted ? 0 : 0.55;
    this.masterGain.connect(this.ctx.destination);
    return this.ctx;
  }

  play(kind: SfxKind) {
    if (this.muted || !this.supported) return;
    const ctx = this.ensureCtx();
    if (!ctx || !this.masterGain) return;
    const t0 = ctx.currentTime;
    switch (kind) {
      case "move":
        this.tone(t0, { freq: 480, type: "triangle", attack: 0.005, decay: 0.12, gain: 0.32 });
        this.tone(t0 + 0.02, { freq: 360, type: "sine", attack: 0.005, decay: 0.1, gain: 0.18 });
        break;
      case "capture":
        this.tone(t0, { freq: 220, type: "square", attack: 0.005, decay: 0.18, gain: 0.45 });
        this.tone(t0 + 0.04, { freq: 110, type: "triangle", attack: 0.005, decay: 0.22, gain: 0.32 });
        break;
      case "check":
        this.tone(t0, { freq: 880, type: "sawtooth", attack: 0.005, decay: 0.15, gain: 0.4 });
        this.tone(t0 + 0.12, { freq: 660, type: "sawtooth", attack: 0.005, decay: 0.15, gain: 0.32 });
        break;
      case "win":
        this.tone(t0, { freq: 523.25, type: "triangle", attack: 0.005, decay: 0.18, gain: 0.4 }); // C5
        this.tone(t0 + 0.16, { freq: 659.25, type: "triangle", attack: 0.005, decay: 0.18, gain: 0.4 }); // E5
        this.tone(t0 + 0.32, { freq: 783.99, type: "triangle", attack: 0.005, decay: 0.22, gain: 0.45 }); // G5
        this.tone(t0 + 0.5, { freq: 1046.5, type: "triangle", attack: 0.005, decay: 0.45, gain: 0.5 }); // C6
        break;
      case "error":
        this.tone(t0, { freq: 200, type: "square", attack: 0.005, decay: 0.18, gain: 0.4 });
        this.tone(t0 + 0.1, { freq: 150, type: "square", attack: 0.005, decay: 0.2, gain: 0.35 });
        break;
      case "click":
        this.tone(t0, { freq: 720, type: "sine", attack: 0.002, decay: 0.06, gain: 0.22 });
        break;
      case "star":
        this.tone(t0, { freq: 1320, type: "triangle", attack: 0.005, decay: 0.16, gain: 0.32 });
        this.tone(t0 + 0.08, { freq: 1760, type: "triangle", attack: 0.005, decay: 0.18, gain: 0.32 });
        break;
    }
  }

  private tone(
    startTime: number,
    opts: {
      freq: number;
      type: OscillatorType;
      attack: number;
      decay: number;
      gain: number;
    },
  ) {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = opts.type;
    osc.frequency.value = opts.freq;
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(opts.gain, startTime + opts.attack);
    gain.gain.exponentialRampToValueAtTime(
      0.0001,
      startTime + opts.attack + opts.decay,
    );
    osc.connect(gain).connect(this.masterGain);
    osc.start(startTime);
    osc.stop(startTime + opts.attack + opts.decay + 0.05);
  }
}

export const sfx: SfxManager =
  typeof window !== "undefined"
    ? ((window as unknown as { __reino_sfx?: SfxManager }).__reino_sfx ??=
        new SfxManager())
    : (new SfxManager() as SfxManager);
