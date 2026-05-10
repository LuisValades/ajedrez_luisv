"use client";

import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

type Tail = "left" | "right" | "bottom";

type SpeechBubbleProps = {
  text: string | null;
  tail?: Tail;
  className?: string;
  variant?: "warm" | "info";
};

export function SpeechBubble({
  text,
  tail = "left",
  className,
  variant = "warm",
}: SpeechBubbleProps) {
  return (
    <AnimatePresence mode="wait">
      {text && (
        <motion.div
          key={text}
          initial={{ opacity: 0, scale: 0.85, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -4 }}
          transition={{ type: "spring", stiffness: 360, damping: 28 }}
          className={cn(
            "relative max-w-[280px] sm:max-w-[340px] rounded-3xl px-4 py-3 sm:px-5 sm:py-4 text-base sm:text-lg font-semibold leading-snug shadow-[0_6px_0_0_rgba(58,36,23,0.25)]",
            variant === "warm"
              ? "bg-white text-[var(--color-wood-dark)] border-2 border-[var(--color-gold)]"
              : "bg-[var(--color-wood-dark)] text-white border-2 border-[var(--color-gold-soft)]",
            className,
          )}
          role="status"
          aria-live="polite"
        >
          {text}
          {tail === "left" && (
            <span
              aria-hidden
              className={cn(
                "absolute -left-3 top-6 w-0 h-0",
                "border-y-[10px] border-r-[14px] border-y-transparent",
                variant === "warm"
                  ? "border-r-[var(--color-gold)]"
                  : "border-r-[var(--color-gold-soft)]",
              )}
            />
          )}
          {tail === "right" && (
            <span
              aria-hidden
              className={cn(
                "absolute -right-3 top-6 w-0 h-0",
                "border-y-[10px] border-l-[14px] border-y-transparent",
                variant === "warm"
                  ? "border-l-[var(--color-gold)]"
                  : "border-l-[var(--color-gold-soft)]",
              )}
            />
          )}
          {tail === "bottom" && (
            <span
              aria-hidden
              className={cn(
                "absolute -bottom-3 left-8 w-0 h-0",
                "border-x-[10px] border-t-[14px] border-x-transparent",
                variant === "warm"
                  ? "border-t-[var(--color-gold)]"
                  : "border-t-[var(--color-gold-soft)]",
              )}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
