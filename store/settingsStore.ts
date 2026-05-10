"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { speechCoach } from "@/lib/audio/speech";
import { sfx } from "@/lib/audio/sfx";
import type { AvatarId } from "@/lib/avatars";
import type { ThemeId } from "@/lib/themes";

type SettingsState = {
  voiceOn: boolean;
  musicOn: boolean;
  sfxOn: boolean;
  audioUnlocked: boolean;
  themeId: ThemeId;
  showCoordsAlways: boolean;
  showHintsAlways: boolean;
  childName: string;
  avatarId: AvatarId;
  setVoiceOn: (v: boolean) => void;
  setMusicOn: (v: boolean) => void;
  setSfxOn: (v: boolean) => void;
  unlockAudio: () => void;
  setThemeId: (v: ThemeId) => void;
  setShowCoordsAlways: (v: boolean) => void;
  setShowHintsAlways: (v: boolean) => void;
  setChildName: (v: string) => void;
  setAvatarId: (v: AvatarId) => void;
};

type LegacyV2 = { pieceSet?: "wood" | "kids" | "princess" };

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      voiceOn: true,
      musicOn: false,
      sfxOn: true,
      audioUnlocked: false,
      themeId: "ninos",
      showCoordsAlways: false,
      showHintsAlways: true,
      childName: "",
      avatarId: "princesa" as AvatarId,
      setVoiceOn: (v) => {
        set({ voiceOn: v });
        speechCoach.setMuted(!v);
      },
      setMusicOn: (v) => set({ musicOn: v }),
      setSfxOn: (v) => {
        set({ sfxOn: v });
        sfx.setMuted(!v);
      },
      unlockAudio: () => {
        if (get().audioUnlocked) return;
        speechCoach.unlock();
        sfx.unlock();
        sfx.setMuted(!get().sfxOn);
        set({ audioUnlocked: true });
      },
      setThemeId: (v) => set({ themeId: v }),
      setShowCoordsAlways: (v) => set({ showCoordsAlways: v }),
      setShowHintsAlways: (v) => set({ showHintsAlways: v }),
      setChildName: (v) => set({ childName: v }),
      setAvatarId: (v) => set({ avatarId: v }),
    }),
    {
      name: "reino-settings",
      storage: createJSONStorage(() => localStorage),
      version: 3,
      migrate: (persisted, fromVersion) => {
        if (!persisted || typeof persisted !== "object") return persisted as Partial<SettingsState>;
        // v2 -> v3: pieceSet (wood|kids|princess) -> themeId (clasico|ninos|ninas)
        if (fromVersion < 3) {
          const legacy = persisted as LegacyV2 & Partial<SettingsState>;
          const map: Record<string, ThemeId> = {
            wood: "clasico",
            kids: "ninos",
            princess: "ninas",
          };
          const nextId = legacy.pieceSet ? map[legacy.pieceSet] ?? "ninos" : "ninos";
          legacy.themeId = nextId;
          delete legacy.pieceSet;
        }
        return persisted as Partial<SettingsState>;
      },
      partialize: (s) => ({
        voiceOn: s.voiceOn,
        musicOn: s.musicOn,
        sfxOn: s.sfxOn,
        themeId: s.themeId,
        showCoordsAlways: s.showCoordsAlways,
        showHintsAlways: s.showHintsAlways,
        childName: s.childName,
        avatarId: s.avatarId,
      }),
    },
  ),
);
