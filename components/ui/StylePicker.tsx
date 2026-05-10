"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Palette, X } from "lucide-react";
import { THEMES_LIST, type Theme, type ThemeId } from "@/lib/themes";
import { PieceSvg } from "@/components/board/Pieces";
import { useSettingsStore } from "@/store/settingsStore";
import { useMediaQuery } from "@/lib/useMediaQuery";
import { cn } from "@/lib/utils";

type Props = { className?: string };

/**
 * Single trigger (palette icon) that opens either a bottom-sheet (mobile/tablet)
 * or a popover anchored to the icon (desktop ≥1024px). Both reuse the same
 * vertical-list rendering so adding more themes scales without redesign.
 */
export function StylePicker({ className }: Props) {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const themeId = useSettingsStore((s) => s.themeId);
  const setThemeId = useSettingsStore((s) => s.setThemeId);

  useEffect(() => {
    if (!open) return;
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [open]);

  const select = (id: ThemeId) => {
    setThemeId(id);
    setTimeout(() => setOpen(false), 200);
  };

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Cambiar estilo del tablero"
        aria-haspopup="dialog"
        aria-expanded={open}
        className={cn(
          "inline-flex items-center justify-center h-12 w-12 rounded-2xl shadow-[0_4px_0_0_rgba(58,36,23,0.35)] active:translate-y-[2px] active:shadow-[0_2px_0_0_rgba(58,36,23,0.35)]",
          "bg-gradient-to-br from-[#fbcfe8] via-[#a78bfa] to-[#22d3ee] text-white",
          className,
        )}
      >
        <Palette size={20} />
      </button>

      <AnimatePresence>
        {open && isDesktop && (
          <DesktopPopover
            themeId={themeId}
            onSelect={select}
            onClose={() => setOpen(false)}
          />
        )}
        {open && !isDesktop && (
          <MobileSheet
            themeId={themeId}
            onSelect={select}
            onClose={() => setOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function DesktopPopover({
  themeId,
  onSelect,
  onClose,
}: {
  themeId: ThemeId;
  onSelect: (id: ThemeId) => void;
  onClose: () => void;
}) {
  return (
    <>
      {/* Click-outside catcher (transparent, doesn't dim like the mobile backdrop) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-40"
        onClick={onClose}
      />
      <motion.div
        role="dialog"
        aria-label="Estilo del tablero"
        initial={{ opacity: 0, y: -8, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -8, scale: 0.95 }}
        transition={{ type: "spring", stiffness: 380, damping: 28 }}
        className="absolute right-0 top-[calc(100%+8px)] z-50 w-[360px] rounded-3xl bg-white p-3 shadow-[0_18px_40px_-12px_rgba(0,0,0,0.5)] border-2 border-[var(--color-wood-dark)]/15"
      >
        <header className="flex items-center justify-between px-2 pb-2">
          <p className="text-sm font-bold text-[var(--color-wood-dark)] flex items-center gap-1.5">
            <Palette size={16} /> Estilo del tablero
          </p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="rounded-lg bg-[var(--color-wood-dark)]/8 p-1.5 text-[var(--color-wood-dark)]"
          >
            <X size={14} />
          </button>
        </header>
        <ul className="flex flex-col gap-1.5 max-h-[60vh] overflow-y-auto">
          {THEMES_LIST.map((t) => (
            <ThemeRow
              key={t.id}
              theme={t}
              active={t.id === themeId}
              compact
              onClick={() => onSelect(t.id)}
            />
          ))}
        </ul>
      </motion.div>
    </>
  );
}

function MobileSheet({
  themeId,
  onSelect,
  onClose,
}: {
  themeId: ThemeId;
  onSelect: (id: ThemeId) => void;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <motion.div
        role="dialog"
        aria-label="Estilo del tablero"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 360, damping: 32 }}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 0.5 }}
        onDragEnd={(_, info) => {
          if (info.offset.y > 80 || info.velocity.y > 500) onClose();
        }}
        className="w-full max-w-[560px] rounded-t-3xl bg-white px-4 pt-2 pb-6 shadow-[0_-12px_40px_-8px_rgba(0,0,0,0.5)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* drag handle */}
        <div className="mx-auto mb-2 h-1.5 w-10 rounded-full bg-[var(--color-wood-dark)]/20" aria-hidden />
        <header className="flex items-center justify-between px-1 mb-3">
          <h3 className="text-base font-bold text-[var(--color-wood-dark)] flex items-center gap-2">
            <Palette size={18} /> Elige el estilo del tablero
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="rounded-xl bg-[var(--color-wood-dark)]/10 p-2 text-[var(--color-wood-dark)]"
          >
            <X size={18} />
          </button>
        </header>
        <ul className="flex flex-col gap-2 max-h-[55vh] overflow-y-auto">
          {THEMES_LIST.map((t) => (
            <ThemeRow
              key={t.id}
              theme={t}
              active={t.id === themeId}
              onClick={() => onSelect(t.id)}
            />
          ))}
        </ul>
      </motion.div>
    </motion.div>
  );
}

function ThemeRow({
  theme,
  active,
  compact = false,
  onClick,
}: {
  theme: Theme;
  active: boolean;
  compact?: boolean;
  onClick: () => void;
}) {
  const thumbSize = compact ? 56 : 64;
  return (
    <li>
      <button
        type="button"
        onClick={onClick}
        aria-pressed={active}
        className={cn(
          "w-full flex items-center gap-3 rounded-2xl border-2 bg-white p-2 text-left",
          "transition-all hover:bg-[var(--color-wood-dark)]/5 active:scale-[0.99]",
          compact ? "min-h-[74px]" : "min-h-[88px]",
          active
            ? "border-[var(--color-gold)] ring-2 ring-[var(--color-gold)]/40"
            : "border-[var(--color-wood-dark)]/15",
        )}
      >
        <ThemeThumb theme={theme} size={thumbSize} />
        <div className="flex-1 min-w-0">
          <p
            className={cn(
              "font-bold text-[var(--color-wood-dark)] leading-tight flex items-center gap-1.5",
              compact ? "text-sm" : "text-base",
            )}
          >
            <span aria-hidden>{theme.emoji}</span>
            <span className="truncate">{theme.name}</span>
            <span className="text-xs font-medium text-[var(--color-wood-dark)]/60 truncate">
              · {theme.short}
            </span>
          </p>
          <p
            className={cn(
              "text-[var(--color-wood-dark)]/65 leading-snug mt-0.5",
              compact ? "text-[11px]" : "text-[13px]",
            )}
          >
            {theme.description}
          </p>
        </div>
        {active && (
          <span
            aria-hidden
            className="shrink-0 inline-flex h-7 w-7 items-center justify-center rounded-full bg-[var(--color-gold)] text-[var(--color-wood-dark)]"
          >
            <Check size={16} strokeWidth={3} />
          </span>
        )}
      </button>
    </li>
  );
}

function ThemeThumb({ theme, size }: { theme: Theme; size: number }) {
  return (
    <span
      className="shrink-0 inline-block rounded-xl overflow-hidden"
      style={{
        width: size,
        height: size,
        background: theme.board.frame,
        padding: 2,
      }}
      aria-hidden
    >
      <span
        className="grid grid-cols-2 grid-rows-2 w-full h-full overflow-hidden rounded-lg"
        style={{ display: "grid" }}
      >
        {Array.from({ length: 4 }).map((_, i) => {
          const f = i % 2;
          const r = Math.floor(i / 2);
          const isDark = (f + r) % 2 === 1;
          const showWhite = i === 0;
          const showBlack = i === 3;
          return (
            <span
              key={i}
              style={{
                background: isDark ? theme.board.dark : theme.board.light,
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {showWhite && (
                <PieceSvg
                  piece={{ type: "q", color: "w" }}
                  size={Math.floor(size * 0.42)}
                  palette={theme.player1}
                  themeOverride={theme}
                />
              )}
              {showBlack && (
                <PieceSvg
                  piece={{ type: "n", color: "b" }}
                  size={Math.floor(size * 0.42)}
                  palette={theme.player2}
                  themeOverride={theme}
                />
              )}
            </span>
          );
        })}
      </span>
    </span>
  );
}
