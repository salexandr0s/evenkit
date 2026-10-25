"use client";

// Adapted from lucide-animated (MIT), commit 4662fff2b60fdcf4751b32013606756caf7c4c26.
import { motion } from "motion/react";
import { iconDuration, iconEase, type AnimatedGlyphProps } from "./motion.js";

export function HeartMotion({ controls }: AnimatedGlyphProps) {
    return (<motion.g animate={controls} transition={{
            duration: iconDuration * 2,
            ease: iconEase
        }} variants={{
            normal: { scale: 1 },
            animate: { scale: [1, 1.08, 1] }
        }} initial="normal">
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
        </motion.g>);
}
