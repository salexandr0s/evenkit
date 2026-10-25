import { foundation } from "@project-kit/tokens";
import type { useAnimationControls, Transition } from "motion/react";

export interface AnimatedGlyphProps {
  controls: ReturnType<typeof useAnimationControls>;
}

export const iconDuration = Number.parseFloat(foundation.motion.duration.slow) / 1000;
const easing = foundation.motion.easing.standard.slice("cubic-bezier(".length, -1).split(",").map(Number);
export const iconEase: [number, number, number, number] = [easing[0]!, easing[1]!, easing[2]!, easing[3]!];
export const iconTransition: Transition = { duration: iconDuration, ease: iconEase };
