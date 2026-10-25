"use client";

// Adapted from lucide-animated (MIT), commit 4662fff2b60fdcf4751b32013606756caf7c4c26.
import { motion } from "motion/react";
import { iconDuration, iconEase, type AnimatedGlyphProps } from "./motion.js";

export function SearchMotion({ controls }: AnimatedGlyphProps) {
    return (<motion.g animate={controls} transition={{
            duration: iconDuration * 3,
            ease: iconEase
        }} variants={{
            normal: { x: 0, y: 0 },
            animate: {
                x: [0, 0, -3, 0],
                y: [0, -4, 0, 0]
            }
        }} initial="normal">
          <circle cx="11" cy="11" r="8"/>
          <path d="m21 21-4.3-4.3"/>
        </motion.g>);
}
