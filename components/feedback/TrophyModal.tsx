"use client";

import { motion } from "framer-motion";
import { Confetti } from "./Confetti";
import { StarBurst } from "./StarBurst";
import { cn } from "@/lib/utils";

type TrophyModalProps = {
  open: boolean;
  emoji: string;
  title: string;
  subtitle?: string;
  stars?: number;
  totalStars?: number;
  primaryLabel: string;
  onPrimary: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
  tertiaryLabel?: string;
  onTertiary?: () => void;
};

export function TrophyModal({
  open,
  emoji,
  title,
  subtitle,
  stars,
  totalStars = 3,
  primaryLabel,
  onPrimary,
  secondaryLabel,
  onSecondary,
  tertiaryLabel,
  onTertiary,
}: TrophyModalProps) {
  if (!open) return null;
  return (
    <>
      <Confetti burstKey={`${title}-${stars}`} />
      <motion.div
        role="dialog"
        aria-modal="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-wood-dark)]/55 backdrop-blur-sm p-4"
      >
        <motion.div
          initial={{ scale: 0.85, y: 24, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 320, damping: 24 }}
          className={cn(
            "relative w-full max-w-md rounded-3xl p-6 sm:p-8 text-center",
            "bg-gradient-to-br from-[#fff7d6] via-[#ffd97a] to-[#f59e0b]",
            "border-4 border-[var(--color-gold)]",
            "shadow-[0_18px_40px_-12px_rgba(0,0,0,0.5)] text-[var(--color-wood-dark)]",
          )}
        >
          <motion.div
            animate={{ rotate: [-6, 6, -6, 0], scale: [1, 1.15, 1] }}
            transition={{ duration: 1.4, repeat: 1 }}
            className="text-7xl sm:text-8xl mx-auto"
          >
            {emoji}
          </motion.div>

          <h2 className="mt-3 text-3xl sm:text-4xl font-bold">{title}</h2>
          {subtitle && (
            <p className="mt-1 text-base sm:text-lg opacity-90">{subtitle}</p>
          )}

          {stars !== undefined && (
            <div className="mt-3 flex justify-center">
              <StarBurst stars={stars} total={totalStars} size="lg" />
            </div>
          )}

          <div className="mt-6 flex flex-col gap-3">
            <button
              type="button"
              onClick={onPrimary}
              className="rounded-2xl bg-[var(--color-success)] text-white px-6 py-4 text-lg font-bold shadow-[0_5px_0_0_rgba(58,36,23,0.4)] active:translate-y-[3px] active:shadow-[0_2px_0_0_rgba(58,36,23,0.4)]"
            >
              {primaryLabel}
            </button>
            <div className="flex gap-2">
              {secondaryLabel && (
                <button
                  type="button"
                  onClick={onSecondary}
                  className="flex-1 rounded-2xl bg-white text-[var(--color-wood-dark)] px-4 py-3 text-sm font-bold shadow-[0_4px_0_0_rgba(58,36,23,0.3)] active:translate-y-[2px] active:shadow-[0_2px_0_0_rgba(58,36,23,0.3)]"
                >
                  {secondaryLabel}
                </button>
              )}
              {tertiaryLabel && (
                <button
                  type="button"
                  onClick={onTertiary}
                  className="flex-1 rounded-2xl bg-[var(--color-wood-dark)] text-white px-4 py-3 text-sm font-bold shadow-[0_4px_0_0_rgba(58,36,23,0.3)] active:translate-y-[2px] active:shadow-[0_2px_0_0_rgba(58,36,23,0.3)]"
                >
                  {tertiaryLabel}
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
}
