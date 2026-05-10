"use client";

import { DrakoAvatar } from "./DrakoAvatar";
import { SpeechBubble } from "./SpeechBubble";
import { useCoach } from "./CoachContext";
import { cn } from "@/lib/utils";

type CoachOverlayProps = {
  position?: "bottom-right" | "bottom-left" | "inline";
  size?: number;
  className?: string;
};

export function CoachOverlay({
  position = "bottom-right",
  size = 96,
  className,
}: CoachOverlayProps) {
  const { state, bubble } = useCoach();

  if (position === "inline") {
    return (
      <div className={cn("flex items-end gap-3", className)}>
        <DrakoAvatar state={state} size={size} />
        <SpeechBubble text={bubble} tail="left" />
      </div>
    );
  }

  const positionClasses =
    position === "bottom-right"
      ? "bottom-3 right-3 sm:bottom-5 sm:right-5 flex-row-reverse"
      : "bottom-3 left-3 sm:bottom-5 sm:left-5 flex-row";

  return (
    <div
      className={cn(
        "fixed z-40 flex items-end gap-2 sm:gap-3 pointer-events-none",
        positionClasses,
        className,
      )}
    >
      <div className="pointer-events-auto">
        <DrakoAvatar state={state} size={size} />
      </div>
      {bubble && (
        <div className="pointer-events-auto mb-2">
          <SpeechBubble
            text={bubble}
            tail={position === "bottom-right" ? "right" : "left"}
          />
        </div>
      )}
    </div>
  );
}
