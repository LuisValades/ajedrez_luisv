"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { speechCoach } from "@/lib/audio/speech";
import { sfx } from "@/lib/audio/sfx";
import type { AvatarId } from "@/lib/avatars";
import type { PieceSetId } from "@/lib/pieceSets";

type SettingsState = {
  voiceOn: boolean;
  musicOn: boolean;
  sfxOn: boolean;
  audioUnlocked: boolean;
  pieceSet: PieceSetId;
  showCoordsAlways: boolean;
  showHintsAlways: boolean;
  childName: string;
  avatarId: AvatarId;
  setVoiceOn: (v: boolean) => void;
  setMusicOn: (v: boolean) => void;
  setSfxOn: (v: boolean) => void;
  unlockAudio: () => void;
  setPieceSet: (v: PieceSetId) => void;
  setShowCoordsAlways: (v: boolean) => void;
  setShowHintsAlways: (v: boolean) => void;
  setChildName: (v: string) => void;
  setAvatarId: (v: AvatarId) => void;
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      voiceOn: true,
      musicOn: false,
      sfxOn: true,
      audioUnlocked: false,
      pieceSet: "kids" as PieceSetId,
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
      setPieceSet: (v) => set({ pieceSet: v }),
      setShowCoordsAlways: (v) => set({ showCoordsAlways: v }),
      setShowHintsAlways: (v) => set({ showHintsAlways: v }),
      setChildName: (v) => set({ childName: v }),
      setAvatarId: (v) => set({ avatarId: v }),
    }),
    {
      name: "reino-settings",
      storage: createJSONStorage(() => localStorage),
      version: 2,
      migrate: (persisted, fromVersion) => {
        // v1 -> v2: force kids skin (cartoon redesign).
        if (fromVersion < 2 && persisted && typeof persisted === "object") {
          (persisted as { pieceSet?: PieceSetId }).pieceSet = "kids";
        }
        return persisted as Partial<SettingsState>;
      },
      partialize: (s) => ({
        voiceOn: s.voiceOn,
        musicOn: s.musicOn,
        sfxOn: s.sfxOn,
        pieceSet: s.pieceSet,
        showCoordsAlways: s.showCoordsAlways,
        showHintsAlways: s.showHintsAlways,
        childName: s.childName,
        avatarId: s.avatarId,
      }),
    },
  ),
);
