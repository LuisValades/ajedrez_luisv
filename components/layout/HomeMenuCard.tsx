"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export type HomeMenuCardProps = {
  href: string;
  emoji: string;
  title: string;
  subtitle: string;
  color: "violet" | "rose" | "teal" | "amber" | "emerald" | "sky";
  comingSoon?: boolean;
  onHover?: () => void;
  onTap?: () => void;
};

const COLOR_CLASSES: Record<HomeMenuCardProps["color"], string> = {
  violet:
    "from-[#a78bfa] via-[#8b5cf6] to-[#6d28d9] text-white",
  rose: "from-[#fda4af] via-[#fb7185] to-[#e11d48] text-white",
  teal: "from-[#5eead4] via-[#14b8a6] to-[#0f766e] text-white",
  amber:
    "from-[#fcd34d] via-[#f59e0b] to-[#b45309] text-[var(--color-wood-dark)]",
  emerald:
    "from-[#86efac] via-[#22c55e] to-[#15803d] text-white",
  sky: "from-[#7dd3fc] via-[#0ea5e9] to-[#075985] text-white",
};

export function HomeMenuCard({
  href,
  emoji,
  title,
  subtitle,
  color,
  comingSoon = false,
  onHover,
  onTap,
}: HomeMenuCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 380, damping: 22 }}
    >
      <Link
        href={href}
        prefetch
        onPointerEnter={onHover}
        onFocus={onHover}
        onClick={onTap}
        className={cn(
          "relative block w-full min-h-[160px] sm:min-h-[180px] rounded-3xl p-5 sm:p-6 overflow-hidden",
          "shadow-[0_10px_0_0_rgba(58,36,23,0.35)] active:translate-y-[5px] active:shadow-[0_5px_0_0_rgba(58,36,23,0.35)]",
          "bg-gradient-to-br border-2 border-[var(--color-wood-dark)]/20",
          COLOR_CLASSES[color],
        )}
      >
        <div className="flex items-start justify-between gap-2 mt-1">
          <span
            aria-hidden
            className="inline-block text-5xl sm:text-6xl leading-none drop-shadow-[0_3px_0_rgba(58,36,23,0.35)]"
            style={{ lineHeight: 1 }}
          >
            {emoji}
          </span>
          {comingSoon && (
            <span className="rounded-full bg-white/85 px-2.5 py-1 text-[10px] sm:text-[11px] font-bold uppercase tracking-wide text-[var(--color-wood-dark)]">
              Pronto
            </span>
          )}
        </div>
        <div className="mt-3 sm:mt-4">
          <p className="text-xl sm:text-2xl font-bold leading-tight drop-shadow-[0_2px_0_rgba(58,36,23,0.35)]">
            {title}
          </p>
          <p className="mt-1 text-sm sm:text-base font-medium opacity-95">
            {subtitle}
          </p>
        </div>
        <span
          aria-hidden
          className="pointer-events-none absolute -bottom-6 -right-6 h-28 w-28 rounded-full bg-white/15 blur-2xl"
        />
      </Link>
    </motion.div>
  );
}
