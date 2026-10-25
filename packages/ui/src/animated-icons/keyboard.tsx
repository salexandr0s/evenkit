"use client";

// Adapted from lucide-animated (MIT), commit 4662fff2b60fdcf4751b32013606756caf7c4c26.
import { motion, type Variants } from "motion/react";
import { iconDuration, iconTransition, type AnimatedGlyphProps } from "./motion.js";

const keys = ["M10 8h.01", "M12 12h.01", "M14 8h.01", "M16 12h.01", "M18 8h.01", "M6 8h.01", "M7 16h10", "M8 12h.01"];
const keyVariants: Variants = {
  normal: { opacity: 1 },
  animate: (index: number) => ({
    opacity: [1, 0.2, 1],
    transition: { ...iconTransition, delay: index * iconDuration / 8 },
  }),
};

export function KeyboardMotion({ controls }: AnimatedGlyphProps) {
  return (
    <g>
      <rect height="16" rx="2" width="20" x="2" y="4" />
      {keys.map((d, index) => (
        <motion.path key={d} d={d} custom={index} initial="normal" animate={controls} variants={keyVariants} />
      ))}
    </g>
  );
}
