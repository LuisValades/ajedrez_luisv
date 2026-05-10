"use client";

import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Settings2, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  /** Trigger button label */
  label?: string;
  /** Sheet title */
  title?: string;
  /** Number of active options — shown as a badge on the trigger */
  activeCount?: number;
  /** Children rendered inside the bottom sheet */
  children: ReactNode;
  /** Optional additional className for the trigger button */
  className?: string;
};

/**
 * Compact trigger button (e.g. "⚙ Ayudas") that opens a bottom sheet on
 * mobile and a popover on desktop. Used to collapse settings/toggles that
 * eat vertical space on small screens.
 */
export function OptionsSheet({
  label = "Ayudas",
  title = "Ayudas y opciones",
  activeCount,
  children,
  className,
}: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        className={cn(
          "relative inline-flex items-center gap-1.5 rounded-2xl px-3 py-2 text-sm font-bold",
          "bg-white/85 text-[var(--color-wood-dark)] shadow-[0_3px_0_0_rgba(58,36,23,0.25)]",
          "active:translate-y-[1px] active:shadow-[0_1px_0_0_rgba(58,36,23,0.25)]",
          "border border-[var(--color-wood-dark)]/10",
          className,
        )}
      >
        <Settings2 size={16} />
        <span>{label}</span>
        {typeof activeCount === "number" && activeCount > 0 && (
          <span className="ml-0.5 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[var(--color-gold)] px-1.5 text-[10px] font-bold leading-none text-[var(--color-wood-dark)]">
            {activeCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-[2px]"
            onClick={() => setOpen(false)}
          >
            <motion.div
              role="dialog"
              aria-label={title}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 360, damping: 32 }}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.5 }}
              onDragEnd={(_, info) => {
                if (info.offset.y > 80 || info.velocity.y > 500) setOpen(false);
              }}
              className="w-full max-w-[560px] rounded-t-3xl bg-white px-4 pt-2 pb-6 shadow-[0_-12px_40px_-8px_rgba(0,0,0,0.5)]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* drag handle */}
              <div
                className="mx-auto mb-2 h-1.5 w-10 rounded-full bg-[var(--color-wood-dark)]/20"
                aria-hidden
              />
              <header className="flex items-center justify-between px-1 mb-3">
                <h3 className="text-base font-bold text-[var(--color-wood-dark)] flex items-center gap-2">
                  <Settings2 size={18} /> {title}
                </h3>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Cerrar"
                  className="rounded-xl bg-[var(--color-wood-dark)]/10 p-2 text-[var(--color-wood-dark)]"
                >
                  <X size={18} />
                </button>
              </header>
              <div className="flex flex-col gap-2 max-h-[55vh] overflow-y-auto">
                {children}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/** A single toggle row inside the OptionsSheet. */
export function OptionRow({
  label,
  description,
  emoji,
  active,
  onClick,
}: {
  label: string;
  description?: string;
  emoji?: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "w-full flex items-center justify-between gap-3 rounded-2xl px-3 py-3 text-left border-2",
        "transition-colors active:scale-[0.99]",
        active
          ? "border-[var(--color-gold)] bg-[var(--color-gold)]/10"
          : "border-[var(--color-wood-dark)]/15 bg-white",
      )}
    >
      <span className="flex items-center gap-2.5 min-w-0">
        {emoji && <span aria-hidden className="text-2xl">{emoji}</span>}
        <span className="min-w-0">
          <span className="block font-bold text-sm text-[var(--color-wood-dark)] leading-tight">
            {label}
          </span>
          {description && (
            <span className="block text-[11px] text-[var(--color-wood-dark)]/60 leading-tight mt-0.5">
              {description}
            </span>
          )}
        </span>
      </span>
      <span
        aria-hidden
        className={cn(
          "shrink-0 inline-flex h-7 w-12 items-center rounded-full p-0.5 transition-colors",
          active ? "bg-[var(--color-gold)]" : "bg-[var(--color-wood-dark)]/20",
        )}
      >
        <span
          className={cn(
            "h-6 w-6 rounded-full bg-white shadow transition-transform",
            active ? "translate-x-5" : "translate-x-0",
          )}
        />
      </span>
    </button>
  );
}
