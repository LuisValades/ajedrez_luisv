"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type StarBurstProps = {
  stars: number;
  total?: number;
  size?: "sm" | "md" | "lg";
  showEmpty?: boolean;
  className?: string;
};

const SIZE_CLASS = {
  sm: "text-xl",
  md: "text-3xl",
  lg: "text-5xl",
};

export function StarBurst({
  stars,
  total = 3,
  size = "md",
  showEmpty = true,
  className,
}: StarBurstProps) {
  return (
    <div className={cn("inline-flex items-center gap-1", className)}>
      {Array.from({ length: total }).map((_, i) => {
        const filled = i < stars;
        if (!filled && !showEmpty) return null;
        return (
          <motion.span
            key={i}
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.12 * i, type: "spring", stiffness: 320, damping: 14 }}
            className={cn(
              SIZE_CLASS[size],
              "leading-none drop-shadow-[0_2px_0_rgba(58,36,23,0.4)]",
              !filled && "grayscale opacity-30",
            )}
            aria-hidden
          >
            ⭐
          </motion.span>
        );
      })}
    </div>
  );
}
