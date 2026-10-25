"use client";

// Adapted from lucide-animated (MIT), commit 4662fff2b60fdcf4751b32013606756caf7c4c26.
import { motion } from "motion/react";
import { iconDuration, iconEase, type AnimatedGlyphProps } from "./motion.js";

export function CompassMotion({ controls }: AnimatedGlyphProps) {
    return (<g>
          <circle cx="12" cy="12" r="10"/>
          <motion.polygon animate={controls} points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" transition={{
            duration: iconDuration,
            ease: iconEase
        }} variants={{
            normal: {
                rotate: 0
            },
            animate: {
                rotate: 360
            }
        }} initial="normal"/>
        </g>);
}
