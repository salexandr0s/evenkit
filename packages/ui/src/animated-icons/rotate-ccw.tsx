"use client";

// Adapted from lucide-animated (MIT), commit 4662fff2b60fdcf4751b32013606756caf7c4c26.
import { motion } from "motion/react";
import { iconDuration, iconEase, type AnimatedGlyphProps } from "./motion.js";

export function RotateCcwMotion({ controls }: AnimatedGlyphProps) {
    return (<motion.g animate={controls} transition={{ duration: iconDuration, ease: iconEase }} variants={{
            normal: { rotate: "0deg" },
            animate: { rotate: "-50deg" }
        }} initial="normal">
          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
          <path d="M3 3v5h5"/>
        </motion.g>);
}
