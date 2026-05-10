"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export type DrakoState = "idle" | "talking" | "celebrating" | "thinking";

type DrakoAvatarProps = {
  state?: DrakoState;
  size?: number;
  className?: string;
};

export function DrakoAvatar({
  state = "idle",
  size = 96,
  className,
}: DrakoAvatarProps) {
  const isTalking = state === "talking";
  const isCelebrating = state === "celebrating";
  const isThinking = state === "thinking";

  const wingFlap = {
    rotate: isCelebrating ? [-30, 30, -30] : [-8, 8, -8],
  };
  const wingTransition = {
    duration: isCelebrating ? 0.45 : 1.6,
    repeat: Infinity,
    ease: "easeInOut" as const,
  };

  const bodyBob = {
    y: isCelebrating ? [-6, 6, -6] : [0, -3, 0],
  };
  const bodyTransition = {
    duration: isCelebrating ? 0.5 : 2.2,
    repeat: Infinity,
    ease: "easeInOut" as const,
  };

  const mouthOpen = isTalking;

  return (
    <motion.div
      className={cn("relative inline-block select-none", className)}
      style={{ width: size, height: size }}
      animate={bodyBob}
      transition={bodyTransition}
    >
      <svg
        viewBox="0 0 120 120"
        width={size}
        height={size}
        xmlns="http://www.w3.org/2000/svg"
        style={{ filter: "drop-shadow(0 6px 8px rgba(58,36,23,0.35))" }}
      >
        <defs>
          <radialGradient id="drakoBody" cx="40%" cy="35%" r="80%">
            <stop offset="0%" stopColor="#a4d864" />
            <stop offset="55%" stopColor="#6fa83a" />
            <stop offset="100%" stopColor="#3f6e1c" />
          </radialGradient>
          <radialGradient id="drakoBelly" cx="50%" cy="55%" r="60%">
            <stop offset="0%" stopColor="#fff5c8" />
            <stop offset="100%" stopColor="#f3c768" />
          </radialGradient>
          <radialGradient id="drakoWing" cx="40%" cy="35%" r="80%">
            <stop offset="0%" stopColor="#ff7a59" />
            <stop offset="100%" stopColor="#c43a1f" />
          </radialGradient>
        </defs>

        {/* shadow */}
        <ellipse cx="60" cy="112" rx="34" ry="5" fill="rgba(58,36,23,0.25)" />

        {/* wings */}
        <motion.g style={{ originX: 0.5, originY: 0.6 }} animate={wingFlap} transition={wingTransition}>
          <path
            d="M16 56 Q4 30 28 26 Q34 38 36 60 Q26 64 16 56 Z"
            fill="url(#drakoWing)"
            stroke="#3a2417"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            d="M104 56 Q116 30 92 26 Q86 38 84 60 Q94 64 104 56 Z"
            fill="url(#drakoWing)"
            stroke="#3a2417"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </motion.g>

        {/* body */}
        <ellipse
          cx="60"
          cy="74"
          rx="34"
          ry="32"
          fill="url(#drakoBody)"
          stroke="#3a2417"
          strokeWidth="2.5"
        />

        {/* belly */}
        <ellipse cx="60" cy="82" rx="20" ry="18" fill="url(#drakoBelly)" stroke="#3a2417" strokeWidth="1.5" />

        {/* belly stripes */}
        <path d="M48 78 Q60 80 72 78" fill="none" stroke="#c98a3f" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M50 86 Q60 88 70 86" fill="none" stroke="#c98a3f" strokeWidth="1.5" strokeLinecap="round" />

        {/* head */}
        <circle cx="60" cy="46" r="26" fill="url(#drakoBody)" stroke="#3a2417" strokeWidth="2.5" />

        {/* spikes on head */}
        <path
          d="M44 24 L46 16 L52 22 L56 14 L60 22 L64 14 L68 22 L74 16 L76 24 Z"
          fill="#3f6e1c"
          stroke="#3a2417"
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* horns */}
        <path d="M40 28 Q34 18 38 12 Q44 18 44 28 Z" fill="#fff5c8" stroke="#3a2417" strokeWidth="2" strokeLinejoin="round" />
        <path d="M80 28 Q86 18 82 12 Q76 18 76 28 Z" fill="#fff5c8" stroke="#3a2417" strokeWidth="2" strokeLinejoin="round" />

        {/* eyes */}
        <g>
          {isThinking ? (
            <>
              <path d="M44 44 Q50 40 56 44" fill="none" stroke="#3a2417" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M64 44 Q70 40 76 44" fill="none" stroke="#3a2417" strokeWidth="2.5" strokeLinecap="round" />
            </>
          ) : (
            <>
              <ellipse cx="50" cy="44" rx="6" ry="7" fill="#ffffff" stroke="#3a2417" strokeWidth="1.5" />
              <ellipse cx="70" cy="44" rx="6" ry="7" fill="#ffffff" stroke="#3a2417" strokeWidth="1.5" />
              <motion.circle
                cx="51"
                cy="45"
                r="3"
                fill="#1a1a1a"
                animate={{ y: isCelebrating ? [-1, 1, -1] : [0, 0.5, 0] }}
                transition={{ duration: isCelebrating ? 0.4 : 2, repeat: Infinity }}
              />
              <motion.circle
                cx="71"
                cy="45"
                r="3"
                fill="#1a1a1a"
                animate={{ y: isCelebrating ? [-1, 1, -1] : [0, 0.5, 0] }}
                transition={{ duration: isCelebrating ? 0.4 : 2, repeat: Infinity }}
              />
              <circle cx="49.5" cy="43.5" r="1" fill="#ffffff" />
              <circle cx="69.5" cy="43.5" r="1" fill="#ffffff" />
            </>
          )}
        </g>

        {/* nostrils */}
        <circle cx="56" cy="56" r="1.4" fill="#3a2417" />
        <circle cx="64" cy="56" r="1.4" fill="#3a2417" />

        {/* mouth */}
        {mouthOpen ? (
          <motion.ellipse
            cx="60"
            cy="62"
            rx="6"
            ry="5"
            fill="#7a1f17"
            stroke="#3a2417"
            strokeWidth="1.8"
            animate={{ ry: [3, 5, 3] }}
            transition={{ duration: 0.35, repeat: Infinity, ease: "easeInOut" }}
          />
        ) : isCelebrating ? (
          <path
            d="M50 62 Q60 72 70 62"
            fill="#7a1f17"
            stroke="#3a2417"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        ) : (
          <path
            d="M52 62 Q60 66 68 62"
            fill="none"
            stroke="#3a2417"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
        )}

        {/* cheeks */}
        <circle cx="42" cy="56" r="3" fill="#ff8aa3" opacity="0.6" />
        <circle cx="78" cy="56" r="3" fill="#ff8aa3" opacity="0.6" />

        {/* tiny tail */}
        <path
          d="M92 80 Q108 78 110 90 Q104 92 100 88 Q96 86 92 86 Z"
          fill="url(#drakoBody)"
          stroke="#3a2417"
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* thinking bubble */}
        {isThinking && (
          <g>
            <motion.circle
              cx="92"
              cy="20"
              r="3"
              fill="#ffffff"
              stroke="#3a2417"
              strokeWidth="1.5"
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            />
            <motion.circle
              cx="100"
              cy="14"
              r="4.5"
              fill="#ffffff"
              stroke="#3a2417"
              strokeWidth="1.5"
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: 0.3 }}
            />
            <motion.circle
              cx="110"
              cy="6"
              r="6"
              fill="#ffffff"
              stroke="#3a2417"
              strokeWidth="1.5"
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: 0.6 }}
            />
          </g>
        )}

        {/* celebration sparkles */}
        {isCelebrating && (
          <g>
            <motion.text
              x="14"
              y="30"
              fontSize="14"
              animate={{ opacity: [0, 1, 0], y: [30, 18, 30] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            >
              ✨
            </motion.text>
            <motion.text
              x="100"
              y="28"
              fontSize="14"
              animate={{ opacity: [0, 1, 0], y: [28, 16, 28] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: 0.4 }}
            >
              ⭐
            </motion.text>
            <motion.text
              x="56"
              y="14"
              fontSize="14"
              animate={{ opacity: [0, 1, 0], y: [14, 4, 14] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: 0.8 }}
            >
              🎉
            </motion.text>
          </g>
        )}
      </svg>
    </motion.div>
  );
}
