"use client";

// Adapted from lucide-animated (MIT), commit 4662fff2b60fdcf4751b32013606756caf7c4c26.
import { motion } from "motion/react";
import { iconDuration, iconEase, type AnimatedGlyphProps } from "./motion.js";

export function PlusMotion({ controls }: AnimatedGlyphProps) {
    return (<motion.g animate={controls} transition={{ duration: iconDuration, ease: iconEase }} variants={{
            normal: {
                rotate: 0
            },
            animate: {
                rotate: 180
            }
        }} initial="normal">
          <path d="M5 12h14"/>
          <path d="M12 5v14"/>
        </motion.g>);
}
